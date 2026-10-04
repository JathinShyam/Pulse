import re

from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import EmailValidator
from rest_framework import serializers

from .models import NotificationLog, NotificationTemplate

SUPPORTED_CHANNELS = ("email", "sms", "push")
E164_RE = re.compile(r"^\+[1-9]\d{6,14}$")
_email_validator = EmailValidator()


def render_template(text: str, context: dict, field: str) -> str:
    """Render a str.format template, turning author/caller mistakes into 400s."""
    try:
        return text.format(**context)
    except KeyError as exc:
        raise serializers.ValidationError(
            {"context": f"missing template variable: {exc}"}
        ) from exc
    except (IndexError, ValueError, AttributeError) as exc:
        raise serializers.ValidationError(
            {"template_name": f"template {field} is malformed: {exc}"}
        ) from exc


def resolve_queue(template_name: str, priority: str | None) -> str:
    """Explicit priority wins; otherwise OTP-like template names are high priority."""
    if priority == "high":
        return "high_priority"
    if priority == "low":
        return "low_priority"
    name = (template_name or "").lower()
    if any(keyword in name for keyword in settings.HIGH_PRIORITY_TEMPLATE_KEYWORDS):
        return "high_priority"
    return "low_priority"


# ============================================================================
# Request Serializers
# ============================================================================


class SendNotificationSerializer(serializers.Serializer):
    """Request serializer for sending notifications."""

    template_name = serializers.CharField(
        max_length=100, help_text="Name of the notification template to use"
    )
    user_id = serializers.CharField(
        max_length=100, help_text="Unique identifier of the target user"
    )
    to = serializers.CharField(
        max_length=255,
        help_text="Destination address: email address, E.164 phone number "
        "(e.g. +14155550123), or device token",
    )
    context = serializers.DictField(
        child=serializers.CharField(allow_blank=True, max_length=5000),
        default=dict,
        help_text="Key-value pairs for template variable substitution",
    )
    idempotency_key = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Unique key to prevent duplicate sends",
    )
    channel = serializers.ChoiceField(
        choices=[
            (c, c.upper() if c == "sms" else c.title()) for c in SUPPORTED_CHANNELS
        ],
        required=False,
        help_text="Override channel (defaults to template's channel)",
    )
    priority = serializers.ChoiceField(
        choices=[("high", "High"), ("low", "Low")],
        required=False,
        help_text="Queue priority override. Defaults to 'high' for OTP/verification "
        "templates and 'low' otherwise.",
    )
    device_token = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Device token for push notifications (defaults to `to`)",
    )
    title = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True,
        help_text="Push notification title override",
    )

    def validate_template_name(self, value: str) -> str:
        try:
            self._template = NotificationTemplate.objects.get(name=value)
        except NotificationTemplate.DoesNotExist as exc:
            raise serializers.ValidationError("Template not found") from exc
        return value

    def validate(self, attrs):
        attrs = super().validate(attrs)
        template = getattr(self, "_template", None)
        if template is None:
            raise serializers.ValidationError(
                {"template_name": "Template lookup failed"}
            )

        channel = attrs.get("channel") or template.channel
        if channel not in SUPPORTED_CHANNELS:
            raise serializers.ValidationError(
                {
                    "channel": f"Channel '{channel}' is not supported yet. "
                    f"Supported: {', '.join(SUPPORTED_CHANNELS)}."
                }
            )
        self._validate_recipient(channel, attrs)

        idem_key = attrs.get("idempotency_key") or None
        if idem_key:
            existing = NotificationLog.objects.filter(idempotency_key=idem_key).first()
            if existing:
                if (existing.user_id, existing.to, existing.template_id) != (
                    attrs["user_id"],
                    attrs["to"],
                    template.id,
                ):
                    raise serializers.ValidationError(
                        {
                            "idempotency_key": "This key was already used for a different request."
                        },
                        code="idempotency_conflict",
                    )
                attrs["existing_log"] = existing

        context = attrs.get("context", {})
        attrs["rendered_body"] = render_template(
            template.body_template, context, "body"
        )
        attrs["rendered_subject"] = render_template(
            template.subject or "", context, "subject"
        )
        attrs["template"] = template
        attrs["channel"] = channel
        attrs["queue"] = resolve_queue(template.name, attrs.get("priority"))
        return attrs

    @staticmethod
    def _validate_recipient(channel: str, attrs: dict) -> None:
        to = attrs["to"].strip()
        attrs["to"] = to
        if channel == "email":
            try:
                _email_validator(to)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(
                    {"to": "Enter a valid email address."}
                ) from exc
        elif channel == "sms":
            if not E164_RE.match(to):
                raise serializers.ValidationError(
                    {"to": "Enter a phone number in E.164 format, e.g. +14155550123."}
                )
        elif channel == "push":
            attrs["device_token"] = (attrs.get("device_token") or "").strip() or to


