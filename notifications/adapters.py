import logging
from abc import ABC, abstractmethod

from .tasks import send_email_task, send_push_task

logger = logging.getLogger(__name__)


class BaseChannelAdapter(ABC):
    @abstractmethod
    def send(self, log_id, payload):
        """Send the notification. Update log on success/fail."""
        raise NotImplementedError


class EmailAdapter(BaseChannelAdapter):
    def send(self, log_id, payload):
        queue = payload.get("queue") or "low_priority"
        send_email_task.apply_async(
            args=[log_id, payload["to"], payload["subject"], payload["body"]],
            queue=queue,
        )
        # Task handles the rest (from Day 2)


class SMSAdapter(BaseChannelAdapter):
    def send(self, log_id, payload):
        from .tasks import send_sms_task

        queue = payload.get("queue") or "low_priority"
        # Queue task - task will handle Twilio API call and retries
        send_sms_task.apply_async(
            args=[log_id, payload["to"], payload["body"]],
            queue=queue,
        )


class PushAdapter(BaseChannelAdapter):
    def send(self, log_id, payload):
        queue = payload.get("queue") or "low_priority"
        # For now, dummy Firebase — replace with real later
        send_push_task.apply_async(
            args=[log_id, payload["device_token"], payload["title"], payload["body"]],
            queue=queue,
        )
