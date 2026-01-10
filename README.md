# Pulse

Pulse is a scalable notification and background job orchestration system built with Django, DRF, Celery, Redis, and PostgreSQL. The goal is to explore production-grade patterns such as multi-channel delivery, retries with exponential backoff, dead-letter queues, idempotency keys, rate limiting, and observability dashboards.

## High-Level Architecture

- **API Layer (Django + DRF)** – Accepts notification/job requests over REST, enforces validation, and persists metadata.
- **Task Processing (Celery)** – Handles asynchronous fan-out, retries, and scheduling across worker pools.
- **Message Broker (Redis)** – Primary broker/result backend for Celery queues; optional RabbitMQ support planned.
- **Database (PostgreSQL)** – Stores notification state, idempotency keys, audit history, and routing metadata.
- **Observability** – Real-time Streamlit dashboard, Celery Flower monitor, and Prometheus metrics exporter.

## API Documentation

When `ENABLE_DOCS=true` (default), interactive API documentation is available:

| URL                               | Description                                  |
| --------------------------------- | -------------------------------------------- |
| http://localhost:8000/api/docs/   | **Swagger UI** - Interactive API explorer    |
| http://localhost:8000/api/redoc/  | **ReDoc** - Alternative documentation viewer |
| http://localhost:8000/api/schema/ | **OpenAPI 3.0 schema** (JSON/YAML download)  |

Markdown documentation for each endpoint is also available in `notifications/docs/`.

To disable documentation in production, set `ENABLE_DOCS=false` in your `.env` file.

## Observability Dashboard

Pulse includes a comprehensive monitoring stack for real-time visibility into your notification system:

| Service   | URL                        | Description                                    |
| --------- | -------------------------- | ---------------------------------------------- |
| Dashboard | http://localhost:8501      | **Streamlit** - Live metrics & queue stats     |
| Flower    | http://localhost:5555      | **Celery Flower** - Task monitoring & workers  |
| Metrics   | http://localhost:8001/metrics | **Prometheus** - Exportable metrics endpoint |

### Dashboard Features

The Streamlit dashboard provides:

- **Queue Status**: Real-time view of high/low priority queue lengths
- **Notification Metrics**: Success/failure counts by channel and status
- **Hourly Trends**: Time-series graphs of notification throughput
- **Failure Rates**: Per-channel failure rate analysis with warning thresholds
- **Retry Analysis**: Average attempts, max retries, and retry patterns
- **Recent Notifications**: Live feed of latest notification events

### Running the Monitoring Stack

```bash
# Start all observability services
docker-compose up -d dashboard flower metrics

# Or run everything together
docker-compose up -d
```

### Prometheus Metrics

The `/metrics` endpoint exposes:

- `pulse_celery_queue_length{queue_name}` – Current queue depths
- `pulse_notifications_by_status{status}` – Counts by status
- `pulse_notification_failure_rate{channel}` – Failure % by channel
- `pulse_avg_retry_attempts` – Average retry attempts
- `pulse_notification_delivery_latency_seconds` – Delivery time histogram

Example Prometheus scrape config:

```yaml
scrape_configs:
  - job_name: 'pulse'
    static_configs:
      - targets: ['localhost:8001']
```

## Local Development

```bash
docker-compose build
docker-compose up -d
```

With the stack running:

| Service           | URL                                  | Description               |
| ----------------- | ------------------------------------ | ------------------------- |
| Django API        | http://localhost:8000                | Main API server           |
| Swagger UI        | http://localhost:8000/api/docs/      | Interactive API explorer  |
| ReDoc             | http://localhost:8000/api/redoc/     | API documentation         |
| **Flower**        | http://localhost:5555                | Celery task monitor       |
| **Dashboard**     | http://localhost:8501                | Streamlit metrics UI      |
| **Metrics**       | http://localhost:8001/metrics        | Prometheus exporter       |
| **Locust**        | http://localhost:8089                | Load testing UI           |
| Mailpit           | http://localhost:8025                | Email testing UI          |

Celery worker logs: `docker-compose logs -f celery`

### Full Stack Startup

To include all services (workers, beat, monitoring):

```bash
docker-compose build
docker-compose up -d web celery celery-beat celery-high celery-low flower dashboard metrics
```

### Example Requests

**Send a notification:**

```bash
curl -X POST http://localhost:8000/api/notifications/send/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "template_name": "welcome_email",
    "recipient": "someone@example.com",
    "channel": "email",
    "payload": { "subject": "Hello", "body": "Welcome to Pulse" }
  }'
```

**Send high-priority OTP (routed to high_priority queue):**

```bash
curl -X POST http://localhost:8000/api/notifications/send/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "template_name": "otp_verification",
    "recipient": "+1234567890",
    "channel": "sms",
    "payload": { "otp": "123456" }
  }'
```

**Check notification status:**

```bash
curl http://localhost:8000/api/notifications/status/{notification_id}/
```

**List notifications with filters:**

```bash
curl "http://localhost:8000/api/notifications/list/?user_id=user_123&status=sent&limit=10"
```

## Roadmap

| Week | Focus                                                     |
| ---- | --------------------------------------------------------- |
| 1    | Core Django + Celery setup, basic email notification task |
| 2    | Multi-channel abstraction (SMS, Push, WhatsApp)           |
| 3    | Retry policies, exponential backoff, DLQ                  |
| 4    | Idempotency keys + relational schema hardening            |
| 5    | Rate limiting, priority queues, scheduling/cron           |
| 6    | Observability dashboard + metrics exporters               |
| 7    | Horizontal scaling proof + load testing                   |
| 8    | Docs, demo video, blog posts                              |

