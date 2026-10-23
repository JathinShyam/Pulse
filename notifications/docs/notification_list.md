# Notification List API

Canonical reference: [`docs/api_documentation.md`](../../docs/api_documentation.md#status-list-and-templates).

```http
GET /api/notifications/list/?user_id=user_123&channel=email&status=sent&limit=50
X-API-Key: <key>
```

| Parameter | Type    | Notes                                                |
| --------- | ------- | ---------------------------------------------------- |
| `user_id` | string  | Optional exact match                                 |
| `channel` | string  | `email`, `sms` or `push`                             |
| `status`  | string  | `pending`, `sending`, `sent`, `failed` or `retrying` |
| `limit`   | integer | 1–200, default 50                                    |

Reads are scoped: an API key sees rows it created, a non-staff JWT user sees
rows they created, and staff see all rows. `count` is the number of matching
scoped rows, while `results` is capped by `limit`. Results are newest first.

```json
{
  "count": 2,
  "results": [
    {
      "notification_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "user_123",
      "template_name": "welcome_email",
      "channel": "email",
      "to": "ada@example.com",
      "status": "sent",
      "attempts": 1,
      "created_at": "2026-10-22T10:30:00+00:00",
      "sent_at": "2026-10-22T10:30:05+00:00"
    }
  ]
}
```

`sent_at` records provider acknowledgement, not human delivery.
