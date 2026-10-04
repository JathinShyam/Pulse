import logging
import random
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import NotificationLog

logger = logging.getLogger(__name__)


class PermanentDeliveryError(Exception):
    """A failure that retrying cannot fix (bad config, invalid recipient...)."""


def retry_delay_for(attempt: int) -> int:
    """Exponential backoff with +/-10% jitter: base * 2**attempt seconds."""
    delay = settings.NOTIFICATION_RETRY_BASE_DELAY * (2**attempt)
    return max(1, int(delay * random.uniform(0.9, 1.1)))


def mask_recipient(value: str) -> str:
    """Avoid writing full email addresses / phone numbers / tokens to logs."""
    if not value:
        return ""
    if "@" in value:
        local, _, domain = value.partition("@")
        return f"{local[:1]}***@{domain}"
    return f"{value[:3]}***{value[-2:]}" if len(value) > 6 else "***"


def deliver(task, log_id: str, channel: str, send) -> None:
    """
    Shared delivery routine for all channels.

    ``send(log)`` performs the provider call and returns a dict of provider
    metadata to store on the log. It raises PermanentDeliveryError for
    non-retryable failures; any other exception is retried with exponential
    backoff until NotificationLog.max_retries attempts have been made.
    """
    try:
        log = NotificationLog.objects.get(id=log_id)
    except NotificationLog.DoesNotExist:
        logger.warning(
            "NotificationLog %s no longer exists, skipping %s send", log_id, channel
        )
        return

    # Celery delivers at-least-once (acks_late, worker crashes, redeliveries):
    # never send twice.
    if log.status == "sent":
        logger.info(
            "Notification %s already sent; skipping duplicate execution", log_id
        )
        return

    recipient = mask_recipient(log.to)
    try:
        provider_meta = send(log) or {}
    except PermanentDeliveryError as exc:
        log.atomic_update_status(
            "failed", count_attempt=True, error_message=str(exc), next_retry_at=None
        )
        logger.error(
            "%s delivery to %s failed permanently (log=%s): %s",
            channel,
            recipient,
            log_id,
            exc,
        )
        return
    except Exception as exc:
        attempt = log.attempts + 1
        if attempt >= log.max_retries:
            log.atomic_update_status(
                "failed", count_attempt=True, error_message=str(exc), next_retry_at=None
            )
            logger.exception(
                "%s delivery to %s failed after %s attempts (log=%s)",
                channel,
                recipient,
                attempt,
                log_id,
            )
            return

        delay = retry_delay_for(attempt)
        log.atomic_update_status(
            "retrying",
            count_attempt=True,
            error_message=str(exc),
            next_retry_at=timezone.now() + timedelta(seconds=delay),
        )
        logger.warning(
            "%s delivery to %s failed (attempt %s/%s, log=%s): %s. Retrying in %ss",
            channel,
            recipient,
            attempt,
            log.max_retries,
            log_id,
            exc,
            delay,
        )
        raise task.retry(exc=exc, countdown=delay, max_retries=log.max_retries) from exc

    now = timezone.now()
    log.atomic_update_status(
        "sent",
        count_attempt=True,
        sent_at=now,
        last_attempt_at=now,
        next_retry_at=None,
        error_message=None,
        provider_config=provider_meta,
    )
    logger.info("%s sent to %s (log=%s)", channel, recipient, log_id)


# ---------------------------------------------------------------------------
# Channel tasks. Signatures are unchanged so already-queued messages still work.
# ---------------------------------------------------------------------------


@shared_task(bind=True, max_retries=None)
def send_email_task(self, log_id: str, to_email: str, subject: str, body: str) -> None:
    def _send(log):
        try:
            send_mail(
                subject=subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to_email],
                fail_silently=False,
            )
        except Exception as exc:
            import smtplib

            if isinstance(exc, smtplib.SMTPRecipientsRefused):
                raise PermanentDeliveryError(f"Recipient refused: {exc}") from exc
            raise
        return {"provider": "smtp"}

    deliver(self, log_id, "email", _send)