## Rate Limiting

Pulse enforces simple, Redis-backed per-user/channel rate limits on the main
send endpoint. By default, each `(user_id, channel)` pair is limited to
**10 requests per 60-second window**. Exceeding this returns HTTP `429` with
`{"error": "Rate limit exceeded. Try again later."}`.

Implementation details:

- **Store** – Uses the existing Celery Redis broker (`CELERY_BROKER_URL`) for counters.
- **Granularity** – Fixed-time windows keyed as `rate_limit:{user_id}:{channel}`.
- **Integration** – Applied in `SendNotificationView` before a `NotificationLog`
  is created, so abusive callers never hit the DB write path.

You can tune `max_requests` and `window` in `notifications/rate_limiter.py` or
swap in a different strategy (sliding window/token bucket) while keeping the
same call-site in the view.

### Testing Rate Limits

```bash
# Send 11 requests rapidly (11th should fail with 429)
for i in {1..11}; do
  echo "Request $i:"
  curl -s -w "\nHTTP Status: %{http_code}\n" \
    -X POST http://localhost:8000/api/notifications/send/ \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "rate_test_user",
      "template_name": "test",
      "recipient": "test@example.com",
      "channel": "email",
      "payload": {"msg": "test"}
    }'
  echo "---"
done
```

Expected output: First 10 requests succeed, 11th returns `429 Too Many Requests`.

## Priority Queues

Celery workers are split into **high** and **low** priority queues:

- High-priority queue: `high_priority` (e.g., OTP / time-sensitive alerts).
- Low-priority queue: `low_priority` (e.g., newsletters, digests).

Routing rules:

- Templates whose name contains `"otp"` (case-insensitive) are routed to
  `high_priority`.
- All other notifications default to `low_priority`.

Under load, you can scale workers independently, e.g.:

```bash
docker-compose up -d --scale celery-high=3 --scale celery-low=1
```

## Scheduling (Celery Beat)

Pulse uses the built-in **Celery Beat** scheduler with a code-defined schedule:

- `cleanup_old_logs` runs daily at 02:00 to delete old `NotificationLog` rows
  in `sent`/`failed` states (default: older than 30 days).
- `send_daily_digest` is a sample recurring task that scans for “quiet” users
  over the past 7 days and logs how many would receive a digest.

These schedules are configured via `CELERY_BEAT_SCHEDULE` in `pulse/settings.py`
and are loaded directly by the Beat process at startup.

## Scaling & Load Testing

Pulse is designed for horizontal scaling and has been load-tested to handle **10K-15K+ notifications/minute**.

### Scaling Workers

Scale Celery workers dynamically:

```bash
# Scale high-priority workers (for OTP, time-sensitive)
docker-compose up -d --scale celery-high=4 --scale celery-low=2

# Or use pre-defined scaled workers (requires --profile scale)
docker-compose --profile scale up -d
```

### Load Testing with Locust

Pulse includes a Locust load testing suite to validate throughput and reliability.

```bash
# Start Locust via Docker Compose
docker-compose up -d locust

# Open Locust UI
open http://localhost:8089
```

**Recommended test settings:**
- Users: 100-200
- Spawn rate: 10-20 users/sec
- Duration: 5-10 minutes

**Test scenarios included:**
- Standard notification sends (weighted 10x)
- High-priority OTP notifications (weighted 5x)
- Status checks (weighted 2x)
- List notifications (weighted 1x)

**Expected results:**
- Throughput: 10K-15K requests/min with 4 high-priority workers
- Success rate: >99% under normal load
- p95 latency: <500ms for API response

```bash
# Run Locust locally (alternative)
pip install locust
locust -f locustfile.py --host http://localhost:8000
```

### Kubernetes Deployment

For production-scale deployments, see `k8s/` directory:

```bash
# Deploy to Kubernetes
kubectl apply -k k8s/

# Watch auto-scaling
kubectl get hpa -n pulse -w
```

Features:
- HorizontalPodAutoscaler for web and workers
- High-priority workers: 2-20 replicas (60% CPU target)
- Low-priority workers: 1-10 replicas (70% CPU target)
- Web API: 2-10 replicas (70% CPU target)

See `k8s/README.md` for detailed deployment guide.

### Monitoring Under Load

| Tool | URL | Purpose |
|------|-----|---------|
| Flower | http://localhost:5555 | Worker status, queue depths |
| Metrics | http://localhost:8001/metrics | Prometheus metrics |
| Dashboard | http://localhost:8501 | Real-time graphs |
| Locust | http://localhost:8089 | Load test results |

## Quick Test Checklist

1. **Migrations & services**
   - `docker-compose exec web python manage.py migrate`
   - `docker-compose up -d web celery celery-beat celery-high celery-low`
2. **High-priority OTP**
   - POST a notification with `template_name` containing `"otp"` and `channel="sms"`.
   - Verify it lands on the `high_priority` queue in `celery-high` logs.
3. **Rate limit**
   - Send >10 requests within 60s for the same `user_id` + `channel`.
   - Confirm the 11th (and subsequent) requests return HTTP 429.
4. **Scheduling**
   - Tail Beat logs: `docker-compose logs -f celery-beat`.
   - Manually trigger: `docker-compose exec web celery -A pulse call notifications.tasks.send_daily_digest`.
5. **Load testing**
   - Start Locust: `docker-compose up -d locust`
   - Open http://localhost:8089, run 100 users for 5 minutes
   - Target: >99% success rate, <500ms p95 latency