"""
API-key authentication.

Clients authenticate with either header:
    X-API-Key: <key>
    Authorization: Api-Key <key>        (also accepts "Bearer <key>")

Keys are configured via the PULSE_API_KEYS environment variable (comma-separated),
which allows zero-downtime rotation: add the new key, roll clients, remove the old.
"""

import hashlib
import hmac
from dataclasses import dataclass

from django.conf import settings
from rest_framework import authentication, exceptions, permissions


@dataclass(frozen=True)
class APIClient:
    """Principal attached to request.user for API-key authenticated requests."""

    key_fingerprint: str

    @property
    def is_authenticated(self) -> bool:
        return True

    def __str__(self) -> str:
        return f"api-key:{self.key_fingerprint}"


def _fingerprint(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()[:12]


def _extract_key(request) -> str | None:
    key = request.headers.get("X-API-Key")
    if key:
        return key.strip()
    auth_header = request.headers.get("Authorization", "")
    scheme, _, value = auth_header.partition(" ")
    if scheme.lower() in {"api-key", "bearer"} and value.strip():
        return value.strip()
    return None


class APIKeyAuthentication(authentication.BaseAuthentication):
    keyword = "Api-Key"

    def authenticate(self, request):
        provided = _extract_key(request)
        if provided is None:
            return None  # Let the permission class decide (401 or dev-mode access)

        valid_keys = settings.PULSE_API_KEYS
        # Compare against every key in constant time to avoid timing oracles.
        matched = False
        for key in valid_keys:
            if hmac.compare_digest(provided.encode(), key.encode()):
                matched = True
        if not matched:
            raise exceptions.AuthenticationFailed("Invalid API key.")
        return APIClient(key_fingerprint=_fingerprint(provided)), provided

    def authenticate_header(self, request):
        return self.keyword


class HasAPIKeyOrDevMode(permissions.BasePermission):
    """
    Require a valid API key.

    Exception: when no keys are configured AND DEBUG is on, the API is open so
    local development works out of the box. With DEBUG off and no keys
    configured, every request is rejected (fail closed).
    """

    message = "A valid API key is required (send it in the X-API-Key header)."

    def has_permission(self, request, view):
        if request.auth:
            return True
        return bool(settings.DEBUG and not settings.PULSE_API_KEYS)


try:  # Register the scheme with drf-spectacular so Swagger shows "Authorize".
    from drf_spectacular.extensions import OpenApiAuthenticationExtension

    class APIKeyAuthenticationScheme(OpenApiAuthenticationExtension):
        target_class = "notifications.authentication.APIKeyAuthentication"
        name = "ApiKeyAuth"

        def get_security_definition(self, auto_schema):
            return {"type": "apiKey", "in": "header", "name": "X-API-Key"}

except ImportError:  # pragma: no cover - docs disabled / package missing
    pass
