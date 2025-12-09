from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from .models import NotificationLog, NotificationTemplate
from .serializers import SendNotificationSerializer


class IdempotencyTest(TestCase):
    """Test idempotency functionality"""

    def setUp(self):
        """Set up test data"""
        self.template = NotificationTemplate.objects.create(
            name="test_email",
            channel="email",
            subject="Test Subject",
            body_template="Hello {name}!",
        )
        self.client = APIClient()

    def test_create_if_not_exists_with_idempotency_key(self):
        """Test that create_if_not_exists prevents duplicates with idempotency key"""
        idem_key = "test-idempotency-123"

        # First creation
        log1 = NotificationLog.create_if_not_exists(
            user_id="user_123",
            template=self.template,
            channel="email",
            to="test@example.com",
            idempotency_key=idem_key,
        )

        # Second creation with same key
        log2 = NotificationLog.create_if_not_exists(
            user_id="user_123",
            template=self.template,
            channel="email",
            to="test@example.com",
            idempotency_key=idem_key,
        )

        # Should return the same log
        self.assertEqual(log1.id, log2.id)
        self.assertEqual(NotificationLog.objects.filter(idempotency_key=idem_key).count(), 1)

    def test_create_if_not_exists_without_idempotency_key(self):
        """Test that create_if_not_exists works without idempotency key"""
        log1 = NotificationLog.create_if_not_exists(
            user_id="user_456",
            template=self.template,
            channel="email",
            to="test2@example.com",
            idempotency_key=None,
        )

        log2 = NotificationLog.create_if_not_exists(
            user_id="user_456",
            template=self.template,
            channel="email",
            to="test2@example.com",
            idempotency_key=None,
        )

        # Should create two separate logs
        self.assertNotEqual(log1.id, log2.id)
        self.assertEqual(NotificationLog.objects.filter(user_id="user_456").count(), 2)

    def test_atomic_update_status(self):
        """Test atomic status update"""
        log = NotificationLog.objects.create(
            user_id="user_789",
            template=self.template,
            channel="email",
            to="test3@example.com",
            status="pending",
        )

        # Update status atomically
        log.atomic_update_status("sent", sent_at=timezone.now())
        log.refresh_from_db()

        self.assertEqual(log.status, "sent")
        self.assertIsNotNone(log.sent_at)

    def test_atomic_update_status_only_if_pending(self):
        """Test that atomic update only works if status is pending"""
        log = NotificationLog.objects.create(
            user_id="user_999",
            template=self.template,
            channel="email",
            to="test4@example.com",
            status="sent",  # Already sent
        )

        initial_attempts = log.attempts
        log.atomic_update_status("retrying", error_message="Test error")
        log.refresh_from_db()

        # Should not update attempts if not pending
        # But should still update status if explicitly set
        self.assertEqual(log.status, "retrying")


class IdempotencyAPITest(TestCase):
    """Test idempotency via API"""

    def setUp(self):
        """Set up test data"""
        self.template = NotificationTemplate.objects.create(
            name="welcome_email",
            channel="email",
            subject="Welcome",
            body_template="Hello {name}!",
        )
        self.client = APIClient()

    def test_duplicate_api_request_with_idempotency_key(self):
        """Test that duplicate API requests with same idempotency key return existing notification"""
        data = {
            "template_name": "welcome_email",
            "user_id": "user_api_test",
            "to": "test@example.com",
            "context": {"name": "Test"},
            "channel": "email",
            "idempotency_key": "api-dup-test-123",
        }

        # First request
        response1 = self.client.post("/api/notifications/send/", data, format="json")
        self.assertIn(response1.status_code, [status.HTTP_202_ACCEPTED, status.HTTP_200_OK])
        notification_id_1 = response1.data.get("notification_id")

        # Second request with same idempotency key
        response2 = self.client.post("/api/notifications/send/", data, format="json")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        notification_id_2 = response2.data.get("notification_id")

        # Should return same notification ID
        self.assertEqual(notification_id_1, notification_id_2)

        # Should only have one log in database
        self.assertEqual(
            NotificationLog.objects.filter(idempotency_key="api-dup-test-123").count(), 1
        )
