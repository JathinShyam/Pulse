# Pulse API — cURL Examples

The canonical reference is [`docs/api_documentation.md`](docs/api_documentation.md).
These examples target a local Django API on port `8000`.

## Setup

```bash
export PULSE_BASE_URL="http://localhost:8000"
export PULSE_API_KEY="replace-with-a-key-from-PULSE_API_KEYS"

# API keys are sent with X-API-Key. Authorization: Api-Key is also accepted.
auth=(-H "X-API-Key: $PULSE_API_KEY")
```

All data endpoints require an API key or a JWT. Send keys only from
server-to-server clients; the browser console uses httpOnly JWT cookies through
the Next.js proxy.

## Health and docs

```bash
curl -sS "$PULSE_BASE_URL/health/"
curl -sS "$PULSE_BASE_URL/readyz/"
curl -sS "$PULSE_BASE_URL/api/schema/" -o /tmp/pulse-openapi.json
```

## Templates

```bash
# All templates
curl -sS "${auth[@]}" "$PULSE_BASE_URL/api/notifications/templates/"

# Only email templates (email, sms or push)
curl -sS "${auth[@]}" \
  "$PULSE_BASE_URL/api/notifications/templates/?channel=email"

# One template by UUID
curl -sS "${auth[@]}" \
  "$PULSE_BASE_URL/api/notifications/templates/<template_id>/"
```

## Send email

```bash
curl -sS -X POST "${auth[@]}" \
  -H "Content-Type: application/json" \
  "$PULSE_BASE_URL/api/notifications/send/" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_123",
    "to": "test@example.com",
    "channel": "email",
    "context": {"name": "Ada"},
    "idempotency_key": "welcome-user_123-1",
    "priority": "low"
  }'
```

A new request returns `202` with `status: "queued"`. Reuse the same key with
the same request to get `200` and the existing status. Reuse it with any
different field to get `409`.

## Send SMS

```bash
curl -sS -X POST "${auth[@]}" \
  -H "Content-Type: application/json" \
  "$PULSE_BASE_URL/api/notifications/send/" \
  -d '{
    "template_name": "otp_login",
    "user_id": "user_456",
    "to": "+15551234567",
    "channel": "sms",
    "context": {"code": "123456"},
    "idempotency_key": "otp-user_456-1",
    "priority": "high"
  }'
```

SMS recipients must be E.164 numbers. Without Twilio credentials the send row
fails with a clear provider error; it is not silently marked sent.

## Send push

```bash
curl -sS -X POST "${auth[@]}" \
  -H "Content-Type: application/json" \
  "$PULSE_BASE_URL/api/notifications/send/" \
  -d '{
    "template_name": "security_alert",
    "user_id": "user_789",
    "to": "fcm-device-token",
    "channel": "push",
    "context": {"name": "Ada", "alert": "New sign-in"},
    "title": "Security alert",
    "idempotency_key": "alert-user_789-1"
  }'
```

With `PUSH_BACKEND=console` the delivery is simulated and the trace is flagged
`provider_config.simulated=true`. Set `PUSH_BACKEND=fcm` and provide Firebase
credentials for live FCM sends.

## Inspect

```bash
# One notification (scoped to the caller)
curl -sS "${auth[@]}" \
  "$PULSE_BASE_URL/api/notifications/status/<notification_id>/"

# Recent notifications with filters
curl -sS "${auth[@]}" \
  "$PULSE_BASE_URL/api/notifications/list/?channel=email&status=sent&limit=25"

# Metrics for a window: 1h, 24h, 7d or 30d
curl -sS "${auth[@]}" "$PULSE_BASE_URL/api/metrics?window=24h"
```

Status and list reads are scoped: an API key sees rows it created, a non-staff
JWT user sees rows they created, and staff users see the installation. A row
outside the caller's scope returns `404`.

## Errors to expect

| Status | Meaning                                                                                       |
| ------ | --------------------------------------------------------------------------------------------- |
| `400`  | Invalid template, recipient, context, priority or query parameter                             |
| `401`  | Missing or invalid credential                                                                 |
| `409`  | Idempotency key reused for a different request                                                |
| `429`  | Send limit exceeded; honour `Retry-After`                                                     |
| `503`  | Broker unavailable; the row is marked failed. Retry with a new key after the broker recovers. |

`sent` means the configured provider acknowledged the call, not that a human
read or received the message. There is no automatic channel fallback or
dead-letter queue.
