from rest_framework import serializers

from .models import Notification, NotificationChannel


class NotificationRequestSerializer(serializers.ModelSerializer):
    idempotency_key = serializers.CharField(max_length=64, required=False, allow_blank=True)

    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'channel', 'payload', 'priority', 'scheduled_for', 'idempotency_key']
        read_only_fields = ['id']

    def validate_channel(self, value: str) -> str:
        if value not in NotificationChannel.values:
            raise serializers.ValidationError('Unsupported channel')
        return value

    def create(self, validated_data):
        validated_data.pop('idempotency_key', None)
        return Notification.objects.create(**validated_data)


class NotificationResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'channel', 'status', 'priority', 'scheduled_for', 'created_at']
