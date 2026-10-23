# Template List API

Canonical reference: [`docs/api_documentation.md`](../../docs/api_documentation.md#status-list-and-templates).

```http
GET /api/notifications/templates/?channel=email
X-API-Key: <key>
```

| Parameter | Type   | Notes                              |
| --------- | ------ | ---------------------------------- |
| `channel` | string | Optional: `email`, `sms` or `push` |

Templates are installation-wide and readable by any authenticated principal.
Results are ordered by name and capped at 200; `count` is the total matching
inventory. Templates for unsupported channels are not sendable.

```json
{
  "count": 1,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "welcome_email",
      "channel": "email",
      "subject": "Welcome to Pulse",
      "body_template": "Hello {name}, welcome to Pulse.",
      "created_at": "2026-10-22T10:00:00+00:00"
    }
  ]
}
```
