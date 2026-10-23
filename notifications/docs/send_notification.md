# Send Notification API

Canonical reference: [`docs/api_documentation.md`](../../docs/api_documentation.md#send-a-notification).

```http
POST /api/notifications/send/
X-API-Key: <key>
Content-Type: application/json
```

```json
{
  "template_name": "welcome_email",
  "user_id": "user_123",
  "to": "ada@example.com",
  "channel": "email",
  "context": { "name": "Ada" },
  "idempotency_key": "welcome-user_123-1",
  "priority": "low"
}
```

`channel` defaults to the template channel and must be `email`, `sms` or
`push`. Email recipients must be valid addresses; SMS recipients must be E.164
numbers; push uses the recipient or `device_token`. Optional `subject`, `body`
and `title` values override the template. Missing template variables are a
validation error.

`priority` is `high` or `low`. When omitted, the request is high priority if the
template name contains one of `HIGH_PRIORITY_TEMPLATE_KEYWORDS` (default
`otp,verification,verify,2fa`); otherwise it is low priority. There is no
automatic channel fallback.

## Responses

| Status | Meaning                                                            |
| ------ | ------------------------------------------------------------------ |
| `202`  | New row persisted and queued with `status: "queued"`               |
| `200`  | Same idempotency key and same request; returns the existing status |
| `400`  | Invalid template, recipient, context, priority or query parameter  |
| `401`  | Missing or invalid credential                                      |
| `409`  | Idempotency key reused with a different request                    |
| `429`  | Send limit exceeded; see `Retry-After`                             |
| `503`  | Broker unavailable; row marked `failed`                            |

Idempotency covers acceptance, not delivery. The key is unique and a SHA-256
fingerprint of the request is stored; reusing a key with any changed field is a
conflict. After a `503`, retry with a new idempotency key once the broker is
available.

Delivery is asynchronous. `202` and `sent` do not mean a human received the
message. Retries are bounded, stay on the same channel and may still end in
`failed`. Delivery is at-least-once in a narrow crash window after provider
acknowledgement; idempotency covers API acceptance, not provider-side
duplicates.