@shared_task(bind=True, max_retries=None)
def send_sms_task(self, log_id: str, to_phone: str, body: str) -> None:
    def _send(log):
        if not (
            settings.TWILIO_ACCOUNT_SID
            and settings.TWILIO_AUTH_TOKEN
            and settings.TWILIO_PHONE_NUMBER
        ):
            raise PermanentDeliveryError(
                "SMS provider not configured (set TWILIO_ACCOUNT_SID, "
                "TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER)"
            )
        from twilio.base.exceptions import TwilioRestException
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        try:
            message = client.messages.create(
                body=body, from_=settings.TWILIO_PHONE_NUMBER, to=to_phone
            )
        except TwilioRestException as exc:
            # 4xx (invalid number, unverified recipient, auth...) won't succeed
            # on retry; 429 and 5xx are transient.
            if exc.status and 400 <= exc.status < 500 and exc.status != 429:
                raise PermanentDeliveryError(
                    f"Twilio error {exc.code}: {exc.msg}"
                ) from exc
            raise
        return {"provider": "twilio", "twilio_sid": str(message.sid)}

    deliver(self, log_id, "sms", _send)


_firebase_app = None


def _get_firebase_app():
    global _firebase_app
    if _firebase_app is None:
        import firebase_admin
        from firebase_admin import credentials

        cred = (
            credentials.Certificate(settings.FIREBASE_CREDENTIALS_FILE)
            if settings.FIREBASE_CREDENTIALS_FILE
            else credentials.ApplicationDefault()
        )
        _firebase_app = firebase_admin.initialize_app(cred)
    return _firebase_app


@shared_task(bind=True, max_retries=None)
def send_push_task(self, log_id: str, device_token: str, title: str, body: str) -> None:
    def _send(log):
        if not device_token:
            raise PermanentDeliveryError("No device token provided")

        if settings.PUSH_BACKEND == "fcm":
            from firebase_admin import exceptions as fb_exceptions
            from firebase_admin import messaging

            message = messaging.Message(
                notification=messaging.Notification(title=title or None, body=body),
                token=device_token,
            )
            try:
                message_id = messaging.send(message, app=_get_firebase_app())
            except (
                messaging.UnregisteredError,
                fb_exceptions.InvalidArgumentError,
            ) as exc:
                raise PermanentDeliveryError(f"FCM rejected token: {exc}") from exc
            return {"provider": "fcm", "message_id": message_id}

        if settings.PUSH_BACKEND == "console":
            # Simulated delivery for demos/local dev. Never log the body: it may
            # contain OTPs or other secrets.
            logger.info(
                "[console push] token=%s title=%r (log=%s)",
                mask_recipient(device_token),
                title,
                log_id,
            )
            return {"provider": "console", "simulated": True}

        raise PermanentDeliveryError(f"Unknown PUSH_BACKEND '{settings.PUSH_BACKEND}'")

    deliver(self, log_id, "push", _send)


@shared_task(queue="low_priority")
def cleanup_old_logs(days_old=30):
    """Delete old notification logs (failed/sent) older than specified days."""
    cutoff = timezone.now() - timedelta(days=days_old)
    # In production you might move these to an archive table / cold storage.
    deleted, _ = NotificationLog.objects.filter(
        status__in=["failed", "sent"], created_at__lt=cutoff
    ).delete()
    logger.info("Cleaned up %s logs older than %s days", deleted, days_old)
    return deleted


@shared_task(queue="low_priority")
def send_daily_digest():
    """
    Sample recurring task to show how Celery Beat integrates with the app.

    For now this is intentionally simple and only logs activity, but it can be
    extended to aggregate per-user notification stats and send summary
    emails/SMS. "Quiet" users are users with history but no notification in
    the last 7 days.
    """
    seven_days_ago = timezone.now() - timedelta(days=7)
    recently_active = NotificationLog.objects.filter(
        created_at__gte=seven_days_ago
    ).values("user_id")
    quiet_users = (
        NotificationLog.objects.exclude(user_id__in=recently_active)
        .values_list("user_id", flat=True)
        .distinct()[:50]
    )
    count = len(quiet_users)
    if count:
        logger.info("send_daily_digest would run for %s quiet users", count)
    else:
        logger.info("send_daily_digest found no quiet users to notify")
    return count
