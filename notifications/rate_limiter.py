import logging
import time
from typing import Optional

import redis
from django.conf import settings

logger = logging.getLogger(__name__)

_redis_client: Optional[redis.Redis] = None


def get_redis_client() -> redis.Redis:
    """
    Lazily instantiate a Redis client.

    Uses REDIS_URL (defaults to the Celery broker URL) so the rate limiter
    works out-of-the-box in local/docker environments. Short timeouts keep a
    Redis outage from stalling API requests.
    """
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(
            settings.REDIS_URL, socket_connect_timeout=1, socket_timeout=1
        )
    return _redis_client


class RateLimiter:
    """
    Fixed-window rate limiter backed by Redis.

    The key should identify the caller and channel, e.g. "user_123:email".
    Each window gets its own Redis key (``rate_limit:<key>:<window#>``) which
    is incremented atomically with INCR, so concurrent requests can never
    reset each other's counters.

    If Redis is unreachable the limiter fails OPEN (allows the request) and
    logs a warning: delivery availability is preferred over strict limiting.
    """

    def __init__(
        self,
        max_requests: int = 10,
        window: int = 60,
        client: Optional[redis.Redis] = None,
    ) -> None:
        self.max_requests = max_requests
        self.window = window
        self._client = client

    @property
    def client(self) -> redis.Redis:
        return self._client or get_redis_client()

    def retry_after(self) -> int:
        """Seconds until the current window ends."""
        return self.window - (int(time.time()) % self.window)

    def is_allowed(self, key: str) -> bool:
        """
        Returns True if the call is allowed, False if the caller
        is over the limit for the current window.
        """
        current_window = int(time.time()) // self.window
        redis_key = f"rate_limit:{key}:{current_window}"
        try:
            pipe = self.client.pipeline()
            pipe.incr(redis_key)
            pipe.expire(redis_key, self.window * 2)
            current_count, _ = pipe.execute()
        except redis.RedisError:
            logger.warning(
                "Rate limiter unavailable (Redis error); allowing request",
                exc_info=True,
            )
            return True
        return int(current_count) <= self.max_requests
