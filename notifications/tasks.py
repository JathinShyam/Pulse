import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from .models import NotificationLog

logger = logging.getLogger(__name__)
if not any(isinstance(h, logging.FileHandler) and getattr(h, 'baseFilename', '').endswith('celery.log') for h in logger.handlers):
    handler = logging.FileHandler('logs/celery.log')
    handler.setFormatter(logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s'))
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


@shared_task(bind=True, max_retries=5, default_retry_delay=60)
def send_email_task(self, log_id: str, to_email: str, subject: str, body: str) -> None:
    try:
        log = NotificationLog.objects.get(id=log_id)
    except NotificationLog.DoesNotExist:
        logger.warning('NotificationLog %s no longer exists, skipping email send', log_id)
        return

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'pulse@example.com'),
            recipient_list=[to_email],
            fail_silently=False,
        )
        log.mark_sent()
        logger.info('Email sent successfully to %s (log=%s)', to_email, log_id)
    except Exception as exc:  # pragma: no cover - network/provider specific
        next_attempt = log.attempts + 1
        retry_delay = 60 * (2 ** next_attempt)
        log.mark_retry(str(exc), retry_delay=retry_delay)
        if log.status == 'failed':
            logger.exception(
                'Email delivery failed permanently for %s (log=%s)', to_email, log_id, exc_info=exc
            )
            raise
        logger.warning(
            'Email delivery failed for %s (log=%s). Retrying in %s seconds',
            to_email,
            log_id,
            retry_delay,
        )
        raise self.retry(exc=exc, countdown=retry_delay)
