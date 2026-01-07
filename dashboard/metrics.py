"""
Prometheus Metrics Exporter for Pulse
Exposes /metrics endpoint for Prometheus scraping.
"""

import os
import time
from threading import Thread

import redis
from prometheus_client import Counter, Gauge, Histogram, start_http_server
from sqlalchemy import create_engine, text

# =============================================================================
# Prometheus Metrics Definitions
# =============================================================================

# Gauges (current values)
QUEUE_LENGTH = Gauge(
    "pulse_celery_queue_length",
    "Current number of tasks in Celery queue",
    ["queue_name"],
)

NOTIFICATIONS_BY_STATUS = Gauge(
    "pulse_notifications_by_status",
    "Current notification count by status",
    ["status"],
)

NOTIFICATIONS_BY_CHANNEL = Gauge(
    "pulse_notifications_by_channel",
    "Current notification count by channel",
    ["channel"],
)

FAILURE_RATE = Gauge(
    "pulse_notification_failure_rate",
    "Failure rate percentage by channel (last 24h)",
    ["channel"],
)

AVG_RETRY_ATTEMPTS = Gauge(
    "pulse_avg_retry_attempts",
    "Average retry attempts for retrying notifications",
)

# Counters (cumulative)
NOTIFICATIONS_TOTAL = Counter(
    "pulse_notifications_total",
    "Total notifications processed",
    ["channel", "status"],
)

# Histograms
DELIVERY_LATENCY = Histogram(
    "pulse_notification_delivery_latency_seconds",
    "Time from creation to sent status",
    ["channel"],
    buckets=[0.5, 1, 2, 5, 10, 30, 60, 120, 300, 600],
)

# =============================================================================
# Database & Redis Connections
# =============================================================================


def get_db_engine():
    """Create SQLAlchemy engine for PostgreSQL."""
    db_url = os.environ.get(
        "DATABASE_URL", "postgresql://postgres:postgres@db:5432/pulse"
    )
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    return create_engine(db_url)


def get_redis_client():
    """Create Redis client connection."""
    redis_url = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
    return redis.from_url(redis_url)


# =============================================================================
# Metrics Collection Functions
# =============================================================================


def collect_queue_metrics(r: redis.Redis):
    """Collect Celery queue lengths from Redis."""
    queues = ["high_priority", "low_priority", "celery"]
    for queue in queues:
        try:
            length = r.llen(queue)
            QUEUE_LENGTH.labels(queue_name=queue).set(length)
        except Exception:
            QUEUE_LENGTH.labels(queue_name=queue).set(0)


def collect_notification_metrics(engine):
    """Collect notification metrics from PostgreSQL."""
    # Status counts
    status_query = text(
        """
        SELECT status, COUNT(*) as count
        FROM notifications_notificationlog
        GROUP BY status
    """
    )

    try:
        with engine.connect() as conn:
            result = conn.execute(status_query)
            for row in result:
                NOTIFICATIONS_BY_STATUS.labels(status=row[0]).set(row[1])
    except Exception as e:
        print(f"Error collecting status metrics: {e}")

    # Channel counts
    channel_query = text(
        """
        SELECT channel, COUNT(*) as count
        FROM notifications_notificationlog
        GROUP BY channel
    """
    )

    try:
        with engine.connect() as conn:
            result = conn.execute(channel_query)
            for row in result:
                NOTIFICATIONS_BY_CHANNEL.labels(channel=row[0]).set(row[1])
    except Exception as e:
        print(f"Error collecting channel metrics: {e}")

    # Failure rates by channel (last 24h)
    failure_query = text(
        """
        SELECT 
            channel,
            ROUND(
                COUNT(*) FILTER (WHERE status = 'failed') * 100.0 / NULLIF(COUNT(*), 0), 2
            ) as fail_rate
        FROM notifications_notificationlog
        WHERE created_at > NOW() - INTERVAL '24 HOURS'
        GROUP BY channel
    """
    )

    try:
        with engine.connect() as conn:
            result = conn.execute(failure_query)
            for row in result:
                if row[1] is not None:
                    FAILURE_RATE.labels(channel=row[0]).set(float(row[1]))
    except Exception as e:
        print(f"Error collecting failure rate metrics: {e}")

    # Average retry attempts
    retry_query = text(
        """
        SELECT AVG(attempts) as avg_attempts
        FROM notifications_notificationlog
        WHERE status = 'retrying'
    """
    )

    try:
        with engine.connect() as conn:
            result = conn.execute(retry_query).fetchone()
            if result and result[0]:
                AVG_RETRY_ATTEMPTS.set(float(result[0]))
    except Exception as e:
        print(f"Error collecting retry metrics: {e}")

    # Delivery latency for recently sent notifications
    latency_query = text(
        """
        SELECT 
            channel,
            EXTRACT(EPOCH FROM (sent_at - created_at)) as latency
        FROM notifications_notificationlog
        WHERE status = 'sent' 
            AND sent_at IS NOT NULL 
            AND created_at > NOW() - INTERVAL '1 HOUR'
    """
    )

    try:
        with engine.connect() as conn:
            result = conn.execute(latency_query)
            for row in result:
                if row[1] is not None:
                    DELIVERY_LATENCY.labels(channel=row[0]).observe(float(row[1]))
    except Exception as e:
        print(f"Error collecting latency metrics: {e}")


def collect_metrics_loop(engine, r: redis.Redis, interval: int = 15):
    """Main loop to collect all metrics."""
    print(f"Starting metrics collection loop (interval: {interval}s)")
    while True:
        try:
            collect_queue_metrics(r)
            collect_notification_metrics(engine)
        except Exception as e:
            print(f"Error in metrics collection: {e}")
        time.sleep(interval)


# =============================================================================
# Main Entry Point
# =============================================================================


def main():
    """Start Prometheus metrics server and collection loop."""
    port = int(os.environ.get("METRICS_PORT", 8001))

    print(f"🚀 Starting Prometheus exporter on port {port}")
    print(f"   Metrics available at: http://localhost:{port}/metrics")

    # Start HTTP server for Prometheus scraping
    start_http_server(port)

    # Initialize connections
    engine = get_db_engine()
    r = get_redis_client()

    # Start metrics collection in main thread
    collect_metrics_loop(engine, r, interval=15)


if __name__ == "__main__":
    main()
