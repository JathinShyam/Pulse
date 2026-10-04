# API Documentation

The project includes auto-generated OpenAPI documentation using `drf-spectacular`.

1. **Swagger UI:** Available at `/api/docs/`
2. **ReDoc:** Available at `/api/redoc/`
3. **OpenAPI Schema:** Available at `/api/schema/`

_Note: Documentation is enabled only if `ENABLE_DOCS=True` in your environment._

### Key Endpoints

- `POST /api/notifications/`: Create and dispatch a new notification.
- `GET /api/notifications/`: List notifications (Requires API Key).
- `GET /api/notifications/<id>/`: Retrieve a specific notification's status.
- `GET /health/`: Liveness probe (bypasses auth/host checks).
- `GET /readyz/`: Readiness probe (checks DB & Redis connection).
- `GET :8001/metrics`: Prometheus metrics exporter.
