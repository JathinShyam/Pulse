# Notification List API

## Endpoint

```
GET /api/notifications/list/
```

## Description

List all notifications with optional filtering by user, channel, and status. Results are ordered by creation time (newest first).

## Query Parameters

| Parameter | Type    | Required | Default | Description                                                |
| --------- | ------- | -------- | ------- | ---------------------------------------------------------- |
| `user_id` | string  | No       | -       | Filter by user identifier                                  |
| `channel` | string  | No       | -       | Filter by channel (`email`, `sms`, `push`)                 |
| `status`  | string  | No       | -       | Filter by status (`pending`, `sent`, `failed`, `retrying`) |
| `limit`   | integer | No       | 50      | Maximum number of results to return                        |

## Response Schema

### Success (200 OK)

```json
{
  "count": 2,
  "results": [
    {
      "notification_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "user_123",
      "template_name": "welcome_email",
      "channel": "email",
      "to": "john@example.com",
      "status": "sent",
      "attempts": 1,
      "created_at": "2024-12-15T10:30:00.000000Z",
      "sent_at": "2024-12-15T10:30:05.123456Z"
    },
    {
      "notification_id": "660e8400-e29b-41d4-a716-446655440001",
      "user_id": "user_456",
      "template_name": "otp_sms",
      "channel": "sms",
      "to": "+15551234567",
      "status": "sent",
      "attempts": 1,
      "created_at": "2024-12-15T10:25:00.000000Z",
      "sent_at": "2024-12-15T10:25:02.456789Z"
    }
  ]
}
```

## Response Fields

| Field     | Type    | Description                           |
| --------- | ------- | ------------------------------------- |
| `count`   | integer | Number of notifications returned      |
| `results` | array   | Array of notification summary objects |

### Notification Summary Object

| Field             | Type              | Description                           |
| ----------------- | ----------------- | ------------------------------------- |
| `notification_id` | string (UUID)     | Unique identifier                     |
| `user_id`         | string            | Target user identifier                |
| `template_name`   | string            | Template used                         |
| `channel`         | string            | Delivery channel                      |
| `to`              | string            | Destination address                   |
| `status`          | string            | Current status                        |
| `attempts`        | integer           | Number of delivery attempts           |
| `created_at`      | string (ISO 8601) | Creation timestamp                    |
| `sent_at`         | string (ISO 8601) | Delivery timestamp (null if not sent) |

## Example Usage

### Get all notifications

```bash
curl -X GET http://localhost:8000/api/notifications/list/
```

### Filter by user

```bash
curl -X GET "http://localhost:8000/api/notifications/list/?user_id=user_123"
```

### Filter by channel and status

```bash
curl -X GET "http://localhost:8000/api/notifications/list/?channel=email&status=failed"
```

### Limit results

```bash
curl -X GET "http://localhost:8000/api/notifications/list/?limit=10"
```

### Combine filters

```bash
curl -X GET "http://localhost:8000/api/notifications/list/?user_id=user_123&channel=sms&status=sent&limit=25"
```
