# Deployment Instructions

## 1. Docker Compose (Simple)
For a single-node deployment:
```bash
# Set your environment variables in .env
cp .env.example .env

# Build and start all services
docker compose build
docker compose up -d
```

## 2. Cloud Deployment (Kubernetes)
The application is strictly 12-factor compliant. 
1. Build the Docker image: `docker build -t pulse-api:latest .`
2. Deploy the `pulse-api` image across your pods.
3. Configure your `Deployment` to use the `/health/` endpoint for the `livenessProbe` and `/readyz/` for the `readinessProbe`.
4. Run migrations as a `Job` prior to the deployment rollout: `python manage.py migrate`

**Required Environment Variables in Prod:**
- `DJANGO_ENV=production`
- `SECRET_KEY=...`
- `ALLOWED_HOSTS=api.yourdomain.com`
- `API_KEYS=key1,key2`
- `DATABASE_URL=postgresql://user:pass@host/dbname`
- `CELERY_BROKER_URL=redis://host:6379/0`
