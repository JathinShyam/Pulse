"""Prometheus exporter for Pulse notification state.

The exporter is a separate process from the API. It reads through the Django
ORM (so it uses the same settings, database URL and timezone as the app) and
keeps the process-local counter/histogram state monotonic across scrapes.

Run with ``python dashboard/metrics.py``. The HTTP server listens on
``METRICS_PORT`` (default 8001).
"""

import logging
import os
import time
from datetime import timedelta

import django
import redis
from django.db import close_old_connections
from django.db.models import Avg, Count, Q
from django.utils import timezone
from prometheus_client import Counter, Gauge, Histogram, start_http_server

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pulse.settings")
django.setup()

from notifications.models import NotificationLog  # noqa: E402

logger = logging.getLogger("pulse.metrics")

# =============================================================================
# Prometheus metric definitions
# =============================================================================

QUEUE_LENGTH = Gauge(
    "pulse_celery_queue_length",
    "Tasks waiting in a Celery queue",
    ["queue_name"],
)

NOTIFICATIONS_BY_STATUS = Gauge(
    "pulse_notifications_by_status",
    "Current notification rows by status",
    ["status"],
)

NOTIFICATIONS_BY_CHANNEL = Gauge(
    "pulse_notifications_by_channel",
    "Current notification rows by channel",
    ["channel"],
)

FAILURE_RATE = Gauge(
    "pulse_notification_failure_rate",
    "Failed notification percentage by channel (last 24h)",
    ["channel"],
)

AVG_RETRY_ATTEMPTS = Gauge(
    "pulse_avg_retry_attempts",
    "Average attempt count for rows currently retrying",
)

NOTIFICATIONS_TOTAL = Counter(
    "pulse_notifications_total",
    "Status occurrences observed by the exporter (snapshot increases)",
    ["channel", "status"],
)

DELIVERY_LATENCY = Histogram(
    "pulse_notification_delivery_latency_seconds",
    "Time from creation to provider acknowledgement",
    ["channel"],
    buckets=[0.5, 1, 2, 5, 10, 30, 60, 120, 300, 600],
)

# Prometheus label children are never removed automatically. Remember what we
# have published so a deleted queue/channel/status does not leave a stale
# sample behind forever.
_known_queues: set[str] = set()
_known_statuses: set[str] = set()
_known_channels: set[str] = set()
_known_failure_channels: set[str] = set()
_previous_snapshot: dict[tuple[str, str], int] = {}
_snapshot_initialized = False
_last_sent_at = None


def _get_redis_client() -> redis.Redis:
    broker_url = os.environ.get(
        "CELERY_BROKER_URL", os.environ.get("REDIS_URL", "redis://redis:6379/0")
    )
    return redis.from_url(broker_url, socket_connect_timeout=3, socket_timeout=3)


def _remove_stale(gauge: Gauge, known: set[str], current: set[str]) -> None:
    for label in known - current:
        try:
            gauge.remove(label)
        except KeyError:
            pass


def collect_queue_metrics(client: redis.Redis) -> None:
    """Publish lengths for the two queues workers actually consume."""
    queues = ("high_priority", "low_priority")
    current: set[str] = set()
    for queue in queues:
        gauge = QUEUE_LENGTH.labels(queue_name=queue)
        try:
            gauge.set(client.llen(queue))
        except Exception as exc:
            # Do not publish a fake zero when Redis is unreachable.
            logger.warning("Could not read queue %s: %s", queue, exc)
            gauge.set(float("nan"))
        current.add(queue)
    _remove_stale(QUEUE_LENGTH, _known_queues, current)
    _known_queues.clear()
    _known_queues.update(current)


