# Pulse Kubernetes Deployment

These manifests run Pulse as two externally reachable services: a Next.js
frontend that serves the site/console and proxies `/api/*`, and a Django API
that is only called from inside the cluster. PostgreSQL, Redis, Celery workers,
Flower and the Prometheus exporter are internal. The Streamlit dashboard is
part of the Compose stack, not these manifests.

```
                              Ingress
                    pulse.example.com
                 /                 \  (admin/static only)
                 v                  v
       pulse-frontend-service   pulse-web-service
          (Next.js x2-10)         (Django x2-10)
                 |  /api/*              |
                 +-------------------->+
                                        |
                         +--------------+--------------+
                         v                             v
                   postgres-service              redis-service
                                                        |
                                      +-----------------+-----------------+
                                      v                 v                 v
                                 celery-high        celery-low        celery-beat
                                    x2-20              x1-10              x1
```

Flower and metrics are ClusterIP-only and are not routed by the public Ingress.
They have no built-in multi-user auth in this project. The Streamlit dashboard
is available in the Compose stack but is not a Kubernetes resource.

## Prerequisites

- Kubernetes 1.25+
- `kubectl` and Kustomize
- An ingress controller (nginx-ingress annotations are included)
- A container registry
- HTTPS configured with cert-manager or an equivalent

## 1. Build and push both images

```bash
# Backend (Django, Celery, Flower, exporter)
docker build -t registry.example.com/pulse:1.1.0 .
docker push registry.example.com/pulse:1.1.0

# Frontend (Next.js standalone)
docker build \
  --build-arg NEXT_PUBLIC_APP_VERSION=1.1.0 \
  --build-arg NEXT_PUBLIC_ENVIRONMENT=Production \
  -t registry.example.com/pulse-frontend:1.1.0 ./frontend
docker push registry.example.com/pulse-frontend:1.1.0
```

The backend image contains collected static files and runs as a non-root user.
The frontend image contains the standalone Next.js server and runs as non-root.

## 2. Configure the manifests

Edit `kustomization.yaml` and replace both image names/tags:

```yaml
images:
  - name: pulse
    newName: registry.example.com/pulse
    newTag: 1.1.0
  - name: pulse-frontend
    newName: registry.example.com/pulse-frontend
    newTag: 1.1.0
```

Edit `configmap.yaml`:

- `ALLOWED_HOSTS`: your public hostname plus `pulse-web-service` (the frontend's
  internal proxy target), and `localhost,127.0.0.1` if needed
- `CSRF_TRUSTED_ORIGINS`: `https://pulse.example.com`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `DEFAULT_FROM_EMAIL`
- `PUSH_BACKEND`: `fcm` for live push, `console` only for simulation
- `REDIS_URL`, `CELERY_BROKER_URL`, `DATABASE_HOST` if using managed services

Edit `secrets.yaml` with base64 values:

```bash
echo -n 'a-long-random-django-secret' | base64
echo -n 'your-postgres-password' | base64
echo -n 'key-one,key-two' | base64   # PULSE_API_KEYS
```

`PULSE_API_KEYS` is commented out in the template. Add it under `data:` with
the base64 output if API-key clients need access. An empty/missing value is
fail-closed for API keys; browser JWT login can still work.

Do not apply the placeholder `SECRET_KEY` or database password. The
`DATABASE_URL` is assembled from `DATABASE_USER`/`DATABASE_PASSWORD`, so URL-
encode those values if they contain reserved characters. For managed
PostgreSQL, set `DATABASE_URL` directly in the ConfigMap/Secret and remove the
built-in `postgres` resources.

Edit `ingress.yaml` to replace `pulse.example.com` and uncomment TLS once the
certificate secret exists. `/admin` and `/static` go directly to Django; `/`
(including `/api/*` and `/api/docs/`) goes to the frontend proxy.

## 3. Apply

```bash
kubectl apply -k k8s/
```

Order matters on a fresh cluster: the web pods' `migrate_locked` init container
waits on a PostgreSQL advisory lock, so concurrent pods cannot race the
migration history. PostgreSQL and Redis must be ready first; Kubernetes retries
the init container until they are.

For a controlled rollout:

```bash
kubectl apply -k k8s/
kubectl -n pulse rollout status deployment/postgres
kubectl -n pulse rollout status deployment/redis
kubectl -n pulse rollout status deployment/pulse-web
kubectl -n pulse rollout status deployment/pulse-frontend
```

## 4. Create an operator account

There is no default login and registration is disabled by default.

```bash
kubectl -n pulse exec -it deployment/pulse-web -- python manage.py createsuperuser
```

Sign in at `https://pulse.example.com/login` with that email or username. API
clients use `X-API-Key` (or `Authorization: Api-Key`) with a key from
`PULSE_API_KEYS`, not a Bearer token.

## 5. Verify

```bash
kubectl get pods -n pulse
kubectl get hpa -n pulse
kubectl logs -n pulse -l component=web --tail=100
kubectl logs -n pulse -l component=celery-high --tail=100

# Ingress -> frontend proxy -> API
curl -I https://pulse.example.com/healthz
curl -H "X-API-Key: $PULSE_API_KEY" https://pulse.example.com/api/notifications/list/
```

