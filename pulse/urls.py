"""
URL configuration for pulse project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenRefreshView

from notifications.metrics_view import MetricsView
from pulse.auth_views import (
    EmailOrUsernameTokenObtainPairView,
    MeView,
    RegisterView,
)

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/notifications/", include("notifications.urls")),
    path("api/metrics", MetricsView.as_view(), name="metrics"),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path(
        "api/auth/login/",
        EmailOrUsernameTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", MeView.as_view(), name="auth-me"),
]

# Conditionally add API documentation URLs. Documentation is public; the data
# endpoints it describes are not.
if settings.ENABLE_DOCS:
    from drf_spectacular.views import (
        SpectacularAPIView,
        SpectacularRedocView,
        SpectacularSwaggerView,
    )

    class PublicSchemaView(SpectacularAPIView):
        permission_classes = [AllowAny]

    class PublicSwaggerView(SpectacularSwaggerView):
        permission_classes = [AllowAny]

    class PublicRedocView(SpectacularRedocView):
        permission_classes = [AllowAny]

    urlpatterns += [
        # OpenAPI schema (JSON/YAML)
        path("api/schema/", PublicSchemaView.as_view(), name="schema"),
        # Swagger UI
        path(
            "api/docs/",
            PublicSwaggerView.as_view(url_name="schema"),
            name="swagger-ui",
        ),
        # ReDoc UI (alternative documentation viewer)
        path(
            "api/redoc/",
            PublicRedocView.as_view(url_name="schema"),
            name="redoc",
        ),
    ]
