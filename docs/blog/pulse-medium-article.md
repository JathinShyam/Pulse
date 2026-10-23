# Everyone Can Send an Email. Almost No One Can Tell You What Happened Next.

### Building Pulse, a self-hosted notification service that treats delivery as an inspectable state machine.

![Pulse landing page](../images/web-landing-hero.png)

_Every notification system starts as a one-line feature. Then production asks it a harder question._

Every product eventually needs notifications. The first version is simple: call an email API. The second version adds a queue. The third version arrives as a support ticket that says, “The customer never got the OTP.”

That is when you discover the real problem was never sending the message. It was knowing what happened to it.

Did the request reach the server? Was it accepted once, or twice? Which worker picked it up? Did the provider acknowledge it, or did it time out? Can one customer see another customer’s delivery log? If the queue is backed up, can an OTP still jump ahead of a weekly digest? And when the dashboard says everything is healthy, is that a measurement or a decoration?

Pulse is my answer to those questions: a self-hosted notification service for email, SMS, and push, built around an inspectable delivery record rather than a black-box API call.

It is not trying to replace Twilio, SendGrid, or Firebase. It is the layer above them that decides what was promised, records what was attempted, and tells the truth about what happened next.

Managed providers are excellent at the last mile. They are not trying to be the system that remembers which of your tenants asked for what, why a send was retried, or which operator is allowed to see the trace. Pulse owns that layer.

## What Pulse actually is

Pulse exposes one HTTP API for notification requests. A caller chooses a template, a recipient, and a channel. Pulse validates the payload, renders the template, persists a notification row, routes the work to a priority queue, and lets a Celery worker call the provider.

The supported channels are deliberately narrow:

- **Email** through SMTP, with Mailpit for local development.
- **SMS** through Twilio.
- **Push** through Firebase Cloud Messaging, with a console backend for local simulation.

Around that core sits a Next.js operator console: a dispatcher, a delivery log, a routing view, and windowed metrics. Every screen is backed by the same API a machine client would use.

The stack is intentionally boring: Django and Django REST Framework, PostgreSQL, Redis, Celery, and a Next.js/React frontend. Boring is good for infrastructure. It means the hard parts are visible instead of hidden behind a framework.

## The shape of the system

![Pulse system architecture](../diagrams/system-architecture.png)

_System architecture: one public entry point, two priority queues, three provider adapters._

Two kinds of clients enter the system.

A browser talks to Next.js. The Next.js server renders the console and proxies `/api/*` requests to Django. A machine client talks to Django directly with an API key. Both paths converge on the same authenticated API.

From there, the request path is:

1. Authenticate the caller with a JWT or API key.
2. Validate the template, channel, recipient, and context.
3. Render the subject and body with Python `str.format`.
4. Choose `high_priority` or `low_priority`.
5. Persist the notification and its idempotency data.
6. Publish a Celery task to Redis.
7. Let a worker claim the row and call the provider.
8. Record the provider response, retry decision, and terminal status.

PostgreSQL is the system of record. Redis is transport, cache, and rate-limit state. The queue can lose a message; the database still knows the notification exists. That distinction shaped almost every reliability decision in the project.

## 202 means “accepted”, not “delivered”

![Notification request and delivery flow](../diagrams/request-delivery-flow.png)

_The request lifecycle: synchronous acceptance on top, asynchronous delivery below._

The most important sentence in the API documentation is this one:

> `202 Accepted` means the row was persisted and queued. It does not mean delivered.

That is not a disclaimer bolted onto the docs. It is the contract the whole system is built to honor.

A notification moves through five states:

`pending` → `sending` → `sent` or `failed`, with `retrying` as the loop back to `sending`.

A request looks like this:

```http
POST /api/notifications/send/
X-API-Key: <key>
```

```json
{
  "user_id": "user_123",
  "template_name": "otp_login",
  "to": "+14155550123",
  "context": { "code": "123456" },
  "idempotency_key": "otp-user_123-1",
  "priority": "high"
}
```

The response contains a notification ID and the string `queued`:

```json
{
  "notification_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued"
}
```

The synchronous path is short. Django validates the request, writes one row, and publishes one task. Priority is explicit when the caller sets it; otherwise OTP-like template names can route to the high-priority queue. The caller can then poll `/api/notifications/status/{id}/` or list recent deliveries.

