# Known Limitations

1. **Batching:** The API currently ingests notifications one-by-one. A bulk-ingest endpoint would further optimize high-volume dispatch.
2. **Channel Fallbacks:** We do not currently support automatic fallback (e.g., if Push fails, fall back to SMS). This must be handled by the client.
3. **Metrics Polling:** The custom Prometheus exporter polls the database for stats. Under extreme load, this polling interval might need to be adjusted or moved to an event-driven metrics model (like statsd).
