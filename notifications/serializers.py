from rest_framework import serializers

from .models import NotificationLog, NotificationTemplate


class SendNotificationSerializer(serializers.Serializer):
    template_name = serializers.CharField(max_length=100)
    user_id = serializers.CharField(max_length=100)
    to = serializers.CharField(max_length=255)
    context = serializers.DictField(child=serializers.CharField(allow_blank=True), default=dict)
    idempotency_key = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_template_name(self, value: str) -> str:
        try:
            self._template = NotificationTemplate.objects.get(name=value)
        except NotificationTemplate.DoesNotExist as exc:
            raise serializers.ValidationError('Template not found') from exc
        return value

    def validate(self, attrs):
        attrs = super().validate(attrs)
        template = getattr(self, '_template', None)
        if template is None:
            raise serializers.ValidationError({'template_name': 'Template lookup failed'})

        idem_key = attrs.get('idempotency_key') or None
        if idem_key:
            existing = NotificationLog.objects.filter(idempotency_key=idem_key).first()
            if existing:
                attrs['existing_log'] = existing

        try:
            rendered_body = template.body_template.format(**attrs.get('context', {}))
        except KeyError as exc:
            raise serializers.ValidationError({'context': f'missing template variable: {exc}'}) from exc

        attrs['template'] = template
        attrs['rendered_body'] = rendered_body
        return attrs
