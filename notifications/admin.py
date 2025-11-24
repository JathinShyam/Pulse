from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'channel', 'recipient', 'status', 'priority', 'created_at')
    list_filter = ('channel', 'status')
    search_fields = ('id', 'recipient')
    ordering = ('-created_at',)
