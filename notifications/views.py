import logging
import time

from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .adapters import EmailAdapter, PushAdapter, SMSAdapter
from .models import NotificationLog, NotificationTemplate
from .rate_limiter import RateLimiter
from .scoping import principal_scope, scoped_logs
from .serializers import (
    ErrorResponseSerializer,
    NotificationIdempotentResponseSerializer,
    NotificationListQuerySerializer,
    NotificationListResponseSerializer,
    NotificationQueuedResponseSerializer,
    NotificationStatusResponseSerializer,
    SendNotificationSerializer,
    TemplateListQuerySerializer,
    TemplateListResponseSerializer,
    TemplateSerializer,
)

# Conditional import for OpenAPI decorators
if settings.ENABLE_DOCS:
    from drf_spectacular.utils import (
        OpenApiExample,
        OpenApiParameter,
        OpenApiResponse,
        extend_schema,
    )
else:
    # No-op decorator when docs are disabled
    def extend_schema(*args, **kwargs):
        def decorator(func):
            return func

        return decorator

    OpenApiParameter = None
    OpenApiExample = None
    OpenApiResponse = None

logger = logging.getLogger(__name__)
access_logger = logging.getLogger("pulse.access")


def _same_request(log: NotificationLog, *, data: dict, scope: str) -> bool:
    """Whether an existing idempotent row describes this exact request."""
    if log.request_fingerprint and data.get("request_fingerprint"):
        return log.created_by == scope and (
            log.request_fingerprint == data["request_fingerprint"]
        )
    # Rows created before request_fingerprint existed fall back to the fields
    # that were stored at the time.
    return (
        log.created_by == scope
        and log.user_id == data["user_id"]
        and log.to == data["to"]
        and log.template_id == data["template"].id
        and log.channel == data["channel"]
    )


def _idempotency_conflict() -> Response:
    return Response(
        {"error": "This idempotency key was already used for a different request."},
        status=status.HTTP_409_CONFLICT,
    )


