"""Windowed, tenant-scoped metrics for the console.

Everything here is computed from NotificationLog rows created inside the
selected window. No trend, percentile or channel figure is hardcoded.
"""

import math
from datetime import datetime, time, timedelta
from datetime import timezone as dt_timezone

from django.db.models import Avg, Count, Q
from django.db.models.functions import TruncDay, TruncHour, TruncMinute
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import NotificationTemplate
from .scoping import scoped_logs
from .serializers import MetricsResponseSerializer

WINDOWS = {
    "1h": timedelta(hours=1),
    "24h": timedelta(hours=24),
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
}
CHANNELS = ("email", "sms", "push")
STATUSES = ("pending", "sending", "sent", "failed", "retrying")


def _percentile(values: list[float], fraction: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    position = (len(ordered) - 1) * fraction
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return ordered[lower]
    weight = position - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight


def _compact(value: int) -> str:
    if value >= 1_000_000:
        return f"{value / 1_000_000:.2f}M"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K"
    return str(value)


def _floor(value: datetime, window: str) -> datetime:
    value = value.astimezone(dt_timezone.utc)
    if window == "1h":
        minute = value.minute - value.minute % 5
        return value.replace(minute=minute, second=0, microsecond=0)
    if window in {"24h", "7d"}:
        hour = value.hour
        if window == "7d":
            hour -= hour % 6
        return value.replace(hour=hour, minute=0, second=0, microsecond=0)
    return datetime.combine(value.date(), time.min, tzinfo=dt_timezone.utc)


def _step(window: str) -> timedelta:
    return {
        "1h": timedelta(minutes=5),
        "24h": timedelta(hours=1),
        "7d": timedelta(hours=6),
        "30d": timedelta(days=1),
    }[window]


def _buckets(start: datetime, end: datetime, window: str) -> list[datetime]:
    step = _step(window)
    cursor = _floor(start, window)
    values: list[datetime] = []
    while cursor <= end:
        values.append(cursor)
        cursor += step
    return values


def _trunc(window: str):
    if window == "1h":
        return TruncMinute
    if window in {"24h", "7d"}:
        return TruncHour
    return TruncDay


def _latency_values(queryset):
    """Return (all_ms, per_channel_ms) for sent rows in the window."""
    all_values: list[float] = []
    by_channel: dict[str, list[float]] = {channel: [] for channel in CHANNELS}
    rows = queryset.filter(status="sent", sent_at__isnull=False).values_list(
        "channel", "created_at", "sent_at"
    )
    for channel, created_at, sent_at in rows.iterator(chunk_size=2000):
        latency = max(0.0, (sent_at - created_at).total_seconds() * 1000)
        all_values.append(latency)
        by_channel.setdefault(channel, []).append(latency)
    return all_values, by_channel


class MetricsView(APIView):
    """Return metrics for a validated window (1h, 24h, 7d, 30d)."""

    serializer_class = MetricsResponseSerializer

    def get(self, request):
        window = request.query_params.get("window", "24h")
        if window not in WINDOWS:
            return Response(
                {"error": "window must be one of 1h, 24h, 7d, 30d"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        now = timezone.now()
        start = now - WINDOWS[window]
        previous_start = start - WINDOWS[window]
        logs = scoped_logs(request).filter(created_at__gte=start, created_at__lte=now)
        previous = scoped_logs(request).filter(
            created_at__gte=previous_start, created_at__lt=start
        )

        totals = logs.aggregate(
            total=Count("id"),
            sent=Count("id", filter=Q(status="sent")),
            failed=Count("id", filter=Q(status="failed")),
            pending=Count("id", filter=Q(status="pending")),
            sending=Count("id", filter=Q(status="sending")),
            retrying=Count("id", filter=Q(status="retrying")),
        )
        total = totals["total"]
        by_status = {key: totals[key] for key in STATUSES}
        terminal = totals["sent"] + totals["failed"]
        deliverability = totals["sent"] / terminal * 100 if terminal else None
        previous_total = previous.count()
        if previous_total:
            change = (total - previous_total) / previous_total * 100
        elif total:
            change = None
        else:
            change = 0.0

        channel_rows = {
            row["channel"]: row
            for row in logs.values("channel").annotate(
                total=Count("id"),
                sent=Count("id", filter=Q(status="sent")),
                failed=Count("id", filter=Q(status="failed")),
                pending=Count("id", filter=Q(status="pending")),
                sending=Count("id", filter=Q(status="sending")),
                retrying=Count("id", filter=Q(status="retrying")),
            )
        }
        all_latencies, channel_latencies = _latency_values(logs)

        channels = []
        for channel in dict.fromkeys([*CHANNELS, *channel_rows.keys()]):
            row = channel_rows.get(channel, {})
            channel_terminal = row.get("sent", 0) + row.get("failed", 0)
            values = channel_latencies.get(channel, [])
            channels.append(
                {
                    "channel": channel,
                    "total": row.get("total", 0),
                    "sent": row.get("sent", 0),
                    "failed": row.get("failed", 0),
                    "retrying": row.get("retrying", 0),
                    "pending": row.get("pending", 0),
                    "sending": row.get("sending", 0),
                    "success_rate": (
                        row.get("sent", 0) / channel_terminal * 100
                        if channel_terminal
                        else None
                    ),
                    "avg_latency_ms": (sum(values) / len(values) if values else None),
                    "p95_latency_ms": _percentile(values, 0.95),
                }
            )

        series_rows = (
            logs.annotate(bucket=_trunc(window)("created_at"))
            .values("bucket", "channel")
            .annotate(count=Count("id"))
            .order_by("bucket")
        )
        series: dict[datetime, dict[str, int]] = {}
        for row in series_rows:
            bucket = _floor(row["bucket"], window)
            entry = series.setdefault(
                bucket, {"email": 0, "sms": 0, "push": 0, "total": 0}
            )
            entry[row["channel"]] = entry.get(row["channel"], 0) + row["count"]
            entry["total"] += row["count"]

        series_payload = []
        for bucket in _buckets(start, now, window):
            entry = series.get(bucket, {"email": 0, "sms": 0, "push": 0, "total": 0})
            series_payload.append(
                {
                    "bucket": bucket.isoformat().replace("+00:00", "Z"),
                    "email": entry.get("email", 0),
                    "sms": entry.get("sms", 0),
                    "push": entry.get("push", 0),
                    "total": entry["total"],
                }
            )

        avg_attempts = logs.aggregate(value=Avg("attempts"))["value"]
        window_minutes = WINDOWS[window].total_seconds() / 60
        trend = f"{change:+.1f}%" if change is not None else "—"

        return Response(
            {
                "window": window,
                "generated_at": now.isoformat(),
                "total": total,
                # Legacy compact fields retained for older clients.
                "total_volume": _compact(total),
                "previous_total": previous_total,
                "volume_change_pct": change,
                "volume_trend": trend,
                "by_status": by_status,
                "deliverability": deliverability,
                "latency": {
                    "p50_ms": _percentile(all_latencies, 0.50),
                    "p95_ms": _percentile(all_latencies, 0.95),
                    "avg_ms": (
                        sum(all_latencies) / len(all_latencies)
                        if all_latencies
                        else None
                    ),
                },
                "avg_attempts": avg_attempts,
                "throughput_per_min": total / window_minutes,
                "channels": channels,
                "series": series_payload,
                "templates": NotificationTemplate.objects.count(),
            },
            status=status.HTTP_200_OK,
        )
