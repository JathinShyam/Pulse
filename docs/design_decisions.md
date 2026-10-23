# Design Decisions

1. **Idempotency is a database invariant.** `NotificationLog.idempotency_key`
   is unique, and creation uses `get_or_create` so concurrent creators collapse
   onto one row. The API only enqueues when creation returned `created=True`.
   Of the request's subject, body, context, priority, recipient, channel,
   template, user and device token, a SHA-256 fingerprint is stored on the row.
   Reusing a key with a different request, principal, template, recipient or
   channel returns `409 Conflict` instead of silently changing the original
   request. There is no `select_for_update` path and no in-process lock.

2. **Delivery claims are atomic.** Before a provider call a worker executes an
   `UPDATE ... WHERE status IN ('pending','retrying') AND attempts < max_retries`
   with a retry-due and stale-`sending` predicate. Only one worker can win. A
   crashed worker's `sending` row can be reclaimed after
   `NOTIFICATION_CLAIM_TIMEOUT_SECONDS`. `sent` and `failed` are terminal, so
   concurrent duplicate executions cannot both call the provider and a finished
   row cannot be overwritten. Delivery remains at-least-once: if a worker dies
   after the provider accepts the message but before recording `sent`, the
   stale `sending` row can be reclaimed and the provider may receive a duplicate.

3. **Retries stay on the same channel.** Transient provider errors are retried
   with exponential backoff plus jitter until the row's budget is exhausted;
   permanent errors fail immediately. There is no dead-letter queue or automatic
   channel failover. This keeps the trace and the caller's channel choice
   unambiguous.

4. **Rate limiting is separate from API authentication.** Redis `INCR` with a
   per-window key enforces the per-caller/target-user/channel send limit. Redis
   failures fail open and log a warning because delivery availability is
   preferred over strict limiting. Authentication is fail-closed independently:
   no credential means `401`, no matter what Redis is doing.

5. **Reads are scoped by creation principal.** Each row stores
   `created_by = api-key:<fingerprint>` or `user:<id>`. API keys see only their
   own rows, non-staff JWT users see their own, and staff see the installation.
   Out-of-scope status reads return `404`.

6. **Metrics are windowed and derived, not decorative.** `/api/metrics` computes
   totals, previous-period trend, status counts, per-channel success, latency
   percentiles and a zero-filled series from the retained rows in the requested
   window. The UI uses those values and labels error fallbacks **Sample**.

7. **The browser never handles JWTs.** Next.js route handlers set httpOnly
   cookies and proxy API requests. Access tokens are refreshed server-side once
   on `401`; tokens are removed from every API response before it reaches client
   JavaScript. Public marketing pages remain server-rendered where possible.

8. **Truthful marketing and pricing.** The product pages describe only the
   implemented channels and routing. The pricing page is labelled illustrative
   because no billing integration, metering, quota or hard cap exists. The
   estimator uses the monthly base price under annual billing (`$399`) plus
   overage rather than applying a percentage discount to overage.

9. **Split requirements and non-root containers.** Runtime, development and
   production-only dependencies are separate. Both images run as non-root users,
   expose health endpoints, and bake in the build artifacts they need
   (`collectstatic` for Django, standalone output for Next.js).
