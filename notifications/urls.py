from django.urls import path

from .views import (
    NotificationListView,
    NotificationStatusView,
    SendNotificationView,
    TemplateDetailView,
    TemplateListView,
)

urlpatterns = [
    path("send/", SendNotificationView.as_view(), name="send-notification"),
    path(
        "status/<uuid:notification_id>/",
        NotificationStatusView.as_view(),
        name="notification-status",
    ),
    path("list/", NotificationListView.as_view(), name="notification-list"),
    path("templates/", TemplateListView.as_view(), name="template-list"),
    path(
        "templates/<uuid:template_id>/",
        TemplateDetailView.as_view(),
        name="template-detail",
    ),
]
