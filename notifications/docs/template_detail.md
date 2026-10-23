# Template Detail API

Canonical reference: [`docs/api_documentation.md`](../../docs/api_documentation.md#status-list-and-templates).

```http
GET /api/notifications/templates/{uuid}/
X-API-Key: <key>
```

Templates are installation-wide and readable by any authenticated principal.
They contain no provider credentials.

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "welcome_email",
  "channel": "email",
  "subject": "Welcome to Pulse",
  "body_template": "Hello {name}, welcome to Pulse.",
  "created_at": "2026-10-22T10:00:00+00:00"
}
```

Use the template `name` in a send request and supply every `{placeholder}` in
`context`. `subject` is used as the email subject or push title. A template's
channel must be `email`, `sms` or `push` to be sendable.
