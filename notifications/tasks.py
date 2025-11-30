import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

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
        log.mark_sent()
        logger.info("Email sent successfully to %s (log=%s)", to_email, log_id)
    except Exception as exc:  # pragma: no cover - network/provider specific
        next_attempt = log.attempts + 1
        retry_delay = 60 * (2**next_attempt)
        log.mark_retry(str(exc), retry_delay=retry_delay)
        if log.status == "failed":
            logger.exception(
                "Email delivery failed permanently for %s (log=%s)",
                to_email,
                log_id,
                exc_info=exc,
            )
            raise
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
        log.mark_sent()
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
        next_attempt = log.attempts + 1
        retry_delay = 60 * (2**next_attempt)
        log.mark_retry(str(exc), retry_delay=retry_delay)
        if log.status == "failed":
            logger.exception(
                "SMS delivery failed permanently for %s (log=%s)",
                to_phone,
                log_id,
                exc_info=exc,
            )
            raise
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
        log.mark_sent()
    except Exception as exc:
        next_attempt = log.attempts + 1
        retry_delay = 60 * (2**next_attempt)
        log.mark_retry(str(exc), retry_delay=retry_delay)
        if log.status == "failed":
            logger.exception(
                "Push delivery failed permanently for %s (log=%s)",
                device_token,
                log_id,
                exc_info=exc,
            )
            raise
        logger.warning(
            "Push delivery failed for %s (log=%s). Retrying in %s seconds",
            device_token,
            log_id,
            retry_delay,
        )
        raise self.retry(exc=exc, countdown=retry_delay)
