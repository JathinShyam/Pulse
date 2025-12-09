import uuid
from datetime import timedelta

from django.db import models, transaction
from django.db.models import F, Q
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
            models.Index(fields=["idempotency_key"]),  # Fast lookup
            models.Index(fields=["status", "next_retry_at"]),  # Queue scanning
            models.Index(fields=["user_id", "created_at"]),  # User history
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["idempotency_key"],
                condition=Q(idempotency_key__isnull=False),
                name="unique_idempotency",
            ),
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

    @classmethod
    def create_if_not_exists(cls, **kwargs):
        """Atomic create with idempotency check."""
        with transaction.atomic():
            idempotency_key = kwargs.get("idempotency_key")
            if idempotency_key:
                existing, created = cls.objects.get_or_create(
                    idempotency_key=idempotency_key, defaults=kwargs
                )
                if not created:
                    return existing  # Already processed
                return existing
            else:
                obj = cls(**kwargs)
                obj.save()
                return obj

    def atomic_update_status(self, status, **extra):
        """Concurrency-safe update (e.g., for retries)."""
        with transaction.atomic():
            update_kwargs = {"status": status, **extra}
            if status == "retrying":
                update_kwargs["attempts"] = F("attempts") + 1

            # Only update if still pending (prevents race conditions)
            updated = (
                self.__class__.objects.filter(id=self.id, status="pending")
                .update(**update_kwargs)
            )
            if updated == 0 and status != "pending":
                # If not pending, update anyway (for retry/fail transitions)
                self.__class__.objects.filter(id=self.id).update(**update_kwargs)

            self.refresh_from_db()  # Reload for latest
