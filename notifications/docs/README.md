# Notification API (component notes)

The canonical API reference is
[`docs/api_documentation.md`](../../docs/api_documentation.md). The OpenAPI
schema is generated at `/api/schema/` when `ENABLE_DOCS=True`; Swagger UI is at
`/api/docs/`.

These component notes describe the same endpoints and are kept deliberately
short to avoid drifting from the implementation.

## Authentication

Every data endpoint requires either:

- `X-API-Key: <key>` (or `Authorization: Api-Key <key>`), or
- `Authorization: Bearer <JWT access token>`.

No data endpoint has an anonymous or development bypass. `Bearer` is reserved for JWTs.
Browser sessions keep JWTs in httpOnly cookies and go through the Next.js
proxy; server-to-server clients use an API key from `PULSE_API_KEYS`.

Reads are scoped. An API key sees rows created by that key, a non-staff JWT
user sees rows they created, and staff users see the installation. Templates
are installation-wide.

## Endpoints

| Method | Endpoint                               | Notes                                          |
| ------ | -------------------------------------- | ---------------------------------------------- |
| `POST` | `/api/notifications/send/`             | Validate, persist and enqueue one notification |
| `GET`  | `/api/notifications/status/{uuid}/`    | Scoped status and trace metadata               |
| `GET`  | `/api/notifications/list/`             | Scoped list; `limit` 1–200                     |
| `GET`  | `/api/notifications/templates/`        | Optional `channel=email\|sms\|push`            |
| `GET`  | `/api/notifications/templates/{uuid}/` | One template                                   |
| `GET`  | `/api/metrics?window=1h\|24h\|7d\|30d` | Caller-scoped windowed metrics                 |
| `GET`  | `/health/`                             | Process liveness                               |
| `GET`  | `/readyz/`                             | PostgreSQL and Redis readiness                 |

## Channels and status

Supported delivery channels are `email` via SMTP, `sms` via Twilio and `push`
via FCM. `PUSH_BACKEND=console` simulates push and flags the trace; it does not
send a live notification. WhatsApp and in-app templates are not sendable.

Status values are `pending`, `sending`, `sent`, `failed` and `retrying`. `sent`
means the configured provider acknowledged the call. It is not a read receipt.
Retries stay on the same channel and are bounded; there is no automatic
fallback or dead-letter queue.

## Quick start

```bash
export PULSE_API_KEY="replace-with-a-key-from-PULSE_API_KEYS"

curl -sS -X POST "http://localhost:8000/api/notifications/send/" \
  -H "X-API-Key: $PULSE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_123",
    "to": "ada@example.com",
    "context": {"name": "Ada"},
    "idempotency_key": "welcome-user_123-1"
  }'
```

See [`CURL_COMMANDS.md`](../../CURL_COMMANDS.md) for complete examples.
