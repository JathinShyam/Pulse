# Deployment

Pulse has two supported shapes: a local Docker Compose stack and Kubernetes
manifests. Both run the Next.js frontend as the browser entry point; Django
stays internal, and its data endpoints require an API key or JWT.

![Pulse deployment topology](diagrams/deployment-topology.png)

_Editable source: [deployment-topology.excalidraw](diagrams/deployment-topology.excalidraw)._

## Docker Compose

The Compose stack includes PostgreSQL, Redis, Django/Gunicorn, a Celery worker,
Celery Beat, Flower, the Streamlit dashboard, the Prometheus exporter, Mailpit
and the Next.js frontend.

```bash
cp .env.example .env

# Replace at least these values:
#   SECRET_KEY                 long random value
#   PULSE_API_KEYS             comma-separated client keys
#   POSTGRES_PASSWORD          database password
#   ALLOWED_HOSTS              hosts served by the deployment
#   EMAIL_* / TWILIO_*         real provider credentials (optional locally)

docker compose up --build -d
docker compose exec web python manage.py createsuperuser
```

Open <http://localhost:3000>. The compose `migrate` service applies migrations
once before the web and worker services start; `collectstatic` is baked into
the backend image. Mailpit is available at <http://localhost:8025>. Flower is
bound to loopback at <http://localhost:5555> and the Streamlit dashboard at
<http://localhost:8501>. The Prometheus exporter has no published port; scrape
`metrics:8001` from inside the Compose network.

The local stack deliberately disables HTTPS redirection and secure cookies, and
binds every published port to `127.0.0.1`. Do not expose it directly to the
internet.

To point the Compose stack at external infrastructure, set the matching
`COMPOSE_*` variables in `.env` (leave them blank for the bundled services):
`COMPOSE_DATABASE_URL`, `COMPOSE_REDIS_URL`, `COMPOSE_CELERY_BROKER_URL`,
`COMPOSE_CELERY_RESULT_BACKEND`, `COMPOSE_EMAIL_HOST` and
`COMPOSE_EMAIL_PORT`. Native development keeps using `DATABASE_URL`,
`REDIS_URL` and `EMAIL_HOST`.

## Production Checklist

1. Terminate TLS at a reverse proxy or ingress. Forward
   `X-Forwarded-Proto: https` and set `TRUST_X_FORWARDED_PROTO=True`.
2. Set `DEBUG=False`, a long random `SECRET_KEY`, a narrow `ALLOWED_HOSTS`, and
   `CSRF_TRUSTED_ORIGINS` for the public HTTPS origin. The Next.js frontend
   already sends `nosniff`, frame-deny, referrer and permissions-policy
   headers.
3. Set `SECURE_SSL_REDIRECT=True`, `SESSION_COOKIE_SECURE=True`,
   `CSRF_COOKIE_SECURE=True`, and `SECURE_HSTS_SECONDS=31536000` for Django
   responses. Configure the TLS ingress or reverse proxy to add HSTS to
   Next.js HTML responses as well. Once all subdomains are HTTPS, set
   `SECURE_HSTS_INCLUDE_SUBDOMAINS=True`; only enable `SECURE_HSTS_PRELOAD`
   when you intend to submit the domain to the preload list. Do not send HSTS
   from an HTTP-only local stack.
4. Keep `ALLOW_REGISTRATION=False` unless self-service accounts are intended.
   Create operators with `createsuperuser` or the Django admin.
5. Set `PULSE_API_KEYS` to comma-separated high-entropy keys. Empty means
   API-key clients are rejected; the browser console can still use JWT accounts.
6. Configure real SMTP, Twilio and FCM credentials. SMS fails permanently with
   a clear error until Twilio is configured. Set `PUSH_BACKEND=fcm` and provide
   `FIREBASE_CREDENTIALS_FILE` or application default credentials for live push;
   the default `console` backend is simulation-only.
7. Use managed PostgreSQL and Redis where possible. Back up the database; Redis
   holds the queue, so losing it loses queued work.
8. Run migrations as a one-shot Job before rolling out web/worker pods. Static
   assets are already collected in the image.
9. Keep Flower, the Streamlit dashboard (Compose only) and the Prometheus
   exporter on private networks. They have no built-in multi-user auth in this project. Scrape
   `metrics:8001/metrics` from Prometheus.
10. Set `ADMIN_URL` to a non-default admin path and restrict `/admin` at the
    ingress if it does not need to be public.
11. Set `LOG_RETENTION_DAYS` deliberately. Deleting old rows also removes them
    from the metrics window and exporter gauges.

### Required environment variables

| Variable                                                           | Purpose                                                           |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `SECRET_KEY`                                                       | Django signing secret; required when `DEBUG=False`                |
| `DEBUG`                                                            | Must be `False` in production                                     |
| `ALLOWED_HOSTS`                                                    | Comma-separated public hostnames plus any internal proxy hostname |
| `CSRF_TRUSTED_ORIGINS`                                             | Comma-separated HTTPS origins for admin/session forms             |
| `PULSE_API_KEYS`                                                   | Comma-separated client API keys                                   |
| `DATABASE_URL`                                                     | PostgreSQL DSN (`postgresql://...`)                               |
| `REDIS_URL`                                                        | Redis DSN used by cache, limiter and Celery by default            |
| `CELERY_BROKER_URL`                                                | Explicit broker DSN if different from `REDIS_URL`                 |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USE_TLS`                      | SMTP relay                                                        |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` | SMS                                                               |
| `PUSH_BACKEND` / `FIREBASE_CREDENTIALS_FILE`                       | `fcm` for live push, `console` for simulation                     |
| `ENABLE_DOCS`                                                      | Expose `/api/docs/`, `/api/redoc/` and `/api/schema/` publicly    |
| `TRUST_X_FORWARDED_PROTO`                                          | Trust the proxy's HTTPS marker                                    |
| `SECURE_SSL_REDIRECT`                                              | Redirect HTTP requests to HTTPS                                   |
| `SECURE_HSTS_SECONDS`                                              | HSTS lifetime; `0` for HTTP-only local stacks                     |
| `NEXT_PUBLIC_*`                                                    | Build-time frontend labels/docs URL                               |

Health endpoints are `/health/` (liveness) and `/readyz/` (PostgreSQL and Redis
readiness). They bypass host and HTTPS checks so in-cluster probes work.

## Kubernetes

See [`k8s/README.md`](../k8s/README.md) for the frontend/backend topology,
ingress layout, secrets, image builds and operational checks. The short version:

```bash
docker build -t registry.example.com/pulse:1.1.0 .
docker build \
  --build-arg NEXT_PUBLIC_APP_VERSION=1.1.0 \
  --build-arg NEXT_PUBLIC_ENVIRONMENT=Production \
  -t registry.example.com/pulse-frontend:1.1.0 ./frontend

# Update k8s/kustomization.yaml and k8s/ingress.yaml first.
kubectl apply -k k8s/
kubectl get pods -n pulse
```

Do not apply the manifests with the placeholder secret values. Set a real
`SECRET_KEY`, database password and `PULSE_API_KEYS`, and replace
`pulse.example.com` in the ConfigMap and Ingress.

When customizing `ALLOWED_HOSTS`, keep `pulse-web-service` in the list. The
frontend calls Django through that internal service name, and Django validates
the `Host` header on the proxy hop. Removing it makes every proxied API request
fail with `DisallowedHost`, even though the public hostname is configured.
