import type {
  ChannelMetrics,
  Metrics,
  NotificationStatus,
  SeriesPoint,
} from "./types";

/**
 * The metrics endpoint has existed in two shapes (a compact legacy payload
 * and the richer windowed payload). These readers accept both so the UI can
 * render whatever the API provides.
 */

export function metricTotal(metrics?: Metrics | null): number | null {
  if (!metrics) return null;
  if (typeof metrics.total === "number") return metrics.total;
  if (typeof metrics.total_volume === "string") {
    const parsed = Number.parseFloat(
      metrics.total_volume.replace(/[^\d.]/g, ""),
    );
    if (Number.isFinite(parsed)) {
      if (metrics.total_volume.toUpperCase().includes("M"))
        return parsed * 1_000_000;
      if (metrics.total_volume.toUpperCase().includes("K"))
        return parsed * 1_000;
      return parsed;
    }
  }
  return null;
}

export function metricDeliverability(metrics?: Metrics | null): number | null {
  if (!metrics) return null;
  const value = metrics.deliverability;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace("%", ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function metricP95(metrics?: Metrics | null): number | null {
  if (!metrics) return null;
  if (typeof metrics.latency === "string") {
    const parsed = Number.parseFloat(metrics.latency.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (metrics.latency && typeof metrics.latency === "object") {
    return metrics.latency.p95_ms ?? null;
  }
  return null;
}

export function metricThroughput(metrics?: Metrics | null): number | null {
  if (!metrics) return null;
  return metrics.throughput_per_min ?? null;
}

export function metricSeries(metrics?: Metrics | null): SeriesPoint[] {
  return metrics?.series?.length ? metrics.series : [];
}

export function metricChannels(metrics?: Metrics | null): ChannelMetrics[] {
  return metrics?.channels?.length ? metrics.channels : [];
}

export function metricStatus(
  metrics?: Metrics | null,
): Record<NotificationStatus, number> | null {
  return metrics?.by_status ?? null;
}
