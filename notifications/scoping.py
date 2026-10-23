"""Tenant/principal scoping helpers for notification reads.

Every row records which principal created it. API keys only see their own
rows; non-staff JWT users see rows they created; staff operators see the whole
installation (this is the operations console).
"""

from .authentication import APIClient
from .models import NotificationLog


def principal_scope(request) -> str:
    user = request.user
    if isinstance(user, APIClient):
        return f"api-key:{user.key_fingerprint}"
    if user is not None and getattr(user, "is_authenticated", False):
        return f"user:{user.pk}"
    return ""


def scoped_logs(request, queryset=None):
    queryset = queryset if queryset is not None else NotificationLog.objects.all()
    user = request.user
    if isinstance(user, APIClient):
        return queryset.filter(created_by=f"api-key:{user.key_fingerprint}")
    if user is not None and getattr(user, "is_authenticated", False):
        if user.is_staff:
            return queryset
        return queryset.filter(created_by=f"user:{user.pk}")
    return queryset.none()