def collect_notification_metrics() -> None:
    """Publish status/channel gauges, failure rates and snapshot counters."""
    global _snapshot_initialized
    now = timezone.now()

    rows = list(
        NotificationLog.objects.values("channel", "status").annotate(count=Count("id"))
    )

    status_totals: dict[str, int] = {}
    channel_totals: dict[str, int] = {}
    current_statuses: set[str] = set()
    current_channels: set[str] = set()
    for row in rows:
        channel = row["channel"]
        status = row["status"]
        count = row["count"]
        status_totals[status] = status_totals.get(status, 0) + count
        channel_totals[channel] = channel_totals.get(channel, 0) + count
        current_statuses.add(status)
        current_channels.add(channel)

        key = (channel, status)
        previous = _previous_snapshot.get(key, 0)
        if _snapshot_initialized and count > previous:
            NOTIFICATIONS_TOTAL.labels(channel=channel, status=status).inc(
                count - previous
            )
        _previous_snapshot[key] = count
    _snapshot_initialized = True

    for status, count in status_totals.items():
        NOTIFICATIONS_BY_STATUS.labels(status=status).set(count)
    for channel, count in channel_totals.items():
        NOTIFICATIONS_BY_CHANNEL.labels(channel=channel).set(count)

    _remove_stale(NOTIFICATIONS_BY_STATUS, _known_statuses, current_statuses)
    _remove_stale(NOTIFICATIONS_BY_CHANNEL, _known_channels, current_channels)
    _known_statuses.clear()
    _known_statuses.update(current_statuses)
    _known_channels.clear()
    _known_channels.update(current_channels)

    failure_rows = (
        NotificationLog.objects.filter(created_at__gte=now - timedelta(hours=24))
        .values("channel")
        .annotate(
            total=Count("id"),
            failed=Count("id", filter=Q(status="failed")),
        )
    )
    current_failure_channels: set[str] = set()
    for row in failure_rows:
        channel = row["channel"]
        total = row["total"] or 0
        rate = (row["failed"] * 100.0 / total) if total else 0.0
        FAILURE_RATE.labels(channel=channel).set(rate)
        current_failure_channels.add(channel)
    _remove_stale(FAILURE_RATE, _known_failure_channels, current_failure_channels)
    _known_failure_channels.clear()
    _known_failure_channels.update(current_failure_channels)

    retry_avg = NotificationLog.objects.filter(status="retrying").aggregate(
        value=Avg("attempts")
    )["value"]
    AVG_RETRY_ATTEMPTS.set(float(retry_avg) if retry_avg is not None else float("nan"))


def collect_latency_metrics() -> None:
    """Observe each sent row once, even though the scrape loop repeats."""
    global _last_sent_at
    if _last_sent_at is None:
        _last_sent_at = timezone.now() - timedelta(hours=1)

    rows = (
        NotificationLog.objects.filter(
            status="sent",
            sent_at__isnull=False,
            sent_at__gt=_last_sent_at,
        )
        .order_by("sent_at")
        .values_list("channel", "created_at", "sent_at")
    )
    newest = _last_sent_at
    for channel, created_at, sent_at in rows.iterator():
        if created_at and sent_at and sent_at >= created_at:
            DELIVERY_LATENCY.labels(channel=channel).observe(
                (sent_at - created_at).total_seconds()
            )
            newest = max(newest, sent_at)
    _last_sent_at = newest


def collect_once(client: redis.Redis) -> None:
    try:
        collect_queue_metrics(client)
    except Exception:
        logger.exception("Queue metrics collection failed")
    try:
        collect_notification_metrics()
    except Exception:
        logger.exception("Notification metrics collection failed")
    try:
        collect_latency_metrics()
    except Exception:
        logger.exception("Latency metrics collection failed")
    close_old_connections()


def main() -> None:
    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO"),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    port = int(os.environ.get("METRICS_PORT", "8001"))
    interval = int(os.environ.get("METRICS_INTERVAL", "15"))

    start_http_server(port)
    logger.info("Prometheus exporter listening on 0.0.0.0:%s/metrics", port)

    client = _get_redis_client()
    while True:
        collect_once(client)
        time.sleep(interval)


if __name__ == "__main__":
    main()
