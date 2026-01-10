# Pulse Kubernetes Deployment

Production-ready Kubernetes manifests for deploying Pulse at scale.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Ingress                                  │
│                    (nginx-ingress)                               │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  Web x3  │   │  Flower  │   │ Metrics  │
    │  (HPA)   │   │          │   │          │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
   ┌───────────┐                ┌───────────┐
   │   Redis   │                │ PostgreSQL│
   │  Broker   │                │  Database │
   └─────┬─────┘                └───────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐
│Celery  │ │Celery  │ │Celery  │
│High x4 │ │Low x2  │ │ Beat   │
│ (HPA)  │ │ (HPA)  │ │        │
└────────┘ └────────┘ └────────┘
```

## Prerequisites

- Kubernetes cluster (1.25+)
- kubectl configured
- An Ingress Controller (nginx-ingress recommended)
- Container registry with Pulse image

## Quick Start

### 1. Build and Push Docker Image

```bash
# From project root
docker build -t your-registry/pulse:latest .
docker push your-registry/pulse:latest
```

### 2. Update Image References

Edit `kustomization.yaml`:

```yaml
images:
  - name: pulse
    newName: your-registry/pulse
    newTag: v1.0.0
```

### 3. Configure Secrets

Edit `secrets.yaml` with your base64-encoded secrets:

```bash
# Generate base64 values
echo -n 'your-secret-key' | base64
echo -n 'postgres-password' | base64
```

### 4. Deploy

```bash
# Using kustomize (kubectl 1.14+)
kubectl apply -k k8s/

# Or apply individually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/web.yaml
kubectl apply -f k8s/celery-high.yaml
kubectl apply -f k8s/celery-low.yaml
kubectl apply -f k8s/celery-beat.yaml
kubectl apply -f k8s/flower.yaml
kubectl apply -f k8s/metrics.yaml
kubectl apply -f k8s/ingress.yaml
```

### 5. Verify Deployment

```bash
# Check all pods
kubectl get pods -n pulse

# Watch scaling events
kubectl get hpa -n pulse -w

# View logs
kubectl logs -n pulse -l component=web --tail=100
kubectl logs -n pulse -l component=celery-high --tail=100
```

## Scaling

### Manual Scaling

```bash
# Scale web replicas
kubectl scale deployment pulse-web -n pulse --replicas=5

# Scale Celery workers
kubectl scale deployment celery-high -n pulse --replicas=8
kubectl scale deployment celery-low -n pulse --replicas=4
```

### Auto-Scaling (HPA)

HorizontalPodAutoscalers are configured for:

| Component    | Min | Max | CPU Target | Memory Target |
| ------------ | --- | --- | ---------- | ------------- |
| pulse-web    | 2   | 10  | 70%        | 80%           |
| celery-high  | 2   | 20  | 60%        | 70%           |
| celery-low   | 1   | 10  | 70%        | 80%           |

View HPA status:

```bash
kubectl get hpa -n pulse
```

### Custom Scaling Triggers

For queue-based scaling with KEDA:

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: celery-high-scaler
  namespace: pulse
spec:
  scaleTargetRef:
    name: celery-high
  minReplicaCount: 2
  maxReplicaCount: 50
  triggers:
    - type: redis
      metadata:
        address: redis-service:6379
        listName: high_priority
        listLength: "100"
```

## Monitoring

### Prometheus Integration

Metrics are exposed at port 8001. Add to your Prometheus config:

```yaml
scrape_configs:
  - job_name: 'pulse'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - pulse
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

### Grafana Dashboard

Import dashboard from `monitoring/grafana-dashboard.json` (if available).

Key metrics:
- `pulse_celery_queue_length{queue_name}` – Queue depths
- `pulse_notifications_by_status{status}` – Status distribution
- `pulse_notification_failure_rate{channel}` – Failure rates
- `pulse_notification_delivery_latency_seconds` – Delivery times

### Alerting Rules

```yaml
groups:
  - name: pulse
    rules:
      - alert: HighQueueDepth
        expr: pulse_celery_queue_length{queue_name="high_priority"} > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High priority queue backing up"
          
      - alert: HighFailureRate
        expr: pulse_notification_failure_rate > 5
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Notification failure rate above 5%"
```

## Production Considerations

### Database

For production, use managed PostgreSQL:
- AWS RDS
- Google Cloud SQL
- Azure Database for PostgreSQL

Update `configmap.yaml` with external database host.

### Redis

For production, use managed Redis:
- AWS ElastiCache
- Google Memorystore
- Azure Cache for Redis

Consider Redis Cluster mode for high availability.

### TLS/SSL

Enable TLS in `ingress.yaml`:

```yaml
spec:
  tls:
    - hosts:
        - pulse.example.com
      secretName: pulse-tls
```

Use cert-manager for automatic certificate management.

### Resource Limits

Adjust resource requests/limits based on actual usage:

```bash
# Monitor resource usage
kubectl top pods -n pulse
```

### Secrets Management

For production, use:
- HashiCorp Vault
- AWS Secrets Manager
- Kubernetes External Secrets

## Troubleshooting

### Common Issues

**Pods stuck in Pending:**
```bash
kubectl describe pod <pod-name> -n pulse
# Check for resource constraints or PVC issues
```

**Database connection errors:**
```bash
kubectl logs -n pulse -l component=web | grep -i database
# Verify DATABASE_URL and secrets
```

**Workers not processing:**
```bash
kubectl exec -n pulse -it deployment/celery-high -- celery -A pulse inspect active
# Check Redis connectivity
```

### Useful Commands

```bash
# Get all resources in namespace
kubectl get all -n pulse

# Describe HPA
kubectl describe hpa pulse-web-hpa -n pulse

# Port-forward for local access
kubectl port-forward -n pulse svc/pulse-web-service 8000:80
kubectl port-forward -n pulse svc/flower-service 5555:5555

# Force rolling restart
kubectl rollout restart deployment/pulse-web -n pulse
```

## Files Overview

| File | Description |
|------|-------------|
| `namespace.yaml` | Creates `pulse` namespace |
| `configmap.yaml` | Non-sensitive configuration |
| `secrets.yaml` | Sensitive credentials (template) |
| `redis.yaml` | Redis broker deployment |
| `postgres.yaml` | PostgreSQL database (dev only) |
| `web.yaml` | Django API + HPA |
| `celery-high.yaml` | High-priority workers + HPA |
| `celery-low.yaml` | Low-priority workers + HPA |
| `celery-beat.yaml` | Scheduler (singleton) |
| `flower.yaml` | Celery monitoring UI |
| `metrics.yaml` | Prometheus exporter |
| `ingress.yaml` | External routing |
| `kustomization.yaml` | Kustomize config |
