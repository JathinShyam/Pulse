# Pulse Notification API - cURL Commands Collection

Base URL: `http://localhost:8000/api/notifications`

---

## 📋 Templates

### 1. List All Templates

```bash
curl -X GET "http://localhost:8000/api/notifications/templates/" \
  -H "Content-Type: application/json"
```

### 2. List Templates by Channel

```bash
# Email templates only
curl -X GET "http://localhost:8000/api/notifications/templates/?channel=email" \
  -H "Content-Type: application/json"

# SMS templates only
curl -X GET "http://localhost:8000/api/notifications/templates/?channel=sms" \
  -H "Content-Type: application/json"

# Push templates only
curl -X GET "http://localhost:8000/api/notifications/templates/?channel=push" \
  -H "Content-Type: application/json"
```

### 3. Get Template Details by UUID

```bash
# First, get the UUID from the list endpoint, then use it here
# Example UUIDs (replace with actual UUIDs from your system):
curl -X GET "http://localhost:8000/api/notifications/templates/5f7f3ad8-5b83-427c-a08a-81d243c52900/" \
  -H "Content-Type: application/json"

# Get UUID from list and use it
TEMPLATE_UUID=$(curl -s -X GET "http://localhost:8000/api/notifications/templates/" | python3 -c "import sys, json; print(json.load(sys.stdin)['results'][0]['id'])")
curl -X GET "http://localhost:8000/api/notifications/templates/$TEMPLATE_UUID/" \
  -H "Content-Type: application/json"
```

---

## 📧 Email Notifications

### 4. Send Email Notification (Basic)

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_123",
    "to": "test@example.com",
    "context": {
      "name": "Shyam"
    },
    "channel": "email"
  }'
```

### 5. Send Email with Idempotency Key

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_123",
    "to": "test@example.com",
    "context": {
      "name": "Shyam"
    },
    "channel": "email",
    "idempotency_key": "unique-email-key-123"
  }'
```

### 6. Send Email with Custom Subject Override

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_456",
    "to": "another@example.com",
    "context": {
      "name": "John"
    },
    "channel": "email",
    "subject": "Custom Welcome Subject"
  }'
```

---

## 📱 SMS Notifications

### 7. Send SMS Notification

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "otp_sms",
    "user_id": "user_456",
    "to": "+15551234567",
    "context": {
      "code": "123456"
    },
    "channel": "sms"
  }'
```

### 8. Send SMS with Idempotency Key

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "otp_sms",
    "user_id": "user_789",
    "to": "+15551234567",
    "context": {
      "code": "654321"
    },
    "channel": "sms",
    "idempotency_key": "unique-sms-key-456"
  }'
```

### 9. Send SMS to Different Number

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "otp_sms",
    "user_id": "user_999",
    "to": "+15551234567",
    "context": {
      "code": "987654"
    },
    "channel": "sms"
  }'
```

---

## 🔔 Push Notifications

### 10. Send Push Notification

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_push",
    "user_id": "user_789",
    "to": "dummy@app.com",
    "context": {
      "name": "Shyam"
    },
    "channel": "push",
    "device_token": "fcm_dummy_token_abc",
    "title": "Welcome!"
  }'
```

### 11. Send Push with Custom Title

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_push",
    "user_id": "user_888",
    "to": "user@app.com",
    "context": {
      "name": "Alice"
    },
    "channel": "push",
    "device_token": "fcm_token_xyz_123",
    "title": "Hello from Pulse!"
  }'
```

### 12. Send Push with Idempotency Key

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_push",
    "user_id": "user_777",
    "to": "test@app.com",
    "context": {
      "name": "Bob"
    },
    "channel": "push",
    "device_token": "fcm_token_unique",
    "title": "Welcome",
    "idempotency_key": "unique-push-key-789"
  }'
```

---

## 📊 Notification Status & List

### 13. Get Notification Status by ID

```bash
# Replace {notification_id} with actual ID from send response
curl -X GET "http://localhost:8000/api/notifications/status/{notification_id}/" \
  -H "Content-Type: application/json"
```

**Example:**

```bash
curl -X GET "http://localhost:8000/api/notifications/status/c5badbdc-716f-4b4d-91a6-b7b32a13e072/" \
  -H "Content-Type: application/json"
```

### 14. List All Notifications

```bash
curl -X GET "http://localhost:8000/api/notifications/list/" \
  -H "Content-Type: application/json"
```

### 15. List Notifications with Limit

```bash
curl -X GET "http://localhost:8000/api/notifications/list/?limit=10" \
  -H "Content-Type: application/json"
