"""Regression tests for authentication, tenant scoping, idempotency, routing,
limits, delivery claiming and the metrics API.

These tests deliberately do not touch Redis, SMTP, Twilio or FCM. Adapters are
patched and the test settings use the local-memory cache.
"""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from .authentication import fingerprint_key
from .models import NotificationLog, NotificationTemplate
from .serializers import SendNotificationSerializer
from .tasks import PermanentDeliveryError, deliver

User = get_user_model()

API_KEYS = ["tenant-a", "tenant-b"]
KEY_A = f"api-key:{fingerprint_key('tenant-a')}"
KEY_B = f"api-key:{fingerprint_key('tenant-b')}"


@override_settings(
    PULSE_API_KEYS=API_KEYS,
    RATE_LIMIT_ENABLED=False,
    ALLOW_REGISTRATION=False,
    PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"],
)
class PulseAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email_template = NotificationTemplate.objects.create(
            name="welcome_email",
            channel="email",
            subject="Welcome {name}",
            body_template="Hello {name}, welcome aboard.",
        )
        self.otp_template = NotificationTemplate.objects.create(
            name="otp_login",
            channel="email",
            subject="Your code",
            body_template="Your code is {code}.",
        )
        self.sms_template = NotificationTemplate.objects.create(
            name="verify_sms",
            channel="sms",
            subject="",
            body_template="Your verification code is {code}.",
        )
        self.push_template = NotificationTemplate.objects.create(
            name="alert_push",
            channel="push",
            subject="Alert",
            body_template="Something happened for {name}.",
        )

    def api_client(self, key: str = "tenant-a") -> APIClient:
        client = APIClient()
        client.credentials(HTTP_X_API_KEY=key)
        return client

    def send_payload(self, **overrides):
        data = {
            "template_name": self.email_template.name,
            "user_id": "user-1",
            "to": "ada@example.com",
            "context": {"name": "Ada", "code": "123456"},
        }
        data.update(overrides)
        return data

    def create_log(self, *, scope: str = KEY_A, status: str = "sent", **overrides):
        values = {
            "user_id": "user-1",
            "created_by": scope,
            "template": self.email_template,
            "channel": "email",
            "to": "ada@example.com",
            "status": status,
            "attempts": 1,
        }
        values.update(overrides)
        log = NotificationLog.objects.create(**values)
        if status == "sent" and log.sent_at is None:
            log.sent_at = log.created_at
            log.save(update_fields=["sent_at"])
        return log

    # ------------------------------------------------------------------
    # Authentication
    # ------------------------------------------------------------------

    def test_requests_without_credentials_are_rejected(self):
        for client in (self.client,):
            self.assertEqual(
                client.post(
                    "/api/notifications/send/", self.send_payload(), format="json"
                ).status_code,
                status.HTTP_401_UNAUTHORIZED,
            )
            self.assertEqual(
                client.get("/api/notifications/list/").status_code,
                status.HTTP_401_UNAUTHORIZED,
            )
            self.assertEqual(
                client.get("/api/metrics").status_code,
                status.HTTP_401_UNAUTHORIZED,
            )
            self.assertEqual(
                client.get("/api/auth/me/").status_code,
                status.HTTP_401_UNAUTHORIZED,
            )

    def test_invalid_api_key_and_bearer_api_key_are_rejected(self):
        invalid = APIClient()
        invalid.credentials(HTTP_X_API_KEY="not-a-key")
        self.assertEqual(
            invalid.get("/api/notifications/list/").status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        bearer = APIClient()
        bearer.credentials(HTTP_AUTHORIZATION="Bearer tenant-a")
        self.assertEqual(
            bearer.get("/api/notifications/list/").status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_api_key_header_and_authorization_scheme_are_accepted(self):
        header = self.api_client()
        self.assertEqual(
            header.get("/api/notifications/list/").status_code,
            status.HTTP_200_OK,
        )
        scheme = APIClient()
        scheme.credentials(HTTP_AUTHORIZATION="Api-Key tenant-a")
        self.assertEqual(
            scheme.get("/api/notifications/list/").status_code,
            status.HTTP_200_OK,
        )

    def test_me_describes_api_key_principal(self):
        response = self.api_client().get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["auth"], "api_key")
        self.assertEqual(
            response.data["username"],
            f"api-key:{fingerprint_key('tenant-a')}",
        )
        self.assertIsNone(response.data["id"])

    def test_login_accepts_email_or_username_and_me_uses_jwt(self):
        user = User.objects.create_user(
            username="operator",
            email="operator@example.com",
            password="pulse-demo-2026",
            is_staff=True,
        )
        for identity in ("operator@example.com", "operator"):
            response = self.client.post(
                "/api/auth/login/",
                {"username": identity, "password": "pulse-demo-2026"},
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("access", response.data)
            self.assertIn("refresh", response.data)

            me = APIClient()
            me.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
            response = me.get("/api/auth/me/")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data["username"], user.username)
            self.assertEqual(response.data["auth"], "jwt")
            self.assertTrue(response.data["is_staff"])

    def test_registration_is_disabled_by_default(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "new@example.com",
                "password": "Z9!vQ2#kLm8@xR4",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @override_settings(ALLOW_REGISTRATION=True)
    def test_registration_validates_password_and_uniqueness(self):
        weak = self.client.post(
            "/api/auth/register/",
            {"email": "weak@example.com", "password": "password"},
            format="json",
        )
        self.assertEqual(weak.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            "/api/auth/register/",
            {"email": "New@Example.com", "password": "Z9!vQ2#kLm8@xR4"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "new@example.com")

        duplicate = self.client.post(
            "/api/auth/register/",
            {"email": "new@example.com", "password": "Z9!vQ2#kLm8@xR4"},
            format="json",
        )
        self.assertEqual(duplicate.status_code, status.HTTP_400_BAD_REQUEST)

    # ------------------------------------------------------------------
    # Tenant scoping
    # ------------------------------------------------------------------

    def test_api_keys_only_see_their_own_rows(self):
        log_a = self.create_log(scope=KEY_A)
        log_b = self.create_log(scope=KEY_B)

        response = self.api_client("tenant-a").get("/api/notifications/list/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["notification_id"], str(log_a.id))

        self.assertEqual(
            self.api_client("tenant-a")
            .get(f"/api/notifications/status/{log_a.id}/")
            .status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            self.api_client("tenant-a")
            .get(f"/api/notifications/status/{log_b.id}/")
            .status_code,
            status.HTTP_404_NOT_FOUND,
        )
        self.assertEqual(
            self.api_client("tenant-b")
            .get(f"/api/notifications/status/{log_a.id}/")
            .status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_staff_sees_all_and_regular_users_see_only_themselves(self):
        staff = User.objects.create_user(username="staff", password="x", is_staff=True)
        regular = User.objects.create_user(username="regular", password="x")
        self.create_log(scope=KEY_A)
        self.create_log(scope=f"user:{regular.pk}")

        staff_client = APIClient()
        staff_client.force_authenticate(user=staff)
        self.assertEqual(staff_client.get("/api/notifications/list/").data["count"], 2)

        regular_client = APIClient()
        regular_client.force_authenticate(user=regular)
        self.assertEqual(
            regular_client.get("/api/notifications/list/").data["count"], 1
        )

    # ------------------------------------------------------------------
    # Idempotency
    # ------------------------------------------------------------------

    @patch("notifications.views.EmailAdapter.send", return_value=None)
    def test_idempotent_duplicate_returns_existing_id_and_enqueues_once(self, send):
        client = self.api_client()
        payload = self.send_payload(idempotency_key="idem-1")

        first = client.post("/api/notifications/send/", payload, format="json")
        self.assertEqual(first.status_code, status.HTTP_202_ACCEPTED)
        second = client.post("/api/notifications/send/", payload, format="json")
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(second.data["notification_id"], first.data["notification_id"])
        self.assertEqual(send.call_count, 1)
        self.assertEqual(NotificationLog.objects.count(), 1)

    @patch("notifications.views.EmailAdapter.send", return_value=None)
    def test_same_key_with_different_payload_is_a_conflict(self, send):
        client = self.api_client()
        first = client.post(
            "/api/notifications/send/",
            self.send_payload(idempotency_key="idem-2"),
            format="json",
        )
        self.assertEqual(first.status_code, status.HTTP_202_ACCEPTED)

        conflict = client.post(
            "/api/notifications/send/",
            self.send_payload(idempotency_key="idem-2", to="other@example.com"),
            format="json",
        )
        self.assertEqual(conflict.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(send.call_count, 1)
        self.assertEqual(NotificationLog.objects.count(), 1)

    @patch("notifications.views.EmailAdapter.send", return_value=None)
    def test_same_key_with_changed_content_is_a_conflict(self, send):
        client = self.api_client()
        payload = self.send_payload(
            idempotency_key="idem-content",
            subject="Welcome {name}",
            body="Hello {name}",
        )
        first = client.post("/api/notifications/send/", payload, format="json")
        self.assertEqual(first.status_code, status.HTTP_202_ACCEPTED)

        changed_body = client.post(
            "/api/notifications/send/",
            {**payload, "body": "A different message for {name}"},
            format="json",
        )
        self.assertEqual(changed_body.status_code, status.HTTP_409_CONFLICT)

        changed_priority = client.post(
            "/api/notifications/send/",
            {**payload, "priority": "high"},
            format="json",
        )
        self.assertEqual(changed_priority.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(send.call_count, 1)

    @patch("notifications.views.EmailAdapter.send", return_value=None)
    def test_duplicate_key_is_scoped_to_the_creating_principal(self, send):
        first = self.api_client("tenant-a").post(
            "/api/notifications/send/",
            self.send_payload(idempotency_key="idem-cross-tenant"),
            format="json",
        )
        self.assertEqual(first.status_code, status.HTTP_202_ACCEPTED)

        conflict = self.api_client("tenant-b").post(
            "/api/notifications/send/",
            self.send_payload(idempotency_key="idem-cross-tenant"),
            format="json",
        )
        self.assertEqual(conflict.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(send.call_count, 1)

    def test_database_constraint_rejects_a_duplicate_idempotency_key(self):
        self.create_log(idempotency_key="database-unique")
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.create_log(idempotency_key="database-unique")

    # ------------------------------------------------------------------
    # Priority routing and serialization
    # ------------------------------------------------------------------

    def serializer_for(self, **overrides):
        serializer = SendNotificationSerializer(data=self.send_payload(**overrides))
        self.assertTrue(serializer.is_valid(), serializer.errors)
        return serializer

    def test_explicit_priority_wins(self):
        self.assertEqual(
            self.serializer_for(priority="high").validated_data["queue"],
            "high_priority",
        )
        self.assertEqual(
            self.serializer_for(
                template_name="otp_login", priority="low"
            ).validated_data["queue"],
            "low_priority",
        )

    def test_otp_template_defaults_to_high_and_others_to_low(self):
        self.assertEqual(
            self.serializer_for(template_name="otp_login").validated_data["queue"],
            "high_priority",
        )
        self.assertEqual(
            self.serializer_for(template_name="welcome_email").validated_data["queue"],
            "low_priority",
        )

    def test_subject_and_body_overrides_are_rendered_with_context(self):
        serializer = self.serializer_for(
            subject="Hi {name}",
            body="Body for {name} ({code})",
        )
        self.assertEqual(serializer.validated_data["rendered_subject"], "Hi Ada")
        self.assertEqual(
            serializer.validated_data["rendered_body"],
            "Body for Ada (123456)",
        )

    def test_missing_template_variable_is_a_validation_error(self):
        serializer = SendNotificationSerializer(
            data=self.send_payload(template_name="otp_login", context={"name": "Ada"})
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("context", serializer.errors)

    def test_channel_override_validates_recipient(self):
        serializer = SendNotificationSerializer(data=self.send_payload(channel="sms"))
        self.assertFalse(serializer.is_valid())
        self.assertIn("to", serializer.errors)

        serializer = SendNotificationSerializer(
            data=self.send_payload(
                template_name="verify_sms",
                channel="sms",
                to="+14155550123",
            )
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["channel"], "sms")

    # ------------------------------------------------------------------
    # Limits and enqueue failures
    # ------------------------------------------------------------------

    def test_list_and_metrics_query_validation(self):
        client = self.api_client()
        self.assertEqual(
            client.get("/api/notifications/list/?limit=0").status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            client.get("/api/notifications/list/?limit=201").status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            client.get("/api/notifications/list/?channel=whatsapp").status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            client.get("/api/notifications/templates/?channel=whatsapp").status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            client.get("/api/metrics?window=1d").status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    @override_settings(RATE_LIMIT_ENABLED=True)
    @patch("notifications.views.RateLimiter", autospec=True)
    def test_send_rate_limit_returns_429_and_retry_after(self, limiter_cls):
        limiter = limiter_cls.return_value
        limiter.is_allowed.return_value = False
        limiter.retry_after.return_value = 37

        response = self.api_client().post(
            "/api/notifications/send/", self.send_payload(), format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(response["Retry-After"], "37")
        self.assertEqual(NotificationLog.objects.count(), 0)

    @patch(
        "notifications.views.EmailAdapter.send",
        side_effect=RuntimeError("broker unavailable"),
    )
    def test_enqueue_failure_marks_failed_and_returns_503(self, _send):
        response = self.api_client().post(
            "/api/notifications/send/", self.send_payload(), format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        log = NotificationLog.objects.get()
        self.assertEqual(log.status, "failed")
        self.assertEqual(log.error_message, "Delivery queue unavailable")

    # ------------------------------------------------------------------
    # Delivery claiming / terminal state
    # ------------------------------------------------------------------

    def test_claim_is_exclusive_and_stale_sending_can_be_reclaimed(self):
        log = self.create_log(status="pending", attempts=0, sent_at=None)
        self.assertTrue(log.claim_for_delivery())
        self.assertEqual(log.status, "sending")
        self.assertEqual(log.attempts, 1)

        self.assertFalse(log.claim_for_delivery())

        NotificationLog.objects.filter(pk=log.pk).update(
            last_attempt_at=timezone.now() - timedelta(seconds=60 * 60),
        )
        log.refresh_from_db()
        self.assertTrue(log.claim_for_delivery())
        self.assertEqual(log.attempts, 2)

    def test_claim_respects_backoff_and_retry_budget(self):
        log = self.create_log(status="retrying", attempts=1, sent_at=None)
        NotificationLog.objects.filter(pk=log.pk).update(
            next_retry_at=timezone.now() + timedelta(minutes=5)
        )
        log.refresh_from_db()
        self.assertFalse(log.claim_for_delivery())

        NotificationLog.objects.filter(pk=log.pk).update(
            next_retry_at=timezone.now() - timedelta(seconds=1)
        )
        log.refresh_from_db()
        self.assertTrue(log.claim_for_delivery())

        exhausted = self.create_log(
            status="pending",
            attempts=5,
            max_retries=5,
            sent_at=None,
        )
        self.assertFalse(exhausted.claim_for_delivery())

    def test_terminal_status_is_not_overwritten(self):
        log = self.create_log(status="sent")
        self.assertFalse(log.atomic_update_status("failed"))
        log.refresh_from_db()
        self.assertEqual(log.status, "sent")

    def test_deliver_sends_once_and_persists_provider_metadata(self):
        log = self.create_log(status="pending", attempts=0, sent_at=None)
        task = Mock()
        send = Mock(return_value={"provider": "test"})

        deliver(task, str(log.id), "email", send)
        deliver(task, str(log.id), "email", send)

        log.refresh_from_db()
        self.assertEqual(log.status, "sent")
        self.assertEqual(log.attempts, 1)
        self.assertEqual(log.provider_config, {"provider": "test"})
        self.assertIsNotNone(log.sent_at)
        self.assertEqual(send.call_count, 1)

    def test_duplicate_terminal_execution_is_skipped(self):
        log = self.create_log(status="failed", attempts=1, sent_at=None)
        send = Mock()
        deliver(Mock(), str(log.id), "email", send)
        self.assertEqual(send.call_count, 0)

    def test_permanent_failure_is_terminal(self):
        log = self.create_log(status="pending", attempts=0, sent_at=None)
        send = Mock(side_effect=PermanentDeliveryError("bad recipient"))
        deliver(Mock(), str(log.id), "email", send)
        log.refresh_from_db()
        self.assertEqual(log.status, "failed")
        self.assertEqual(log.error_message, "bad recipient")

    def test_transient_failure_schedules_retry(self):
        class RetryCalled(Exception):
            pass

        class Task:
            def retry(self, **kwargs):
                raise RetryCalled(kwargs)

        log = self.create_log(status="pending", attempts=0, sent_at=None)
        send = Mock(side_effect=RuntimeError("temporary"))
        with self.assertRaises(RetryCalled):
            deliver(Task(), str(log.id), "email", send)

        log.refresh_from_db()
        self.assertEqual(log.status, "retrying")
        self.assertEqual(log.attempts, 1)
        self.assertIsNotNone(log.next_retry_at)

    def test_exhausted_budget_fails_without_calling_provider(self):
        log = self.create_log(status="pending", attempts=5, max_retries=5, sent_at=None)
        send = Mock()
        deliver(Mock(), str(log.id), "email", send)
        log.refresh_from_db()
        self.assertEqual(log.status, "failed")
        self.assertEqual(log.error_message, "Retry budget exhausted")
        self.assertEqual(send.call_count, 0)

    # ------------------------------------------------------------------
    # Metrics
    # ------------------------------------------------------------------

    def make_metric_log(self, *, status, created_at, sent_at=None, **overrides):
        log = self.create_log(status=status, sent_at=sent_at, **overrides)
        NotificationLog.objects.filter(pk=log.pk).update(
            created_at=created_at,
            sent_at=sent_at,
        )
        log.refresh_from_db()
        return log

    def test_metrics_are_windowed_scoped_and_derived_from_rows(self):
        now = timezone.now()
        created = now - timedelta(minutes=10)
        sent_at = created + timedelta(milliseconds=100)
        self.make_metric_log(
            status="sent", created_at=created, sent_at=sent_at, created_by=KEY_A
        )
        self.make_metric_log(
            status="failed",
            created_at=now - timedelta(minutes=5),
            created_by=KEY_A,
        )
        self.make_metric_log(
            status="pending",
            created_at=now - timedelta(minutes=2),
            created_by=KEY_A,
            channel="sms",
            template=self.sms_template,
            to="+14155550123",
        )
        self.make_metric_log(
            status="sent",
            created_at=now - timedelta(hours=30),
            sent_at=now - timedelta(hours=30) + timedelta(milliseconds=500),
            created_by=KEY_A,
        )

        response = self.api_client("tenant-a").get("/api/metrics?window=24h")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["total"], 3)
        self.assertEqual(data["previous_total"], 1)
        self.assertEqual(data["volume_change_pct"], 200.0)
        self.assertEqual(data["by_status"]["sent"], 1)
        self.assertEqual(data["by_status"]["failed"], 1)
        self.assertEqual(data["by_status"]["pending"], 1)
        self.assertEqual(data["deliverability"], 50.0)
        self.assertAlmostEqual(data["latency"]["p50_ms"], 100.0)
        self.assertAlmostEqual(data["latency"]["p95_ms"], 100.0)
        self.assertAlmostEqual(data["latency"]["avg_ms"], 100.0)
        self.assertEqual(sum(point["total"] for point in data["series"]), 3)
        self.assertGreater(data["throughput_per_min"], 0)

        email = next(row for row in data["channels"] if row["channel"] == "email")
        self.assertEqual(email["total"], 2)
        self.assertEqual(email["sent"], 1)
        self.assertEqual(email["failed"], 1)
        self.assertEqual(email["success_rate"], 50.0)
        self.assertEqual(email["p95_latency_ms"], 100.0)

        other = self.api_client("tenant-b").get("/api/metrics?window=24h")
        self.assertEqual(other.status_code, status.HTTP_200_OK)
        self.assertEqual(other.data["total"], 0)
        self.assertEqual(other.data["previous_total"], 0)
        self.assertIsNone(other.data["deliverability"])
        self.assertIsNone(other.data["latency"]["p95_ms"])

    def test_metrics_are_scoped_for_regular_users_and_all_for_staff(self):
        regular = User.objects.create_user(username="regular", password="x")
        staff = User.objects.create_user(username="staff", password="x", is_staff=True)
        self.create_log(scope=f"user:{regular.pk}")
        self.create_log(scope=KEY_A)

        regular_client = APIClient()
        regular_client.force_authenticate(user=regular)
        self.assertEqual(regular_client.get("/api/metrics?window=24h").data["total"], 1)

        staff_client = APIClient()
        staff_client.force_authenticate(user=staff)
        self.assertEqual(staff_client.get("/api/metrics?window=24h").data["total"], 2)