# ============================================================================
# Response Serializers (for OpenAPI schema generation)
# ============================================================================


class NotificationQueuedResponseSerializer(serializers.Serializer):
    """Response when a notification is successfully queued."""

    notification_id = serializers.UUIDField(
        help_text="Unique identifier of the notification"
    )
    status = serializers.CharField(help_text="Current status (queued)")


class NotificationIdempotentResponseSerializer(serializers.Serializer):
    """Response for idempotent duplicate requests."""

    notification_id = serializers.UUIDField(
        help_text="Unique identifier of the existing notification"
    )
    status = serializers.CharField(
        help_text="Current status of the existing notification"
    )


class ErrorResponseSerializer(serializers.Serializer):
    """Generic error response."""

    error = serializers.CharField(help_text="Error message")


class NotificationStatusResponseSerializer(serializers.Serializer):
    """Full notification status response."""

    notification_id = serializers.UUIDField(help_text="Unique identifier")
    user_id = serializers.CharField(help_text="Target user identifier")
    template_name = serializers.CharField(help_text="Template used")
    channel = serializers.CharField(help_text="Delivery channel")
    to = serializers.CharField(help_text="Destination address")
    status = serializers.ChoiceField(
        choices=["pending", "sent", "failed", "retrying"],
        help_text="Current status",
    )
    attempts = serializers.IntegerField(help_text="Number of delivery attempts")
    max_retries = serializers.IntegerField(help_text="Maximum retry attempts")
    created_at = serializers.DateTimeField(help_text="Creation timestamp")
    sent_at = serializers.DateTimeField(
        allow_null=True, help_text="Delivery timestamp (null if not sent)"
    )
    last_attempt_at = serializers.DateTimeField(
        allow_null=True, help_text="Last attempt timestamp"
    )
    next_retry_at = serializers.DateTimeField(
        allow_null=True, help_text="Next retry timestamp (null if not retrying)"
    )
    error_message = serializers.CharField(
        allow_null=True, help_text="Error details if failed"
    )
    provider_config = serializers.DictField(
        help_text="Provider-specific metadata (e.g., Twilio SID)"
    )
    idempotency_key = serializers.CharField(
        allow_null=True, help_text="Idempotency key if provided"
    )


class NotificationSummarySerializer(serializers.Serializer):
    """Summary of a notification for list views."""

    notification_id = serializers.UUIDField(help_text="Unique identifier")
    user_id = serializers.CharField(help_text="Target user identifier")
    template_name = serializers.CharField(help_text="Template used")
    channel = serializers.CharField(help_text="Delivery channel")
    to = serializers.CharField(help_text="Destination address")
    status = serializers.CharField(help_text="Current status")
    attempts = serializers.IntegerField(help_text="Number of delivery attempts")
    created_at = serializers.DateTimeField(help_text="Creation timestamp")
    sent_at = serializers.DateTimeField(allow_null=True, help_text="Delivery timestamp")


class NotificationListResponseSerializer(serializers.Serializer):
    """Response for notification list endpoint."""

    count = serializers.IntegerField(help_text="Number of notifications returned")
    results = NotificationSummarySerializer(
        many=True, help_text="List of notifications"
    )


class TemplateSerializer(serializers.Serializer):
    """Notification template details."""

    id = serializers.UUIDField(help_text="Unique template identifier")
    name = serializers.CharField(help_text="Unique template name")
    channel = serializers.CharField(help_text="Default delivery channel")
    subject = serializers.CharField(help_text="Email subject or push title")
    body_template = serializers.CharField(
        help_text="Template body with {variable} placeholders"
    )
    created_at = serializers.DateTimeField(help_text="Creation timestamp")


class TemplateListResponseSerializer(serializers.Serializer):
    """Response for template list endpoint."""

    count = serializers.IntegerField(help_text="Number of templates returned")
    results = TemplateSerializer(many=True, help_text="List of templates")
