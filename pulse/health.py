"""
Liveness / readiness endpoints.

Implemented as the first middleware so that they:
  * bypass ALLOWED_HOSTS validation (k8s probes and many load balancers send the
    pod/instance IP as the Host header),
  * bypass SECURE_SSL_REDIRECT (probes speak plain HTTP inside the cluster),
  * never touch sessions, auth or the URL resolver.

GET /healthz/  -> 200 if the process is up (no dependency checks).
GET /readyz/   -> 200 if PostgreSQL and Redis are reachable, else 503.
"""

import logging

from django.conf import settings
from django.db import connections
from django.http import JsonResponse

logger = logging.getLogger(__name__)

LIVENESS_PATH = "/health/"
READINESS_PATH = "/readyz/"


def _check_database() -> bool:
    try:
        with connections["default"].cursor() as cursor:
            cursor.execute("SELECT 1")
        return True
    except Exception:  # pragma: no cover - depends on infrastructure
        logger.exception("Readiness check: database unavailable")
        return False


def _check_redis() -> bool:
    try:
        import redis

        client = redis.from_url(
            settings.REDIS_URL, socket_connect_timeout=2, socket_timeout=2
        )
        return bool(client.ping())
    except Exception:  # pragma: no cover - depends on infrastructure
        logger.exception("Readiness check: redis unavailable")
        return False


class HealthCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method in ("GET", "HEAD"):
            if request.path == LIVENESS_PATH:
                return JsonResponse({"status": "ok"})
            if request.path == READINESS_PATH:
                checks = {
                    "database": "ok" if _check_database() else "error",
                    "redis": "ok" if _check_redis() else "error",
                }
                healthy = all(v == "ok" for v in checks.values())
                return JsonResponse(
                    {"status": "ok" if healthy else "error", "checks": checks},
                    status=200 if healthy else 503,
                )
        return self.get_response(request)