Health endpoints on the Django pods are `/health/` (liveness) and `/readyz/`
(database + Redis readiness). The frontend uses `/healthz`.

## Scaling

HorizontalPodAutoscalers are configured for:

| Component      | Min | Max | CPU | Memory |
| -------------- | --- | --- | --- | ------ |
| pulse-web      | 2   | 10  | 70% | 80%    |
| pulse-frontend | 2   | 10  | 70% | —      |
| celery-high    | 2   | 20  | 60% | 70%    |
| celery-low     | 1   | 10  | 70% | 80%    |

Manual scaling:

```bash
kubectl scale deployment pulse-web -n pulse --replicas=5
kubectl scale deployment pulse-frontend -n pulse --replicas=4
kubectl scale deployment celery-high -n pulse --replicas=8
```

For queue-based worker scaling, use KEDA with the Redis `high_priority` and
`low_priority` lists as triggers.

## Monitoring

The exporter is available at `metrics-service:8001/metrics`. It has pod
annotations for Prometheus Kubernetes service discovery:

```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8001"
  prometheus.io/path: "/metrics"
```

Key series:

- `pulse_celery_queue_length{queue_name}` – ready tasks per queue
- `pulse_notifications_by_status{status}` – current retained rows
- `pulse_notification_failure_rate{channel}` – last 24h failed percentage
- `pulse_notification_delivery_latency_seconds` – creation-to-ack latency
- `pulse_notifications_total{channel,status}` – exporter-observed status increases

The exporter polls PostgreSQL and Redis and its counters reset when it
restarts. It reads the same ORM/settings as the application.

For internal tools:

```bash
kubectl port-forward -n pulse svc/flower-service 5555:5555
kubectl port-forward -n pulse svc/pulse-web-service 8000:80
kubectl port-forward -n pulse svc/metrics-service 8001:8001
```

Do not expose those services through the public Ingress. Flower's basic auth is
commented out in `flower.yaml`; if you expose it inside your network, enable
`--basic_auth` or put an authenticating proxy in front of it.

## Production notes

- Use managed PostgreSQL and Redis with backups and failover. The included
  single-replica PostgreSQL is suitable for a demo, not a production database.
- Keep `DEBUG=False`, set a long random `SECRET_KEY`, `ALLOW_REGISTRATION=False`,
  and narrow `ALLOWED_HOSTS`.
- Terminate TLS at the ingress. `TRUST_X_FORWARDED_PROTO=true` and
  `SECURE_SSL_REDIRECT=true` are set in the ConfigMap.
- Set real Twilio/SMTP credentials. FCM with `PUSH_BACKEND=fcm` needs
  `FIREBASE_CREDENTIALS_FILE` or workload identity/application default
  credentials; `console` is simulation-only.
- `admin` and `static` paths go directly to Django. Restrict `/admin` by source
  IP or an identity-aware proxy if it does not need to be public.
- The metrics exporter is optional. Remove its manifest if you use another
  metrics pipeline. The Streamlit dashboard is Compose-only.
- There is no billing integration, hard quota or SLA. Pricing shown by the
  frontend is illustrative.

## Troubleshooting

```bash
# Pod status, events, logs
kubectl describe pod <pod> -n pulse
kubectl logs -n pulse <pod> --previous

# Migration init container
kubectl logs -n pulse <web-pod> -c migrate

# Database connectivity
kubectl -n pulse exec deploy/pulse-web -- python manage.py showmigrations

# Redis / worker connectivity
kubectl -n pulse exec deploy/celery-high -- celery -A pulse inspect ping

# Restart a component
kubectl rollout restart deployment/pulse-web -n pulse
kubectl rollout restart deployment/pulse-frontend -n pulse
```

If the frontend gets `502` from `/api/*`, check that
`BACKEND_INTERNAL_URL=http://pulse-web-service:8000` resolves and that the web
pods are ready. If admin static files 404, confirm the backend image was built
with `collectstatic` (the provided Dockerfile does this).

## Files

| File                                   | Purpose                                   |
| -------------------------------------- | ----------------------------------------- |
| `namespace.yaml`                       | `pulse` namespace                         |
| `configmap.yaml`                       | Non-sensitive runtime config              |
| `secrets.yaml`                         | Secret template (replace values)          |
| `redis.yaml`                           | Redis broker                              |
| `postgres.yaml`                        | Single-replica PostgreSQL (demo)          |
| `web.yaml`                             | Django API, migration init container, HPA |
| `frontend.yaml`                        | Next.js frontend, Service, HPA            |
| `celery-high.yaml` / `celery-low.yaml` | Queue workers + HPAs                      |
| `celery-beat.yaml`                     | Beat scheduler (singleton)                |
| `flower.yaml`                          | Internal Celery monitor                   |
| `metrics.yaml`                         | Prometheus exporter                       |
| `ingress.yaml`                         | Public routing                            |
| `kustomization.yaml`                   | Kustomize entry point                     |
