import logging
import time

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .adapters import EmailAdapter, PushAdapter, SMSAdapter
from .models import NotificationLog, NotificationTemplate
from .serializers import SendNotificationSerializer

logger = logging.getLogger(__name__)
access_logger = logging.getLogger("pulse.access")


class SendNotificationView(APIView):
    serializer_class = SendNotificationSerializer

    def post(self, request):
        started_at = time.monotonic()
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        logger.info(
            "Received notification request for template=%s user=%s",
            data["template_name"],
            data["user_id"],
        )
        existing = data.get("existing_log")
        if existing:
            logger.info(
                "Idempotent hit for notification %s (status=%s)",
                existing.id,
                existing.status,
            )
            response = Response(
                {"notification_id": str(existing.id), "status": existing.status},
                status=status.HTTP_200_OK,
            )
            self._log_response(
                request,
                started_at,
                response.status_code,
                extra={"notification_id": str(existing.id)},
            )
            return response

        template = data["template"]
        rendered_body = data["rendered_body"]
        idem_key = data.get("idempotency_key") or None
        channel = data.get("channel", template.channel)

        # Use atomic create for idempotency
        log = NotificationLog.create_if_not_exists(
            user_id=data["user_id"],
            template=template,
            channel=channel,
            to=data["to"],
            idempotency_key=idem_key,
            max_retries=5,  # Default
        )

        # Check if this was an existing log (idempotent request)
        # The serializer already checks, but create_if_not_exists handles race conditions
        if idem_key and existing and existing.id == log.id:
            # This is a duplicate request
            logger.info(
                "Idempotent hit for notification %s (status=%s)",
                log.id,
                log.status,
            )
            return Response(
                {"notification_id": str(log.id), "status": log.status},
                status=status.HTTP_200_OK,
            )

        adapters = {
            "email": EmailAdapter(),
            "sms": SMSAdapter(),
            "push": PushAdapter(),
        }

        if channel in adapters:
            adapter = adapters[channel]
            payload = {
                "to": data["to"],
                "subject": data.get("subject", template.subject),
                "body": rendered_body,
                "device_token": data.get("device_token") if channel == "push" else None,
                "title": data.get("title", template.subject)
                if channel == "push"
                else None,
            }
            try:
                adapter.send(str(log.id), payload)
            except Exception as e:
                logger.exception(
                    "Failed to send notification via adapter for channel=%s (log=%s)",
                    channel,
                    log.id,
                    exc_info=e,
                )
                # Log the error immediately with atomic update
                log.atomic_update_status("failed", error_message=str(e), next_retry_at=None)
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            logger.warning(
                "Unsupported channel %s for notification %s; keeping notification pending",
                channel,
                log.id,
            )
            log.atomic_update_status("failed", error_message="Unsupported channel")
            return Response(
                {"error": "Unsupported channel"}, status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(
            "Notification %s queued for channel=%s destination=%s",
            log.id,
            template.channel,
            log.to,
        )
        response = Response(
            {"notification_id": str(log.id), "status": "queued"},
            status=status.HTTP_202_ACCEPTED,
        )
        self._log_response(
            request,
            started_at,
            response.status_code,
            extra={"notification_id": str(log.id)},
        )
        return response

    @staticmethod
    def _log_response(
        request, started_at: float, status_code: int, extra: dict | None = None
    ) -> None:
        elapsed_ms = (time.monotonic() - started_at) * 1000
        message = f"{request.method} {request.path} {status_code} {round(elapsed_ms)}ms"
        if extra and extra.get("notification_id"):
            message = f"{message} {extra['notification_id']}"
        access_logger.info(message)


class NotificationStatusView(APIView):
    """Get notification status by ID"""

    def get(self, request, notification_id):
        try:
            log = NotificationLog.objects.get(id=notification_id)
            return Response(
                {
                    "notification_id": str(log.id),
                    "user_id": log.user_id,
                    "template_name": log.template.name,
                    "channel": log.channel,
                    "to": log.to,
                    "status": log.status,
                    "attempts": log.attempts,
                    "max_retries": log.max_retries,
                    "created_at": log.created_at.isoformat(),
                    "sent_at": log.sent_at.isoformat() if log.sent_at else None,
                    "last_attempt_at": log.last_attempt_at.isoformat()
                    if log.last_attempt_at
                    else None,
                    "next_retry_at": log.next_retry_at.isoformat()
                    if log.next_retry_at
                    else None,
                    "error_message": log.error_message,
                    "provider_config": log.provider_config,
                    "idempotency_key": log.idempotency_key,
                },
                status=status.HTTP_200_OK,
            )
        except NotificationLog.DoesNotExist:
            return Response(
                {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
            )


class NotificationListView(APIView):
    """List all notifications with optional filters"""

    def get(self, request):
        logs = NotificationLog.objects.all().order_by("-created_at")

        # Optional filters
        user_id = request.query_params.get("user_id")
        channel = request.query_params.get("channel")
        status_filter = request.query_params.get("status")
        limit = int(request.query_params.get("limit", 50))

        if user_id:
            logs = logs.filter(user_id=user_id)
        if channel:
            logs = logs.filter(channel=channel)
        if status_filter:
            logs = logs.filter(status=status_filter)

        logs = logs[:limit]

        return Response(
            {
                "count": len(logs),
                "results": [
                    {
                        "notification_id": str(log.id),
                        "user_id": log.user_id,
                        "template_name": log.template.name,
                        "channel": log.channel,
                        "to": log.to,
                        "status": log.status,
                        "attempts": log.attempts,
                        "created_at": log.created_at.isoformat(),
                        "sent_at": log.sent_at.isoformat() if log.sent_at else None,
                    }
                    for log in logs
                ],
            },
            status=status.HTTP_200_OK,
        )


class TemplateListView(APIView):
    """List all notification templates"""

    def get(self, request):
        templates = NotificationTemplate.objects.all().order_by("-created_at")
        channel_filter = request.query_params.get("channel")

        if channel_filter:
            templates = templates.filter(channel=channel_filter)

        return Response(
            {
                "count": len(templates),
                "results": [
                    {
                        "id": str(template.id),
                        "name": template.name,
                        "channel": template.channel,
                        "subject": template.subject,
                        "body_template": template.body_template,
                        "created_at": template.created_at.isoformat(),
                    }
                    for template in templates
                ],
            },
            status=status.HTTP_200_OK,
        )


class TemplateDetailView(APIView):
    """Get template details by UUID"""

    def get(self, request, template_id):
        try:
            template = NotificationTemplate.objects.get(id=template_id)
            return Response(
                {
                    "id": str(template.id),
                    "name": template.name,
                    "channel": template.channel,
                    "subject": template.subject,
                    "body_template": template.body_template,
                    "created_at": template.created_at.isoformat(),
                },
                status=status.HTTP_200_OK,
            )
        except NotificationTemplate.DoesNotExist:
            return Response(
                {"error": "Template not found"}, status=status.HTTP_404_NOT_FOUND
            )
