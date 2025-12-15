# Pulse

Pulse is a scalable notification and background job orchestration system built with Django, DRF, Celery, Redis, and PostgreSQL. The goal is to explore production-grade patterns such as multi-channel delivery, retries with exponential backoff, dead-letter queues, idempotency keys, rate limiting, and observability dashboards.

## High-Level Architecture

- **API Layer (Django + DRF)** – Accepts notification/job requests over REST, enforces validation, and persists metadata.
- **Task Processing (Celery)** – Handles asynchronous fan-out, retries, and scheduling across worker pools.
- **Message Broker (Redis)** – Primary broker/result backend for Celery queues; optional RabbitMQ support planned.
- **Database (PostgreSQL)** – Stores notification state, idempotency keys, audit history, and routing metadata.
- **Observability** – Future work includes a metrics dashboard (Streamlit/Next.js) plus Prometheus exporters.

## API Documentation

When `ENABLE_DOCS=true` (default), interactive API documentation is available:

| URL                               | Description                                  |
| --------------------------------- | -------------------------------------------- |
| http://localhost:8000/api/docs/   | **Swagger UI** - Interactive API explorer    |
| http://localhost:8000/api/redoc/  | **ReDoc** - Alternative documentation viewer |
| http://localhost:8000/api/schema/ | **OpenAPI 3.0 schema** (JSON/YAML download)  |

Markdown documentation for each endpoint is also available in `notifications/docs/`.

To disable documentation in production, set `ENABLE_DOCS=false` in your `.env` file.

## Local Development

```bash
docker-compose build
docker-compose up -d
```

With the stack running:

- Django API: http://localhost:8000
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- Notifications endpoint: `POST http://localhost:8000/api/notifications/send/`
- Celery worker logs: `docker-compose logs -f celery`

To include Celery Beat, priority workers, and Flower:

```bash
docker-compose build web celery celery-beat celery-high celery-low
docker-compose up -d web celery celery-beat celery-high celery-low flower
```

Example request body:

```json
{
  "recipient": "someone@example.com",
  "channel": "email",
  "payload": { "subject": "Hello", "body": "Welcome to Pulse" },
  "priority": 1
}
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