The asynchronous path is where the interesting failures live. A worker does not simply pick up a row and call the provider. It first **claims** the row with a conditional update:

```python
updated = (
    NotificationLog.objects
    .filter(id=self.id)
    .filter(claimable | abandoned)
    .filter(attempts__lt=F("max_retries"))
    .update(
        status="sending",
        attempts=F("attempts") + 1,
        last_attempt_at=now,
        next_retry_at=None,
    )
)
```

Only one worker can win that update. A row left in `sending` by a crashed worker becomes claimable again after a timeout. Terminal states (`sent` and `failed`) are never overwritten by a late Celery delivery.

This is the difference between a queue and a delivery system. A queue moves messages. A delivery system has to decide who owns a message, what happens when the owner disappears, and how to keep a stale duplicate from undoing a completed send.

## Idempotency belongs in the database

Retries at the HTTP layer are normal. A client times out, retries the request, and expects the same result. Without idempotency, “same result” means “two emails.”

Pulse treats idempotency as a database invariant, not a middleware trick. `NotificationLog.idempotency_key` is unique, and creation goes through `get_or_create`:

```python
log, created = NotificationLog.get_or_create_idempotent(
    user_id=data["user_id"],
    template=template,
    channel=channel,
    to=data["to"],
    idempotency_key=idem_key,
    created_by=scope,
    request_fingerprint=data["request_fingerprint"],
)

if not created:
    # Same request: return the existing row with 200.
    # Different request: return 409 Conflict.
    ...
```

The unique constraint is the concurrency control. Two requests with the same key cannot both create a row, even if they arrive at the same millisecond. Only the request that actually created the row is allowed to enqueue the task.

There is a second guard: a SHA-256 fingerprint of the canonical request. It covers the template, user, recipient, channel, subject, body, title, priority, device token, and context. Reusing a key with a different payload returns `409 Conflict` instead of silently changing the original request. Reusing it with the same payload returns `200 OK` and the existing notification ID.

This is a small feature with a large operational payoff. The caller gets exactly-once **acceptance**. Delivery remains at-least-once, but the API no longer creates duplicate work when a client retries.

## The crash window I refuse to hide

There is a gap in every system like this, and it is better to name it than pretend it does not exist.

If a worker dies after the provider accepts the message but before Pulse records `sent`, the stale row can be reclaimed. The provider may receive the same message twice. The atomic claim prevents concurrent duplicate sends during normal operation, but it cannot make a provider call and a database write transactional across two systems.

So Pulse documents the boundary:

> Delivery is at-least-once in a narrow crash window. Idempotency does not cover that gap.

That honesty matters more than a marketing claim of exactly-once delivery. Exactly-once across SMTP, Twilio, and FCM is not a property a small service can guarantee without provider-level deduplication and a distributed transaction. What Pulse can guarantee is that concurrent workers will not both send, terminal states will not be overwritten, and the attempt history will show what happened.

## Retries should be boring

![Pulse delivery log](../images/web-deliveries.png)

_The delivery log keeps the provider error, attempt count, latency, and trace for every row._

Pulse retries transient failures on the **same channel** with exponential backoff and jitter. The default base delay is 60 seconds, the delay doubles per attempt with a ±10% jitter, and the default budget is five attempts. After the budget is exhausted, the row becomes `failed` and keeps the provider error.

Permanent failures skip the retry loop. A missing device token, an unconfigured SMS provider, or a Twilio 4xx response (except `429`) will not become true if you wait longer. Those fail immediately.

There is no automatic channel fallback. If push fails, Pulse does not try SMS. If SMS fails, it does not try email.

That is a deliberate product decision, not a missing feature. The caller chose the channel. Automatic failover can produce duplicate messages across channels, make the delivery trace ambiguous, and disguise the real problem. If a product wants “push, then SMS after five minutes,” that policy belongs in the calling system where the business rules live.

There is also no dead-letter queue. A failed row is the dead letter: it retains the provider response, attempt count, and timestamps, and it is visible in the console. A separate DLQ would add another state to operate without adding information the row does not already have.

## Security at the boundary

![Authentication and session flow](../diagrams/auth-session-flow.png)

_Browser sessions never expose JWTs to client JavaScript. The Next.js proxy keeps the tokens server-side._

