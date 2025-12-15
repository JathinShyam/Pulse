from rest_framework import serializers

from .models import NotificationLog, NotificationTemplate


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
        help_text="Destination address (email, phone number, or device token)",
    )
    context = serializers.DictField(
        child=serializers.CharField(allow_blank=True),
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
        choices=[("email", "Email"), ("sms", "SMS"), ("push", "Push")],
        required=False,
        help_text="Override channel (defaults to template's channel)",
    )
    device_token = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Device token for push notifications",
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

        idem_key = attrs.get("idempotency_key") or None
        if idem_key:
            existing = NotificationLog.objects.filter(idempotency_key=idem_key).first()
            if existing:
                attrs["existing_log"] = existing

        try:
            rendered_body = template.body_template.format(**attrs.get("context", {}))
        except KeyError as exc:
            raise serializers.ValidationError(
                {"context": f"missing template variable: {exc}"}
            ) from exc

        attrs["template"] = template
        attrs["rendered_body"] = rendered_body
        return attrs


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
