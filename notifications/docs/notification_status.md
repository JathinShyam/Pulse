# Notification Status API

Canonical reference: [`docs/api_documentation.md`](../../docs/api_documentation.md#status-list-and-templates).

```http
GET /api/notifications/status/{uuid}/
X-API-Key: <key>
```

Reads are scoped to the caller. A row outside the caller's scope returns `404`
rather than `403`, so existence is not leaked.

```json
{
  "notification_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_123",
  "template_name": "welcome_email",
  "channel": "email",
  "to": "ada@example.com",
  "status": "sent",
  "attempts": 1,
  "max_retries": 5,
  "created_at": "2026-10-22T10:30:00+00:00",
  "sent_at": "2026-10-22T10:30:05+00:00",
  "last_attempt_at": "2026-10-22T10:30:05+00:00",
  "next_retry_at": null,
  "error_message": null,
  "provider_config": {},
  "idempotency_key": "welcome-user_123-1"
}
```

`provider_config` contains provider metadata such as a Twilio SID. For the
console push backend it includes `simulated: true`.

## Status values

| Status     | Meaning                                                    |
| ---------- | ---------------------------------------------------------- |
| `pending`  | Persisted, not yet claimed by a worker                     |
| `sending`  | Claimed by a worker and in progress                        |
| `retrying` | An attempt failed and a bounded retry is scheduled         |
| `sent`     | The configured provider acknowledged the call              |
| `failed`   | Terminal failure; retry budget exhausted or enqueue failed |

`sent` is not a human read/delivery receipt. A `sending` row can be reclaimed by
another worker only after `NOTIFICATION_CLAIM_TIMEOUT_SECONDS`; `sent` and
`failed` are terminal and are not overwritten by duplicate Celery deliveries.
