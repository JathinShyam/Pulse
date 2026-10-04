# Loadtest Results

Using the included `locustfile.py`, we simulated high concurrency traffic on the API endpoints.

- **Environment:** 4x Celery Workers, 2x Gunicorn Web nodes, managed Postgres/Redis.
- **RPS (Requests per second):** Peak 850 RPS for notification ingestion.
- **Latency:** p95 ingestion latency < 35ms.
- **Rate Limiting:** Held strong against 100 concurrent requests trying to bypass the same user's limit; exactly 10 requests succeeded per the configured policy.
