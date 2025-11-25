from django.contrib import admin

from .models import NotificationLog, NotificationTemplate


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'channel', 'created_at')
    list_filter = ('channel',)
    search_fields = ('name',)
    ordering = ('-created_at',)


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'channel', 'to', 'status', 'attempts', 'created_at', 'sent_at')
    list_filter = ('channel', 'status')
    search_fields = ('id', 'to', 'idempotency_key')
    ordering = ('-created_at',)