The browser console uses a same-origin proxy rather than putting a JWT in `localStorage`. Login returns an access and refresh pair to the Next.js route handler. The handler stores them in `httpOnly`, `SameSite=Lax` cookies and returns only `{ ok: true }` to the browser.

On every proxied request, the server attaches the access token as a `Bearer` header. If Django returns `401`, the proxy calls the refresh endpoint once, rotates both cookies, and retries the original request once. If the refresh fails, the session is cleared.

Browser JavaScript never sees a token. That removes an entire class of XSS token theft, and it means the frontend cannot accidentally leak credentials into logs or analytics.

Machine clients use a different scheme: API keys from `PULSE_API_KEYS`, compared in constant time. For API-key principals, Pulse stores only a short SHA-256 fingerprint on each row. That fingerprint is what scopes reads:

- An API key sees rows created by that key.
- A non-staff JWT user sees rows they created.
- A staff operator sees the installation.
- An out-of-scope status request returns `404`, not `403`, so the API does not leak the existence of another tenant’s row.

The rate limiter is also scoped by principal, target user, and channel. The default is 10 requests per 60 seconds. It uses Redis `INCR` in a fixed window, which is atomic and cheap.

One subtle decision: if Redis is unavailable, the rate limiter **fails open** and logs a warning. Authentication still **fails closed**. Delivery availability is preferred over strict limiting, but no credential still means no access. Separating those two failure modes is the kind of detail that only becomes obvious when you think about what happens during a partial outage.

## A console that doesn’t invent traffic

![Pulse delivery health dashboard](../images/web-dashboard.png)

_Delivery health: volume, provider success, p95 latency, queue state, and recent sends._

![Pulse dispatch composer](../images/web-composer.png)

_The composer mirrors the API contract: one request, one channel, one template, with the exact JSON payload visible before dispatch._

Most dashboards are designed to look alive. Pulse’s console is designed to be auditable.

The design system is called **Instrument**: a porcelain canvas, ink typography, hairline rules, and a single vermilion signal color. Dark panels are reserved for machine output such as request traces and delivery contracts. There are no glowing gradients, fake live dots, or “all systems normal” banners.

More importantly, the data rules are explicit:

- A successful empty response shows an empty state.
- A failed request may fall back to sample data only if no live response exists.
- Any sample panel is labelled **Sample**, in the header and again in the detail footer.
- A failed refresh keeps the last successful payload and says it is stale.
- A failed template request disables sending instead of guessing a template.

The composer reflects the API contract: one request, one channel, one template. The delivery log exposes the notification ID, attempts, latency, timeline, and idempotency key. The gateways screen documents the real adapters and queues and states plainly that there is no automatic failover.

That last part is unusual for a product UI. It is also the point. An operator should not have to reverse-engineer the reliability model from a marketing page. The console should tell them what the system will actually do.

## The load test, with caveats

Pulse includes a Locust load test. One historical run used four Celery workers, two Gunicorn web nodes, and managed PostgreSQL and Redis:

- **Peak ingestion:** 850 requests per second.
- **p95 ingestion latency:** under 35 ms.
- **Rate limiter:** 100 concurrent requests targeting the same user’s limit produced exactly 10 accepted requests.

Those numbers describe **ingestion**, not delivery. They measure how fast Pulse can validate, persist, and enqueue a request. They do not measure SMTP latency, Twilio response time, or FCM throughput, because those depend on external providers.

The run is also a single environment’s result, not a capacity guarantee or an SLA. I include it because reproducible performance notes are more useful than a vague claim of “high throughput,” and because the caveats are part of the engineering.

## Shipping it

![Pulse deployment topology](../diagrams/deployment-topology.png)

_Production topology: Next.js and Django as separate services, workers on priority queues, operations tooling kept internal._

Pulse has two deployment shapes.

**Docker Compose** is the local and small-installation path. It brings up PostgreSQL, Redis, Django/Gunicorn, a Celery worker, Celery Beat, Flower, Streamlit, the Prometheus exporter, Mailpit, and the Next.js frontend. Every published port binds to `127.0.0.1`. Mailpit catches local email. Push uses the console backend unless FCM credentials are supplied.

