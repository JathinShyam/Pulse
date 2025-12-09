import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import NotificationLog

logger = logging.getLogger(__name__)
if not any(
    isinstance(h, logging.FileHandler)
    and getattr(h, "baseFilename", "").endswith("celery.log")
    for h in logger.handlers
):
    handler = logging.FileHandler("logs/celery.log")
    handler.setFormatter(
        logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    )
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


@shared_task(bind=True, max_retries=5, default_retry_delay=60)
def send_email_task(self, log_id: str, to_email: str, subject: str, body: str) -> None:
    try:
        log = NotificationLog.objects.get(id=log_id)
    except NotificationLog.DoesNotExist:
        logger.warning(
            "NotificationLog %s no longer exists, skipping email send", log_id
        )
        return

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "pulse@example.com"),
            recipient_list=[to_email],
            fail_silently=False,
        )
        # Atomic success update
        log.atomic_update_status("sent", sent_at=timezone.now(), last_attempt_at=timezone.now())
        logger.info("Email sent successfully to %s (log=%s)", to_email, log_id)
    except Exception as exc:  # pragma: no cover - network/provider specific
        # Atomic fail/retry
        next_attempt = log.attempts + 1
        retry_delay = 60 * (2**next_attempt)
        next_retry = timezone.now() + timezone.timedelta(seconds=retry_delay)

        if next_attempt >= log.max_retries:
            log.atomic_update_status(
                "failed",
                error_message=str(exc),
                last_attempt_at=timezone.now(),
                next_retry_at=None,
            )
            logger.exception(
                "Email delivery failed permanently for %s (log=%s)",
                to_email,
                log_id,
                exc_info=exc,
            )
            return  # No retry

        log.atomic_update_status(
            "retrying",
            error_message=str(exc),
            last_attempt_at=timezone.now(),
            next_retry_at=next_retry,
        )
        logger.warning(
            "Email delivery failed for %s (log=%s). Retrying in %s seconds",
            to_email,
            log_id,
            retry_delay,
        )
        raise self.retry(exc=exc, countdown=retry_delay)


@shared_task(bind=True, max_retries=5, default_retry_delay=60)
def send_sms_task(self, log_id: str, to_phone: str, body: str) -> None:
    try:
        log = NotificationLog.objects.get(id=log_id)
    except NotificationLog.DoesNotExist:
        logger.warning("NotificationLog %s no longer exists, skipping SMS send", log_id)
        return

    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=body, from_=settings.TWILIO_PHONE_NUMBER, to=to_phone
        )
        # Atomic success update
        log.atomic_update_status("sent", sent_at=timezone.now(), last_attempt_at=timezone.now())
        # Store SID in provider_config for tracking
        log.provider_config = {"twilio_sid": str(message.sid)}
        log.save(update_fields=["provider_config"])
        logger.info(
            "SMS sent successfully to %s, SID: %s (log=%s)",
            to_phone,
            message.sid,
            log_id,
        )
    except Exception as exc:
        # Atomic fail/retry
        next_attempt = log.attempts + 1
        retry_delay = 60 * (2**next_attempt)
        next_retry = timezone.now() + timezone.timedelta(seconds=retry_delay)

        if next_attempt >= log.max_retries:
            log.atomic_update_status(
                "failed",
                error_message=str(exc),
                last_attempt_at=timezone.now(),
                next_retry_at=None,
            )
            logger.exception(
                "SMS delivery failed permanently for %s (log=%s)",
                to_phone,
                log_id,
                exc_info=exc,
            )
            return  # No retry

        log.atomic_update_status(
            "retrying",
            error_message=str(exc),
            last_attempt_at=timezone.now(),
            next_retry_at=next_retry,
        )
        logger.warning(
            "SMS delivery failed for %s (log=%s). Retrying in %s seconds",
            to_phone,
            log_id,
            retry_delay,
        )
        raise self.retry(exc=exc, countdown=retry_delay)


@shared_task(bind=True, max_retries=5, default_retry_delay=60)
def send_push_task(self, log_id: str, device_token: str, title: str, body: str) -> None:
    try:
        log = NotificationLog.objects.get(id=log_id)
    except NotificationLog.DoesNotExist:
        logger.warning(
            "NotificationLog %s no longer exists, skipping Push send", log_id
        )
        return

    try:
        # Dummy for now — prints to logs. Real:
        # from firebase_admin import messaging
        # message = messaging.Message(
        #     notification=messaging.Notification(title=title, body=body),
        #     token=device_token,
        # )
        # response = messaging.send(message)

        logger.info(
            "Push sent to %s: %s - %s (log=%s)", device_token, title, body, log_id
        )
        # Atomic success update
        log.atomic_update_status("sent", sent_at=timezone.now(), last_attempt_at=timezone.now())
    except Exception as exc:
        # Atomic fail/retry
        next_attempt = log.attempts + 1
        retry_delay = 60 * (2**next_attempt)
        next_retry = timezone.now() + timezone.timedelta(seconds=retry_delay)

        if next_attempt >= log.max_retries:
            log.atomic_update_status(
                "failed",
                error_message=str(exc),
                last_attempt_at=timezone.now(),
                next_retry_at=None,
            )
            logger.exception(
                "Push delivery failed permanently for %s (log=%s)",
                device_token,
                log_id,
                exc_info=exc,
            )
            return  # No retry

        log.atomic_update_status(
            "retrying",
            error_message=str(exc),
            last_attempt_at=timezone.now(),
            next_retry_at=next_retry,
        )
        logger.warning(
            "Push delivery failed for %s (log=%s). Retrying in %s seconds",
            device_token,
            log_id,
            retry_delay,
        )
        raise self.retry(exc=exc, countdown=retry_delay)


@shared_task
def cleanup_old_logs(days_old=30):
    """Archive old notification logs (failed/sent) older than specified days."""
    from .models import NotificationLog

    cutoff = timezone.now() - timezone.timedelta(days=days_old)
    old_logs = NotificationLog.objects.filter(
        status__in=["failed", "sent"], created_at__lt=cutoff
    )
    archived_count = old_logs.count()
    # For now, just delete old logs (in production, you might move to archive table)
    old_logs.delete()
    logger.info(f"Cleaned up {archived_count} old logs older than {days_old} days")
    return archived_count
