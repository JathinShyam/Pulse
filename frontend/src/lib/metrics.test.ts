import { describe, expect, it } from "vitest";

import {
  metricChannels,
  metricDeliverability,
  metricP95,
  metricSeries,
  metricStatus,
  metricThroughput,
  metricTotal,
} from "./metrics";
import type { Metrics } from "./types";

const metrics: Metrics = {
  window: "24h",
  total: 120,
  total_volume: "120",
  by_status: {
    pending: 2,
    sending: 1,
    sent: 110,
    failed: 5,
    retrying: 2,
  },
  deliverability: 95.65,
  latency: { p50_ms: 40, p95_ms: 80, avg_ms: 50 },
  throughput_per_min: 0.08,
  channels: [
    {
      channel: "email",
      total: 80,
      sent: 75,
      failed: 3,
      retrying: 1,
      pending: 1,
      sending: 0,
      success_rate: 96.15,
      avg_latency_ms: 48,
      p95_latency_ms: 72,
    },
  ],
  series: [
    {
      bucket: "2026-10-22T00:00:00Z",
      email: 80,
      sms: 20,
      push: 20,
      total: 120,
    },
  ],
};

describe("metrics readers", () => {
  it("reads real totals, status, latency, channels and series", () => {
    expect(metricTotal(metrics)).toBe(120);
    expect(metricDeliverability(metrics)).toBe(95.65);
    expect(metricP95(metrics)).toBe(80);
    expect(metricThroughput(metrics)).toBe(0.08);
    expect(metricStatus(metrics)).toEqual(metrics.by_status);
    expect(metricChannels(metrics)).toHaveLength(1);
    expect(metricSeries(metrics)).toHaveLength(1);
  });

  it("does not substitute average latency for a missing p95", () => {
    expect(
      metricP95({
        latency: { p50_ms: 10, p95_ms: null, avg_ms: 12 },
      }),
    ).toBeNull();
  });

  it("keeps zero and empty values truthful", () => {
    expect(metricTotal({ total: 0 })).toBe(0);
    expect(metricDeliverability({ deliverability: 0 })).toBe(0);
    expect(metricStatus({})).toBeNull();
    expect(metricSeries({ series: [] })).toEqual([]);
    expect(metricChannels({ channels: [] })).toEqual([]);
  });

  it("returns null when a value is not reported", () => {
    expect(metricTotal(null)).toBeNull();
    expect(metricDeliverability({ deliverability: null })).toBeNull();
    expect(metricP95({})).toBeNull();
    expect(metricThroughput({})).toBeNull();
  });
});
