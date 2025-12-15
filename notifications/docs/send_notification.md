# Send Notification API

## Endpoint

```
POST /api/notifications/send/
```

## Description

Queue a notification for delivery via email, SMS, or push. Supports idempotency keys for exactly-once semantics and automatic priority routing based on template type.

## Request Schema

| Field             | Type   | Required | Description                                                |
| ----------------- | ------ | -------- | ---------------------------------------------------------- |
| `template_name`   | string | Yes      | Name of the notification template to use                   |
| `user_id`         | string | Yes      | Unique identifier of the target user                       |
| `to`              | string | Yes      | Destination address (email, phone number, or device token) |
| `context`         | object | No       | Key-value pairs for template variable substitution         |
| `idempotency_key` | string | No       | Unique key to prevent duplicate sends                      |
| `channel`         | string | No       | Override channel: `email`, `sms`, or `push`                |
| `device_token`    | string | No       | Required for push notifications                            |
| `title`           | string | No       | Push notification title override                           |

### Example Request

```json
{
  "template_name": "welcome_email",
  "user_id": "user_123",
  "to": "john@example.com",
  "context": {
    "name": "John",
    "activation_link": "https://example.com/activate/abc123"
  },
  "idempotency_key": "welcome-user_123-2024"
}
```

## Response Schema

### Success (202 Accepted)

```json
{
  "notification_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued"
}
```

### Idempotent Hit (200 OK)

Returned when the same `idempotency_key` is used again:

```json
{
  "notification_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "sent"
}
```

### Rate Limited (429 Too Many Requests)

```json
{
  "error": "Rate limit exceeded. Try again later."
}
```

### Validation Error (400 Bad Request)

```json
{
  "template_name": ["Template not found"],
  "context": ["missing template variable: 'name'"]
}
```

### Server Error (500 Internal Server Error)

```json
{
  "error": "Connection to email server failed"
}
```

## Rate Limiting

- **Limit**: 10 requests per 60 seconds
- **Scope**: Per `(user_id, channel)` combination
- **Storage**: Redis-backed fixed-window counter

## Priority Routing

| Template Name Contains   | Queue           |
| ------------------------ | --------------- |
| `otp` (case-insensitive) | `high_priority` |
| Everything else          | `low_priority`  |

## Idempotency

When `idempotency_key` is provided:

1. If a notification with the same key exists, the existing notification's status is returned
2. Race conditions are handled atomically at the database level
3. Keys are unique across all notifications

## Notes

- Notifications are processed asynchronously via Celery workers
- Status transitions: `pending` → `sent` | `retrying` → `sent` | `failed`
- Failed notifications retry up to 5 times with exponential backoff
