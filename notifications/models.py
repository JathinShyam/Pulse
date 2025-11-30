import uuid
from datetime import timedelta

from django.db import models
from django.utils import timezone


class NotificationTemplate(models.Model):
    CHANNEL_CHOICES = [
        ("email", "Email"),
        ("sms", "SMS"),
        ("push", "Push"),
        ("whatsapp", "WhatsApp"),
        ("in_app", "In-App"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=200, blank=True)
    body_template = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.channel})"


class NotificationLog(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("sent", "Sent"),
        ("failed", "Failed"),
        ("retrying", "Retrying"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100)
    template = models.ForeignKey(NotificationTemplate, on_delete=models.CASCADE)
    channel = models.CharField(max_length=20)
    to = models.CharField(max_length=255)
    idempotency_key = models.CharField(
        max_length=255, unique=True, null=True, blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    attempts = models.PositiveIntegerField(default=0)
    max_retries = models.PositiveIntegerField(default=5)
    last_attempt_at = models.DateTimeField(null=True, blank=True)
    next_retry_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    provider_config = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["idempotency_key"]),
            models.Index(fields=["status"]),
            models.Index(fields=["next_retry_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.channel} \u2192 {self.to} [{self.status}]"

    def mark_retry(self, error: str, retry_delay: int) -> None:
        """Update bookkeeping for a retry attempt."""
        self.attempts += 1
        self.last_attempt_at = timezone.now()
        self.error_message = error
        self.status = "retrying" if self.attempts < self.max_retries else "failed"
        if self.status == "retrying":
            self.next_retry_at = self.last_attempt_at + timedelta(seconds=retry_delay)
        self.save(
            update_fields=[
                "attempts",
                "last_attempt_at",
                "error_message",
                "status",
                "next_retry_at",
            ],
        )

    def mark_sent(self) -> None:
        self.status = "sent"
        self.sent_at = timezone.now()
        self.last_attempt_at = self.sent_at
        self.save(update_fields=["status", "sent_at", "last_attempt_at"])
