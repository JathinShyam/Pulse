# Pulse

Pulse is a scalable notification and background job orchestration system built with Django, DRF, Celery, Redis, and PostgreSQL. The goal is to explore production-grade patterns such as multi-channel delivery, retries with exponential backoff, dead-letter queues, idempotency keys, rate limiting, and observability dashboards.

## High-Level Architecture

- **API Layer (Django + DRF)** – Accepts notification/job requests over REST, enforces validation, and persists metadata.
- **Task Processing (Celery)** – Handles asynchronous fan-out, retries, and scheduling across worker pools.
- **Message Broker (Redis)** – Primary broker/result backend for Celery queues; optional RabbitMQ support planned.
- **Database (PostgreSQL)** – Stores notification state, idempotency keys, audit history, and routing metadata.
- **Observability** – Future work includes a metrics dashboard (Streamlit/Next.js) plus Prometheus exporters.

## Local Development

```bash
docker-compose build
docker-compose up -d
```

With the stack running:

- Django API: http://localhost:8000
- Notifications endpoint: `POST http://localhost:8000/api/notifications/`
- Celery worker logs: `docker-compose logs -f celery`

Example request body:

```json
{
  "recipient": "someone@example.com",
  "channel": "email",
  "payload": {"subject": "Hello", "body": "Welcome to Pulse"},
  "priority": 1
}
```

## Roadmap

| Week | Focus |
| --- | --- |
| 1 | Core Django + Celery setup, basic email notification task |
| 2 | Multi-channel abstraction (SMS, Push, WhatsApp) |
| 3 | Retry policies, exponential backoff, DLQ |
| 4 | Idempotency keys + relational schema hardening |
| 5 | Rate limiting, priority queues, scheduling/cron |
| 6 | Observability dashboard + metrics exporters |
| 7 | Horizontal scaling proof + load testing |
| 8 | Docs, demo video, blog posts |

## Next Steps

1. Resolve container networking hiccups preventing pip from reaching PyPI during image builds.
2. Generate initial migrations and wire Celery Beat for scheduled jobs.
3. Implement provider adapters (SMTP, Twilio, Firebase) with secrets in `.env`.
