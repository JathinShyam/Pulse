"""
API-key authentication.

Clients authenticate with either header:
    X-API-Key: <key>
    Authorization: Api-Key <key>

``Authorization: Bearer`` is reserved for JWT access tokens. A JWT is never
interpreted as an API key (and vice versa), so the two schemes cannot collide.

Keys are configured via the PULSE_API_KEYS environment variable (comma-separated).
To rotate, add the new key, roll clients, then remove the old key and roll the
API processes so they reload the environment.

There is no anonymous or DEBUG bypass. Requests without a valid JWT or API key
are rejected by DRF's IsAuthenticated permission.
"""

import hashlib
import hmac
from dataclasses import dataclass

from django.conf import settings
from rest_framework import authentication, exceptions, throttling


@dataclass(frozen=True)
class APIClient:
    """Principal attached to request.user for API-key authenticated requests."""

    key_fingerprint: str

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def pk(self) -> str:
        return f"api-key:{self.key_fingerprint}"

    def __str__(self) -> str:
        return f"api-key:{self.key_fingerprint}"


def fingerprint_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()[:12]


def _extract_key(request) -> str | None:
    key = request.headers.get("X-API-Key")
    if key:
        return key.strip()
    auth_header = request.headers.get("Authorization", "")
    scheme, _, value = auth_header.partition(" ")
    if scheme.lower() == "api-key" and value.strip():
        return value.strip()
    return None


class APIKeyAuthentication(authentication.BaseAuthentication):
    keyword = "Api-Key"

    def authenticate(self, request):
        provided = _extract_key(request)
        if provided is None:
            return None  # Let JWT auth (or the permission class) handle it.

        valid_keys = settings.PULSE_API_KEYS
        # Compare against every key in constant time to avoid timing oracles.
        matched = False
        for key in valid_keys:
            if hmac.compare_digest(provided.encode(), key.encode()):
                matched = True
        if not matched:
            raise exceptions.AuthenticationFailed("Invalid API key.")
        return APIClient(key_fingerprint=fingerprint_key(provided)), provided

    def authenticate_header(self, request):
        return self.keyword


class ClientRateThrottle(throttling.SimpleRateThrottle):
    """Optional API-wide throttle keyed by the authenticated principal."""

    scope = "client"

    def get_cache_key(self, request, view):
        user = request.user
        if user is None:
            return None
        if isinstance(user, APIClient):
            ident = user.pk
        elif getattr(user, "is_authenticated", False):
            ident = f"user:{user.pk}"
        else:  # pragma: no cover - IsAuthenticated rejects this first
            return None
        return self.cache_format % {"scope": self.scope, "ident": ident}


try:  # Register the scheme with drf-spectacular so Swagger shows "Authorize".
    from drf_spectacular.extensions import OpenApiAuthenticationExtension

    class APIKeyAuthenticationScheme(OpenApiAuthenticationExtension):
        target_class = "notifications.authentication.APIKeyAuthentication"
        name = "ApiKeyAuth"

        def get_security_definition(self, auto_schema):
            return {"type": "apiKey", "in": "header", "name": "X-API-Key"}

except ImportError:  # pragma: no cover - docs disabled / package missing
    pass