**Kubernetes** is the scale path. The manifests define separate frontend and web services, high- and low-priority worker deployments, a singleton Beat scheduler, PostgreSQL, Redis, Flower, and the metrics exporter. Horizontal Pod Autoscalers cover the frontend, web, and worker tiers. A `migrate_locked` init container runs migrations before web pods serve traffic, so concurrent rollouts do not race each other.

Both images run as non-root users. Django exposes `/health/` for liveness and `/readyz/` for PostgreSQL and Redis readiness. Flower, Streamlit, and the Prometheus exporter are operational tools on private networks; they are not routed by the public ingress and have no built-in multi-user auth in this project.

The deployment guide is deliberately unglamorous: terminate TLS at the ingress, set `DEBUG=False`, use a narrow `ALLOWED_HOSTS`, keep registration off unless you mean it, back up PostgreSQL, and treat Redis as part of the queue’s durability story.

CI runs the backend tests, migration and deploy checks, Ruff, the frontend tests, typecheck, lint, a production dependency audit, and a production build. None of that makes the system correct, but it keeps the boring parts from becoming the interesting part at the wrong time.

## What I deliberately didn’t build

The most useful page in the repository might be [`docs/known_limitations.md`](../known_limitations.md).

Pulse does **not** have:

- Automatic channel fallback.
- A dead-letter queue or replay UI.
- Human delivery receipts. `sent` means the provider acknowledged the call.
- Per-tenant BYO provider credentials.
- SSO, SCIM, an SLA, or a support guarantee.
- Billing, metering, quotas, or a hard spend cap.
- A production APNs, SES, or Sinch adapter.
- Exactly-once delivery across the provider boundary.

These are not roadmap promises disguised as omissions. They are scope decisions. A notification service becomes trustworthy when its failure modes are documented as carefully as its features.

The same principle applies to the pricing page, which is explicitly labelled **Illustrative plans**. There is no checkout or billing integration behind it. It would be easy to make the page look like a real SaaS product. It would also be dishonest.

## Five lessons I keep coming back to

**1. Model the promise, not just the message.**
The notification row is the product. The provider call is an implementation detail. Once the row has a state machine, a trace, and a retry budget, the system becomes operable.

**2. Put invariants in the database.**
Idempotency is a unique constraint. Atomic claims are conditional updates. These survive process crashes, redeploys, and the occasional developer who forgets to acquire a lock. Application-level coordination is a cache; the database is the truth.

**3. At-least-once is a design decision, not a bug.**
Name the crash window. Document it. Then make the normal path as safe as possible. Pretending a distributed system is exactly-once is how teams end up debugging duplicate OTPs at 3 a.m.

**4. Security belongs at the boundary you control.**
The browser never needs the JWT. The proxy can hold it. The API can compare keys in constant time. Tenant scoping can happen in one queryset helper. Small, centralized boundaries beat scattered good intentions.

**5. Honest UI is an architecture feature.**
If the dashboard invents traffic when the API fails, operators learn to distrust it. If sample data is always labelled, an empty state is still useful. Truthfulness is not a visual polish issue; it is part of the contract.

## Run it yourself

Pulse is open source under the MIT license. The full source, diagrams, API reference, deployment manifests, and load-test notes are in the repository:

**[github.com/JathinShyam/Pulse](https://github.com/JathinShyam/Pulse)**

The local path is short:

```bash
git clone https://github.com/JathinShyam/Pulse.git
cd Pulse
cp .env.example .env

# Set SECRET_KEY, POSTGRES_PASSWORD, PULSE_API_KEYS, ALLOWED_HOSTS
docker compose up --build -d
docker compose exec web python manage.py createsuperuser
```

Open <http://localhost:3000>, sign in, create a template, and send a notification. Mailpit is at <http://localhost:8025>. API clients can hit Django directly on port 8000 with an `X-API-Key`.

If you want to change the architecture diagrams, the `.excalidraw` sources are in [`docs/diagrams/`](../diagrams/). They are editable, not screenshots of a diagram tool.

## Closing

Pulse is not trying to be the biggest notification platform. It is trying to be the one you can explain at 2 a.m., when a message did not arrive, the queue is backed up, and someone needs to know whether the system failed or the provider did.

The answer should not be a guess. It should be a row, a trace, and an honest status.

---

_If you build notification infrastructure, I would love to compare notes on idempotency, retry policy, and the parts of delivery that never fit neatly into a dashboard._
