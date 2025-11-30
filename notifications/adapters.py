import logging
from abc import ABC, abstractmethod
from .tasks import send_email_task, send_push_task

logger = logging.getLogger(__name__)


class BaseChannelAdapter(ABC):
    @abstractmethod
    def send(self, log_id, payload):
        """Send the notification. Update log on success/fail."""
        pass


class EmailAdapter(BaseChannelAdapter):
    def send(self, log_id, payload):

        send_email_task.delay(
            log_id, payload["to"], payload["subject"], payload["body"]
        )
        # Task handles the rest (from Day 2)


class SMSAdapter(BaseChannelAdapter):
    def send(self, log_id, payload):
        from .tasks import send_sms_task

        # Queue task - task will handle Twilio API call and retries
        send_sms_task.delay(log_id, payload["to"], payload["body"])


class PushAdapter(BaseChannelAdapter):
    def send(self, log_id, payload):

        # For now, dummy Firebase — replace with real later
        send_push_task.delay(
            log_id, payload["device_token"], payload["title"], payload["body"]
        )
