import logging
from typing import Any

from celery import shared_task
from django.utils import timezone

from .models import Notification, NotificationStatus

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def dispatch_notification(self, notification_id: str) -> str | None:
    try:
        notification = Notification.objects.get(id=notification_id)
    except Notification.DoesNotExist:
        logger.warning('Notification %s no longer exists', notification_id)
        return None

    if notification.status not in {NotificationStatus.PENDING, NotificationStatus.IN_PROGRESS}:
        logger.info('Notification %s already processed (status=%s)', notification.id, notification.status)
        return str(notification.id)

    if not notification.is_due:
        logger.info('Notification %s scheduled for later, skipping for now', notification.id)
        raise self.retry(countdown=5)

    notification.mark_in_progress()
    try:
        _deliver(notification)
        notification.mark_delivered()
    except Exception as exc:  # pragma: no cover - placeholder for real integration errors
        logger.exception('Failed to deliver notification %s', notification.id)
        notification.mark_failed(str(exc))
        raise self.retry(exc=exc, countdown=min(2 ** self.request.retries, 60))

    return str(notification.id)


def _deliver(notification: Notification) -> None:
    # Placeholder dispatch implementation until real providers are wired.
    logger.info(
        'Delivering %s notification to %s with payload=%s at %s',
        notification.channel,
        notification.recipient,
        notification.payload,
        timezone.now(),
    )
