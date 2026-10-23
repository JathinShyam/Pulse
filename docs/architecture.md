# Architecture

![Pulse system architecture](diagrams/system-architecture.png)

_Editable source: [system-architecture.excalidraw](diagrams/system-architecture.excalidraw)._

<details>
<summary>Mermaid source</summary>

```mermaid
flowchart TD
    Browser[Browser] -->|HTTPS| Web[Next.js frontend + httpOnly session proxy]
    APIClient[API client] -->|X-API-Key| API[Django API (gunicorn)]

    Web -->|/api/* with forwarded JWT| API
    API -->|1. Check rate limit| Redis[(Redis)]
    API -->|2. Atomic idempotent create| DB[(PostgreSQL)]
    API -->|3. Publish task| CeleryQueue[Celery queues in Redis]

    CeleryQueue --> WorkerHigh[High-priority worker]
    CeleryQueue --> WorkerLow[Low-priority worker]

    WorkerHigh -->|SMTP| SMTP[Email provider]
    WorkerHigh -->|Twilio Messages API| Twilio[SMS provider]
    WorkerHigh -->|FCM HTTP v1| Firebase[Push provider]

    WorkerLow --> SMTP
    WorkerLow --> Twilio
    WorkerLow --> Firebase

    WorkerHigh -->|Atomic status + trace| DB
    WorkerLow -->|Atomic status + trace| DB

    Exporter[Prometheus exporter :8001] -->|Django ORM| DB
    Exporter -->|Queue length| Redis
    Prometheus[Prometheus] -->|Scrape :8001| Exporter

    Web -->|/api/metrics| API
```

</details>

## Request path

1. Browser requests go to Next.js. `/api/*` route handlers attach the access
   JWT from an httpOnly cookie (or pass through an incoming `X-API-Key`) and
   forward the request to Django on the internal network.
2. Django data endpoints authenticate with JWT or API key; health checks and
   the optional documentation routes are public.
3. The send serializer resolves the template, validates the recipient and
   channel, renders subject/body with the supplied context, and chooses
   `high_priority` for explicit `priority: high` or OTP-like template names;
   everything else goes to `low_priority`.
4. The row is created atomically with its idempotency key. If the row is new,
   the adapter publishes the Celery task. A duplicate key returns the existing
   row (`200`) or a conflict (`409`) without enqueueing again.
5. A worker atomically claims the row (`pending`/`retrying` -> `sending`),
   performs the provider call, and records `sent` or `failed`/`retrying`.
   Terminal states are never overwritten by a late task.
6. `/api/metrics` aggregates the caller's retained rows for the selected window;
   the UI renders those values and uses labelled Sample data only on error.

![Notification request and delivery flow](diagrams/request-delivery-flow.png)

_Editable source: [request-delivery-flow.excalidraw](diagrams/request-delivery-flow.excalidraw)._

## Delivery semantics

`sent` means the provider acknowledged the call. It is not a read receipt and
does not prove human delivery. Transient errors retry on the same channel with
exponential backoff; when the retry budget is exhausted, the row becomes
`failed`. There is no dead-letter queue and no automatic channel fallback.
Delivery is at-least-once in a narrow crash window: a worker that dies after
the provider accepts the call but before recording `sent` can be reclaimed and
may cause a duplicate provider attempt. Idempotency does not cover that gap.

## Trust boundaries

- Browser JavaScript never sees JWTs; cookies are httpOnly, same-site and secure
  when served over HTTPS.
- API keys are instance-wide environment secrets and are compared in constant
  time. Their fingerprint, not the key, is stored on rows for scoping.
- Staff users can inspect all deliveries; other users and API keys see only
  their own.
- Flower, the Streamlit dashboard and the Prometheus exporter are operational
  tools and must stay on a private network.