class SendNotificationView(APIView):
    """
    Queue a notification for delivery via email, SMS, or push.

    Supports idempotency keys for exactly-once acceptance and priority routing
    based on an explicit priority or template-name keywords.
    """

    serializer_class = SendNotificationSerializer

    @extend_schema(
        tags=["Notifications"],
        summary="Send a notification",
        description="Queue a notification for asynchronous delivery. "
        "Supports email, SMS, and push channels with idempotency and rate limiting.",
        request=SendNotificationSerializer,
        responses={
            202: NotificationQueuedResponseSerializer,
            200: NotificationIdempotentResponseSerializer,
            400: ErrorResponseSerializer,
            409: ErrorResponseSerializer,
            429: ErrorResponseSerializer,
            503: ErrorResponseSerializer,
        },
    )
    def post(self, request):
        started_at = time.monotonic()
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        template = data["template"]
        channel = data["channel"]
        scope = principal_scope(request)
        idem_key = data.get("idempotency_key")

        logger.info(
            "Received notification request for template=%s user=%s channel=%s",
            template.name,
            data["user_id"],
            channel,
        )

        # Fast path for an already-seen key. The atomic create below is still
        # authoritative; this only avoids consuming rate-limit budget and makes
        # the common duplicate cheap.
        if idem_key:
            existing = NotificationLog.objects.filter(idempotency_key=idem_key).first()
            if existing:
                if not _same_request(existing, data=data, scope=scope):
                    response = _idempotency_conflict()
                else:
                    logger.info(
                        "Idempotent hit for notification %s (status=%s)",
                        existing.id,
                        existing.status,
                    )
                    response = Response(
                        {
                            "notification_id": str(existing.id),
                            "status": existing.status,
                        },
                        status=status.HTTP_200_OK,
                    )
                self._log_response(
                    request,
                    started_at,
                    response.status_code,
                    extra={"notification_id": str(existing.id)},
                )
                return response

        if settings.RATE_LIMIT_ENABLED:
            limiter = RateLimiter(
                max_requests=settings.RATE_LIMIT_MAX_REQUESTS,
                window=settings.RATE_LIMIT_WINDOW_SECONDS,
            )
            rate_key = f"{scope}:{data['user_id']}:{channel}"
            if not limiter.is_allowed(rate_key):
                logger.warning(
                    "Rate limit exceeded for user=%s channel=%s",
                    data["user_id"],
                    channel,
                )
                response = Response(
                    {"error": "Rate limit exceeded. Try again later."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                    headers={"Retry-After": str(limiter.retry_after())},
                )
                self._log_response(
                    request,
                    started_at,
                    response.status_code,
                    extra={"user_id": data["user_id"], "channel": channel},
                )
                return response

        # The unique key makes concurrent creators collapse onto one row.
        log, created = NotificationLog.get_or_create_idempotent(
            user_id=data["user_id"],
            template=template,
            channel=channel,
            to=data["to"],
            idempotency_key=idem_key,
            created_by=scope,
            max_retries=settings.NOTIFICATION_MAX_RETRIES,
            request_fingerprint=data["request_fingerprint"],
        )

        if not created:
            if not _same_request(log, data=data, scope=scope):
                response = _idempotency_conflict()
            else:
                logger.info(
                    "Idempotent hit for notification %s (status=%s)",
                    log.id,
                    log.status,
                )
                response = Response(
                    {"notification_id": str(log.id), "status": log.status},
                    status=status.HTTP_200_OK,
                )
            self._log_response(
                request,
                started_at,
                response.status_code,
                extra={"notification_id": str(log.id)},
            )
            return response

        adapters = {
            "email": EmailAdapter(),
            "sms": SMSAdapter(),
            "push": PushAdapter(),
        }
        adapter = adapters.get(channel)
        if adapter is None:  # Serializer already restricts this; defence in depth.
            log.atomic_update_status("failed", error_message="Unsupported channel")
            return Response(
                {"error": "Unsupported channel"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {
            "to": data["to"],
            "subject": data["rendered_subject"],
            "body": data["rendered_body"],
            "device_token": data.get("device_token") if channel == "push" else None,
            "title": data["rendered_title"] if channel == "push" else None,
            "queue": data["queue"],
        }
        try:
            adapter.send(str(log.id), payload)
        except Exception:
            logger.exception(
                "Failed to enqueue notification %s for channel=%s", log.id, channel
            )
            log.atomic_update_status(
                "failed",
                error_message="Delivery queue unavailable",
                next_retry_at=None,
            )
            response = Response(
                {
                    "error": "Delivery queue unavailable. Retry with a new idempotency key."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
            self._log_response(
                request,
                started_at,
                response.status_code,
                extra={"notification_id": str(log.id)},
            )
            return response

        logger.info(
            "Notification %s queued on %s for channel=%s destination=%s",
            log.id,
            data["queue"],
            channel,
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
    """Get notification status by ID (scoped to the caller)."""

    @extend_schema(
        tags=["Notifications"],
        summary="Get notification status",
        description="Retrieve the current status and metadata of a specific notification by its UUID.",
        responses={
            200: NotificationStatusResponseSerializer,
            404: ErrorResponseSerializer,
        },
    )
    def get(self, request, notification_id):
        try:
            log = (
                scoped_logs(request).select_related("template").get(id=notification_id)
            )
        except NotificationLog.DoesNotExist:
            return Response(
                {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
            )

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


class NotificationListView(APIView):
    """List notifications visible to the caller with optional filters."""

    @extend_schema(
        tags=["Notifications"],
        summary="List notifications",
        description="List notifications visible to the authenticated principal, "
        "with optional filtering by user, channel, and status. Results are ordered "
        "by creation time (newest first).",
        parameters=[
            OpenApiParameter(
                name="user_id",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by user identifier",
                required=False,
            ),
            OpenApiParameter(
                name="channel",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by channel (email, sms, push)",
                required=False,
            ),
            OpenApiParameter(
                name="status",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by status (pending, sending, sent, failed, retrying)",
                required=False,
            ),
            OpenApiParameter(
                name="limit",
                type=int,
                location=OpenApiParameter.QUERY,
                description="Maximum number of results (1-200, default: 50)",
                required=False,
            ),
        ]
        if OpenApiParameter
        else [],
        responses={200: NotificationListResponseSerializer},
    )
    def get(self, request):
        query = NotificationListQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        filters = query.validated_data

        logs = scoped_logs(request).select_related("template")
        if filters.get("user_id"):
            logs = logs.filter(user_id=filters["user_id"])
        if filters.get("channel"):
            logs = logs.filter(channel=filters["channel"])
        if filters.get("status"):
            logs = logs.filter(status=filters["status"])

        total = logs.count()
        page = logs.order_by("-created_at")[: filters["limit"]]

        return Response(
            {
                "count": total,
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
                    for log in page
                ],
            },
            status=status.HTTP_200_OK,
        )


class TemplateListView(APIView):
    """List all notification templates."""

    @extend_schema(
        tags=["Notifications"],
        operation_id="templates_list",
        summary="List templates",
        description="List all notification templates with optional filtering by channel. "
        "Results are ordered by template name.",
        parameters=[
            OpenApiParameter(
                name="channel",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by channel (email, sms, push)",
                required=False,
            ),
        ]
        if OpenApiParameter
        else [],
        responses={200: TemplateListResponseSerializer},
    )
    def get(self, request):
        query = TemplateListQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        channel_filter = query.validated_data.get("channel")

        templates = NotificationTemplate.objects.order_by("name")
        if channel_filter:
            templates = templates.filter(channel=channel_filter)

        total = templates.count()
        page = templates[:200]

        return Response(
            {
                "count": total,
                "results": [
                    {
                        "id": str(template.id),
                        "name": template.name,
                        "channel": template.channel,
                        "subject": template.subject,
                        "body_template": template.body_template,
                        "created_at": template.created_at.isoformat(),
                    }
                    for template in page
                ],
            },
            status=status.HTTP_200_OK,
        )


class TemplateDetailView(APIView):
    """Get template details by UUID."""

    @extend_schema(
        tags=["Templates"],
        operation_id="templates_retrieve",
        summary="Get template details",
        description="Retrieve the full details of a specific notification template by its UUID.",
        responses={
            200: TemplateSerializer,
            404: ErrorResponseSerializer,
        },
    )
    def get(self, request, template_id):
        try:
            template = NotificationTemplate.objects.get(id=template_id)
        except NotificationTemplate.DoesNotExist:
            return Response(
                {"error": "Template not found"}, status=status.HTTP_404_NOT_FOUND
            )
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
