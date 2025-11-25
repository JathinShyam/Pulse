import logging
import time

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import NotificationLog
from .serializers import SendNotificationSerializer
from .tasks import send_email_task

logger = logging.getLogger(__name__)
access_logger = logging.getLogger('pulse.access')


class SendNotificationView(APIView):
    serializer_class = SendNotificationSerializer

    def post(self, request):
        started_at = time.monotonic()
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        logger.info('Received notification request for template=%s user=%s', data['template_name'], data['user_id'])
        existing = data.get('existing_log')
        if existing:
            logger.info('Idempotent hit for notification %s (status=%s)', existing.id, existing.status)
            response = Response(
                {'notification_id': str(existing.id), 'status': existing.status},
                status=status.HTTP_200_OK,
            )
            self._log_response(request, started_at, response.status_code, extra={'notification_id': str(existing.id)})
            return response

        template = data['template']
        rendered_body = data['rendered_body']
        idem_key = data.get('idempotency_key') or None

        log = NotificationLog.objects.create(
            user_id=data['user_id'],
            template=template,
            channel=template.channel,
            to=data['to'],
            idempotency_key=idem_key,
        )

        if template.channel == 'email':
            send_email_task.delay(str(log.id), data['to'], template.subject, rendered_body)
        else:
            logger.info(
                'Channel %s not yet implemented; keeping notification %s pending',
                template.channel,
                log.id,
            )

        logger.info('Notification %s queued for channel=%s destination=%s', log.id, template.channel, log.to)
        response = Response({'notification_id': str(log.id), 'status': 'queued'}, status=status.HTTP_202_ACCEPTED)
        self._log_response(request, started_at, response.status_code, extra={'notification_id': str(log.id)})
        return response

    @staticmethod
    def _log_response(request, started_at: float, status_code: int, extra: dict | None = None) -> None:
        elapsed_ms = (time.monotonic() - started_at) * 1000
        message = f'{request.method} {request.path} {status_code} {round(elapsed_ms)}ms'
        if extra and extra.get('notification_id'):
            message = f'{message} {extra["notification_id"]}'
        access_logger.info(message)
