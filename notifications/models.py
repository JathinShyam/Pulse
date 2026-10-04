import uuid

from django.db import models
from django.db.models import F
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
    body_template = models.TextField(
        help_text="Python str.format placeholders, e.g. 'Hello {name}'. "
        "Use '{{' and '}}' for literal braces."
    )
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
    TERMINAL_STATUSES = ("sent",)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100)
    # PROTECT: deleting a template must not silently wipe its delivery history.
    template = models.ForeignKey(NotificationTemplate, on_delete=models.PROTECT)
    channel = models.CharField(max_length=20)
    to = models.CharField(max_length=255)
    # unique=True already creates the (only) index needed; NULLs are not unique.
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
            models.Index(fields=["status", "next_retry_at"]),  # Queue scanning
            models.Index(fields=["user_id", "created_at"]),  # User history
            models.Index(fields=["created_at"]),  # Listing / retention cleanup
        ]

    def __str__(self) -> str:
        return f"{self.channel} \u2192 {self.to} [{self.status}]"

    @classmethod
    def get_or_create_idempotent(cls, **kwargs) -> tuple["NotificationLog", bool]:
        """
        Create a log, or return the existing one for the same idempotency key.

        Returns (log, created). Concurrency-safe: the unique constraint on
        idempotency_key makes concurrent creators collapse onto one row
        (Django's get_or_create retries the lookup on IntegrityError).
        Callers MUST only enqueue delivery when created is True.
        """
        idempotency_key = kwargs.pop("idempotency_key", None) or None
        if idempotency_key:
            return cls.objects.get_or_create(
                idempotency_key=idempotency_key, defaults=kwargs
            )
        return cls.objects.create(**kwargs), True

    @classmethod
    def create_if_not_exists(cls, **kwargs) -> "NotificationLog":
        """Atomic create with idempotency check (returns only the log)."""
        log, _created = cls.get_or_create_idempotent(**kwargs)
        return log

    def atomic_update_status(
        self, status: str, *, count_attempt: bool = False, **extra
    ) -> bool:
        """
        Concurrency-safe status transition.

        A notification that is already 'sent' is terminal and is never moved
        back to another state (protects against duplicate/late task executions
        under Celery's at-least-once delivery). Returns True if a row changed.
        """
        update_kwargs = {"status": status, **extra}
        if count_attempt:
            update_kwargs["attempts"] = F("attempts") + 1
            update_kwargs.setdefault("last_attempt_at", timezone.now())

        updated = (
            type(self)
            .objects.filter(id=self.id)
            .exclude(status__in=self.TERMINAL_STATUSES)
            .update(**update_kwargs)
        )
        self.refresh_from_db()
        return bool(updated)
