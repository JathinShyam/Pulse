import uuid

from django.db import models
from django.utils import timezone


class NotificationStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    IN_PROGRESS = 'in_progress', 'In Progress'
    DELIVERED = 'delivered', 'Delivered'
    FAILED = 'failed', 'Failed'


class NotificationChannel(models.TextChoices):
    EMAIL = 'email', 'Email'
    SMS = 'sms', 'SMS'
    PUSH = 'push', 'Push'
    WHATSAPP = 'whatsapp', 'WhatsApp'
    IN_APP = 'in_app', 'In App'


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.CharField(max_length=255)
    channel = models.CharField(max_length=32, choices=NotificationChannel.choices)
    payload = models.JSONField()
    status = models.CharField(
        max_length=16,
        choices=NotificationStatus.choices,
        default=NotificationStatus.PENDING,
    )
    priority = models.PositiveSmallIntegerField(default=5)
    last_error = models.TextField(blank=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.channel} -> {self.recipient}'

    def mark_in_progress(self) -> None:
        self.status = NotificationStatus.IN_PROGRESS
        self.save(update_fields=['status', 'updated_at'])

    def mark_delivered(self) -> None:
        self.status = NotificationStatus.DELIVERED
        self.last_error = ''
        self.save(update_fields=['status', 'last_error', 'updated_at'])

    def mark_failed(self, error: str) -> None:
        self.status = NotificationStatus.FAILED
        self.last_error = error[:500]
        self.save(update_fields=['status', 'last_error', 'updated_at'])

    @property
    def is_due(self) -> bool:
        if not self.scheduled_for:
            return True
        return timezone.now() >= self.scheduled_for