```

### 16. List Notifications by User ID

```bash
curl -X GET "http://localhost:8000/api/notifications/list/?user_id=user_123" \
  -H "Content-Type: application/json"
```

### 17. List Notifications by Channel

```bash
# Email notifications only
curl -X GET "http://localhost:8000/api/notifications/list/?channel=email" \
  -H "Content-Type: application/json"

# SMS notifications only
curl -X GET "http://localhost:8000/api/notifications/list/?channel=sms" \
  -H "Content-Type: application/json"

# Push notifications only
curl -X GET "http://localhost:8000/api/notifications/list/?channel=push" \
  -H "Content-Type: application/json"
```

### 18. List Notifications by Status

```bash
# Sent notifications
curl -X GET "http://localhost:8000/api/notifications/list/?status=sent" \
  -H "Content-Type: application/json"

# Pending notifications
curl -X GET "http://localhost:8000/api/notifications/list/?status=pending" \
  -H "Content-Type: application/json"

# Failed notifications
curl -X GET "http://localhost:8000/api/notifications/list/?status=failed" \
  -H "Content-Type: application/json"

# Retrying notifications
curl -X GET "http://localhost:8000/api/notifications/list/?status=retrying" \
  -H "Content-Type: application/json"
```

### 19. Combined Filters

```bash
# Get sent email notifications for a specific user
curl -X GET "http://localhost:8000/api/notifications/list/?user_id=user_123&channel=email&status=sent&limit=5" \
  -H "Content-Type: application/json"
```

---

## 🧪 Test Scenarios

### 20. Test Idempotency (Send Same Request Twice)

```bash
# First request
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_test",
    "to": "test@example.com",
    "context": {"name": "Test"},
    "channel": "email",
    "idempotency_key": "test-idempotency-123"
  }'

# Second request (should return same notification_id)
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_test",
    "to": "test@example.com",
    "context": {"name": "Test"},
    "channel": "email",
    "idempotency_key": "test-idempotency-123"
  }'
```

### 21. Test Channel Override

```bash
# Use email template but send via SMS channel
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_override",
    "to": "+15551234567",
    "context": {"name": "Override Test"},
    "channel": "sms"
  }'
```

### 22. Test Error Handling (Invalid Template)

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "non_existent_template",
    "user_id": "user_error",
    "to": "test@example.com",
    "context": {"name": "Test"},
    "channel": "email"
  }'
```

### 23. Test Error Handling (Missing Context Variable)

```bash
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "welcome_email",
    "user_id": "user_error",
    "to": "test@example.com",
    "context": {},
    "channel": "email"
  }'
```

---

## 📝 Notes for Postman Collection

1. **Base URL Variable**: Set `{{base_url}}` = `http://localhost:8000/api/notifications`

2. **Common Headers**:

   - `Content-Type: application/json`

3. **Response Codes**:

   - `202 Accepted`: Notification queued successfully
   - `200 OK`: Idempotent request (existing notification) or GET request
   - `400 Bad Request`: Validation error or unsupported channel
   - `404 Not Found`: Template or notification not found
   - `500 Internal Server Error`: Server error

4. **Response Format**:

   - **POST /send/**: `{"notification_id": "uuid", "status": "queued|sent"}`
   - **GET /status/{id}/**: Full notification details
   - **GET /list/**: `{"count": N, "results": [...]}`
   - **GET /templates/**: `{"count": N, "results": [...]}`

5. **Environment Variables** (Optional):
   - `test_email`: `test@example.com`
   - `test_phone`: `+15551234567`
   - `test_device_token`: `fcm_dummy_token_abc`

---

## 🚀 Quick Test Sequence

```bash
# 1. List templates
curl -X GET "http://localhost:8000/api/notifications/templates/"

# 2. Send email
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{"template_name": "welcome_email", "user_id": "user_1", "to": "test@example.com", "context": {"name": "Test"}, "channel": "email"}'

# 3. Send SMS (use response notification_id from step 2)
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{"template_name": "otp_sms", "user_id": "user_2", "to": "+15551234567", "context": {"code": "123456"}, "channel": "sms"}'

# 4. Send Push
curl -X POST "http://localhost:8000/api/notifications/send/" \
  -H "Content-Type: application/json" \
  -d '{"template_name": "welcome_push", "user_id": "user_3", "to": "test@app.com", "context": {"name": "Test"}, "channel": "push", "device_token": "fcm_token", "title": "Welcome"}'

# 5. List all notifications
curl -X GET "http://localhost:8000/api/notifications/list/"

# 6. Check status of a notification (use ID from step 2)
curl -X GET "http://localhost:8000/api/notifications/status/{notification_id}/"
```
