# Pulse Notification API Documentation

## Overview

Pulse is a scalable notification and background job orchestration system. This documentation covers all available API endpoints for sending and managing notifications.

## Base URL

```
http://localhost:8000/api/
```

## Authentication

Currently, the API does not require authentication. This is suitable for development; production deployments should add appropriate authentication.

## Interactive Documentation

When `ENABLE_DOCS=true` (default), interactive API documentation is available:

| URL            | Description                              |
| -------------- | ---------------------------------------- |
| `/api/docs/`   | Swagger UI - Interactive API explorer    |
| `/api/redoc/`  | ReDoc - Alternative documentation viewer |
| `/api/schema/` | OpenAPI 3.0 schema (JSON/YAML)           |

## API Endpoints

### Notifications

| Method | Endpoint                          | Description             | Documentation                                    |
| ------ | --------------------------------- | ----------------------- | ------------------------------------------------ |
| `POST` | `/api/notifications/send/`        | Queue a notification    | [send_notification.md](send_notification.md)     |
| `GET`  | `/api/notifications/status/{id}/` | Get notification status | [notification_status.md](notification_status.md) |
| `GET`  | `/api/notifications/list/`        | List notifications      | [notification_list.md](notification_list.md)     |

### Templates

| Method | Endpoint                             | Description          | Documentation                            |
| ------ | ------------------------------------ | -------------------- | ---------------------------------------- |
| `GET`  | `/api/notifications/templates/`      | List all templates   | [template_list.md](template_list.md)     |
| `GET`  | `/api/notifications/templates/{id}/` | Get template details | [template_detail.md](template_detail.md) |

## Common Response Codes

| Code                        | Description                        |
| --------------------------- | ---------------------------------- |
| `200 OK`                    | Request successful                 |
| `202 Accepted`              | Notification queued for processing |
| `400 Bad Request`           | Invalid request parameters         |
| `404 Not Found`             | Resource not found                 |
| `429 Too Many Requests`     | Rate limit exceeded                |
| `500 Internal Server Error` | Server error                       |

## Rate Limiting

All send requests are rate-limited to **10 requests per minute** per `(user_id, channel)` combination. When exceeded, the API returns `429` with:

```json
{
  "error": "Rate limit exceeded. Try again later."
}
```

## Idempotency

To ensure exactly-once delivery, include an `idempotency_key` in your send request:

```json
{
  "template_name": "welcome_email",
  "user_id": "user_123",
  "to": "john@example.com",
  "context": { "name": "John" },
  "idempotency_key": "welcome-user_123-20241215"
}
```

Duplicate requests with the same key return the existing notification's status instead of creating a new one.

## Priority Queues

Notifications are automatically routed to priority queues:

- **High Priority** (`high_priority`): Templates with "otp" in the name
- **Low Priority** (`low_priority`): All other notifications

This ensures time-sensitive notifications (like OTPs) are processed before bulk sends.

## Channels

| Channel    | Provider | Status  |
| ---------- | -------- | ------- |
| `email`    | SMTP     | Active  |
| `sms`      | Twilio   | Active  |
| `push`     | Firebase | Active  |
| `whatsapp` | -        | Planned |
| `in_app`   | -        | Planned |

## Quick Start

### 1. Send a notification

```bash
curl -X POST http://localhost:8000/api/notifications/send/ \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_123",
    "to": "john@example.com",
    "context": {"name": "John"}
  }'
```

### 2. Check status

```bash
curl http://localhost:8000/api/notifications/status/{notification_id}/
```

### 3. List recent notifications

```bash
curl "http://localhost:8000/api/notifications/list/?user_id=user_123&limit=10"
```

## Environment Configuration

| Variable              | Description             | Default                    |
| --------------------- | ----------------------- | -------------------------- |
| `ENABLE_DOCS`         | Enable Swagger/ReDoc UI | `true`                     |
| `DEBUG`               | Django debug mode       | `true`                     |
| `CELERY_BROKER_URL`   | Redis broker URL        | `redis://localhost:6379/0` |
| `EMAIL_HOST`          | SMTP server host        | `smtp.mailtrap.io`         |
| `TWILIO_ACCOUNT_SID`  | Twilio Account SID      | -                          |
| `TWILIO_AUTH_TOKEN`   | Twilio Auth Token       | -                          |
| `TWILIO_PHONE_NUMBER` | Twilio sender number    | -                          |
