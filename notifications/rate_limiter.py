import time
from typing import Optional

import redis
from django.conf import settings


_redis_client: Optional[redis.Redis] = None


def get_redis_client() -> redis.Redis:
    """
    Lazily instantiate a Redis client.

    We intentionally re-use the Celery broker URL so the rate limiter
    works out-of-the-box in local/docker environments.
    """
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(getattr(settings, "CELERY_BROKER_URL"))
    return _redis_client


class RateLimiter:
    """
    Simple fixed-window rate limiter backed by Redis.

    The key should identify the caller and channel, e.g. "user_123:email".
    """

    def __init__(self, max_requests: int = 10, window: int = 60) -> None:
        self.max_requests = max_requests
        self.window = window

    def is_allowed(self, key: str) -> bool:
        """
        Returns True if the call is allowed, False if the caller
        is over the limit for the current window.
        """
        client = get_redis_client()
        window_key = f"rate_limit:{key}:window"
        count_key = f"rate_limit:{key}:count"

        now = int(time.time())
        current_window = now // self.window

        # Ensure the window marker is set and has an expiry
        existing_window = client.get(window_key)
        if existing_window is None or int(existing_window) != current_window:
            # New window: reset counter and window marker
            pipe = client.pipeline()
            pipe.set(window_key, current_window, ex=self.window)
            pipe.set(count_key, 1, ex=self.window)
            pipe.execute()
            return True

        # Same window: increment count atomically
        current_count = client.incr(count_key)
        # Make sure count key has an expiration aligned with window
        if current_count == 1:
            client.expire(count_key, self.window)

        if current_count > self.max_requests:
            return False
        return True


