# Architecture

```mermaid
flowchart TD
    Client[Client App] -->|HTTP POST| API[Django API (gunicorn)]
    API -->|1. Check Rate Limit| Redis[(Redis)]
    API -->|2. Check Idempotency| DB[(PostgreSQL)]
    API -->|3. Publish Task| CeleryQueue[Celery Queue (Redis)]

    CeleryQueue --> WorkerHigh[High Priority Worker]
    CeleryQueue --> WorkerLow[Low Priority Worker]

    WorkerHigh -->|API Call| Twilio[Twilio SMS]
    WorkerHigh -->|API Call| SMTP[SMTP Server]
    WorkerHigh -->|API Call| Firebase[Firebase Push]

    WorkerLow -->|API Call| Twilio
    WorkerLow -->|API Call| SMTP
    WorkerLow -->|API Call| Firebase

    WorkerHigh -->|Update Status| DB
    WorkerLow -->|Update Status| DB

    PrometheusExporter[Metrics Exporter] -->|Scrape DB/Redis| DB
    PrometheusExporter -->|Scrape| Redis
    Prometheus[Prometheus] -->|Scrape :8001| PrometheusExporter
```
