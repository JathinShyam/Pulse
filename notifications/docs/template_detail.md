# Template Detail API

## Endpoint

```
GET /api/notifications/templates/{template_id}/
```

## Description

Retrieve the full details of a specific notification template by its UUID.

## Path Parameters

| Parameter     | Type | Description                       |
| ------------- | ---- | --------------------------------- |
| `template_id` | UUID | Unique identifier of the template |

## Response Schema

### Success (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "welcome_email",
  "channel": "email",
  "subject": "Welcome to Pulse!",
  "body_template": "Hello {name}, welcome to Pulse!\n\nClick here to activate your account: {activation_link}\n\nBest regards,\nThe Pulse Team",
  "created_at": "2024-12-01T10:00:00.000000Z"
}
```

### Not Found (404 Not Found)

```json
{
  "error": "Template not found"
}
```

## Response Fields

| Field           | Type              | Description                                   |
| --------------- | ----------------- | --------------------------------------------- |
| `id`            | string (UUID)     | Unique template identifier                    |
| `name`          | string            | Unique template name (used in send API)       |
| `channel`       | string            | Default delivery channel                      |
| `subject`       | string            | Email subject line or push notification title |
| `body_template` | string            | Template body with `{variable}` placeholders  |
| `created_at`    | string (ISO 8601) | When the template was created                 |

## Example Usage

```bash
curl -X GET http://localhost:8000/api/notifications/templates/550e8400-e29b-41d4-a716-446655440000/
```

## Using Templates

Once you have the template details, you can:

1. Identify required context variables from `{placeholders}` in `body_template`
2. Use the template `name` when calling the send notification API
3. Optionally override the `channel` in the send request

### Example Flow

1. **Fetch template**:

   ```bash
   curl -X GET http://localhost:8000/api/notifications/templates/550e8400.../
   ```

2. **Response shows** `body_template`: `"Hello {name}, your code is {code}"`

3. **Send notification** with context:
   ```bash
   curl -X POST http://localhost:8000/api/notifications/send/ \
     -H "Content-Type: application/json" \
     -d '{
       "template_name": "otp_sms",
       "user_id": "user_123",
       "to": "+15551234567",
       "context": {
         "name": "John",
         "code": "123456"
       }
     }'
   ```
