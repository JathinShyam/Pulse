# Design Decisions

1. **Strict Idempotency:** The system uses database-level row locking (`select_for_update`) to prevent duplicate dispatches if multiple identical requests arrive at the exact same millisecond.
2. **Atomic Rate Limiting:** We use Redis `INCR` combined with `EXPIRE` to guarantee atomic rate limit counters, preventing race conditions under high concurrent load.
3. **Graceful Error Handling:** Celery workers categorize errors into _Permanent_ (invalid phone number, wrong credentials) and _Transient_ (network timeout). Permanent errors fail immediately without clogging the background queues, while transient errors use exponential backoff.
4. **Separated Requirements:** Requirements are cleanly split into `base`, `development`, and `production` to keep the production container slim and secure.
