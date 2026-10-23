# Known Limitations

Pulse is deliberately a small, inspectable notification service. These are the
boundaries of the current implementation, not a roadmap promise.

1. **No automatic channel fallback.** The caller chooses one channel per
   request. If push fails, Pulse retries push; it does not switch to SMS or
   email. Routing between channels must happen in the calling system.

2. **No dead-letter queue.** Every send has a bounded retry budget. A transient
   failure is retried with exponential backoff on the same channel; when the
   budget is exhausted the row becomes `failed` and the provider error remains
   on the trace. There is no separate DLQ or replay UI.

3. **`sent` means provider acknowledgement.** A `sent` status means the
   configured provider accepted the call. It is not an opened/read receipt and
   cannot prove that a human received the message. SMTP, Twilio and FCM have
   different acknowledgement semantics.

4. **Push is simulated by default.** `PUSH_BACKEND=console` records a simulated
   success and flags `provider_config.simulated=true`. Live push requires FCM
   credentials and `PUSH_BACKEND=fcm`. There is no APNs, SES or Sinch adapter.

5. **Provider credentials are instance-wide.** SMTP, Twilio and FCM credentials
   are read from the operator environment. There is no per-tenant BYO-provider
   attachment.

6. **API keys are not stored in the database.** They come from
   `PULSE_API_KEYS` and are compared in constant time. Rotation requires
   restarting the API processes; the API key fingerprint is recorded on each
   row so keys cannot read each other's deliveries. Non-staff JWT users see
   their own deliveries; staff see all deliveries.

7. **No billing or metering.** The pricing page is explicitly illustrative and
   no checkout, invoice, quota or hard spend cap is connected to this
   deployment.

8. **Metrics are derived from retained rows.** `/api/metrics` queries the
   selected time window and previous window. `cleanup_old_logs` deletes sent and
   failed rows older than `LOG_RETENTION_DAYS` (30 by default), so historical
   metrics and the Prometheus exporter's database gauges disappear with those
   rows.

9. **The Prometheus exporter polls.** It reads PostgreSQL and Redis every
   `METRICS_INTERVAL` seconds (15 by default). Snapshot counters are
   process-local and reset when the exporter restarts; the latency histogram is
   observed once per sent row per exporter process. It is not an event-driven
   metrics pipeline.

10. **No SSO/SCIM, SLA or support guarantee.** Authentication is local Django
    users plus API keys. There is no single sign-on, directory sync, contractual
    uptime target or support response SLA in this repository.

11. **The Next.js frontend is a same-origin proxy.** Browser tokens live in
    httpOnly cookies set by Next.js. Calls made directly to Django on port 8000
    must send an API key or a JWT Bearer token explicitly; Django does not
    accept the frontend's access cookie.

12. **One known dev-only npm advisory remains.** `npm audit` reports high
    severity findings through `eslint-config-next -> @next/eslint-plugin-next ->
fast-glob -> micromatch -> braces`. It is a lint-time denial-of-service
    pattern issue, is not present in the production dependency tree, and npm
    offers no non-breaking fix. `npm audit --omit=dev` reports zero
    vulnerabilities.

13. **Delivery is at-least-once in a crash window.** The atomic claim prevents
    concurrent duplicate sends, and idempotency prevents duplicate API
    acceptance. If a worker dies after the provider accepts a message but before
    the row is marked `sent`, the stale `sending` row can be reclaimed and the
    provider may receive a duplicate. There is no provider-level deduplication
    or distributed transaction covering that gap.
