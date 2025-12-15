# Notification Status API

## Endpoint

```
GET /api/notifications/status/{notification_id}/
```

## Description

Retrieve the current status and metadata of a specific notification by its UUID.

## Path Parameters

| Parameter         | Type | Description                           |
| ----------------- | ---- | ------------------------------------- |
| `notification_id` | UUID | Unique identifier of the notification |

## Response Schema

### Success (200 OK)

```json
{
  "notification_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_123",
  "template_name": "welcome_email",
  "channel": "email",
  "to": "john@example.com",
  "status": "sent",
  "attempts": 1,
  "max_retries": 5,
  "created_at": "2024-12-15T10:30:00.000000Z",
  "sent_at": "2024-12-15T10:30:05.123456Z",
  "last_attempt_at": "2024-12-15T10:30:05.123456Z",
  "next_retry_at": null,
  "error_message": null,
  "provider_config": {},
  "idempotency_key": "welcome-user_123-2024"
}
```

### Not Found (404 Not Found)

```json
{
  "error": "Notification not found"
}
```

## Response Fields

| Field             | Type              | Description                                             |
| ----------------- | ----------------- | ------------------------------------------------------- |
| `notification_id` | string (UUID)     | Unique identifier                                       |
| `user_id`         | string            | Target user identifier                                  |
| `template_name`   | string            | Template used for this notification                     |
| `channel`         | string            | Delivery channel (`email`, `sms`, `push`)               |
| `to`              | string            | Destination address                                     |
| `status`          | string            | Current status (see below)                              |
| `attempts`        | integer           | Number of delivery attempts made                        |
| `max_retries`     | integer           | Maximum retry attempts allowed                          |
| `created_at`      | string (ISO 8601) | When the notification was created                       |
| `sent_at`         | string (ISO 8601) | When successfully delivered (null if not sent)          |
| `last_attempt_at` | string (ISO 8601) | Timestamp of the most recent attempt                    |
| `next_retry_at`   | string (ISO 8601) | When the next retry is scheduled (null if not retrying) |
| `error_message`   | string            | Error details if failed (null otherwise)                |
| `provider_config` | object            | Provider-specific metadata (e.g., Twilio SID)           |
| `idempotency_key` | string            | Idempotency key if provided                             |

## Status Values

| Status     | Description                                   |
| ---------- | --------------------------------------------- |
| `pending`  | Notification created, waiting to be processed |
| `sent`     | Successfully delivered                        |
| `failed`   | Delivery failed after all retry attempts      |
| `retrying` | Delivery failed, scheduled for retry          |

## Example Usage

```bash
curl -X GET http://localhost:8000/api/notifications/status/550e8400-e29b-41d4-a716-446655440000/
```
