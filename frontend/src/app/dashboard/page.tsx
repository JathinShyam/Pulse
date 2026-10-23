"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Inbox,
  Info,
  type LucideIcon,
} from "lucide-react";
import { ConsoleShell } from "@/components/console-shell";
import { VolumeChart } from "@/components/volume-chart";
import { useMetrics, useNotifications } from "@/lib/queries";
import { STATUS_META, channelMeta } from "@/lib/channels";
import {
  metricChannels,
  metricDeliverability,
  metricP95,
  metricSeries,
  metricStatus,
  metricTotal,
} from "@/lib/metrics";
import {
  DEMO_CHANNELS,
  DEMO_NOTIFICATIONS,
  DEMO_SERIES,
  DEMO_STATUS,
} from "@/lib/demo";
import {
  deliveryMs,
  fmtClock,
  fmtCompact,
  fmtInt,
  fmtMs,
  fmtPct,
  maskRecipient,
  shortId,
} from "@/lib/format";
import type { MetricsWindow, NotificationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const WINDOWS: { value: MetricsWindow; label: string }[] = [
  { value: "1h", label: "1h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

const DEMO_TOTAL = DEMO_SERIES.reduce((sum, point) => sum + point.total, 0);
const EMPTY_STATUS: Record<NotificationStatus, number> = {
  pending: 0,
  sending: 0,
  sent: 0,
  failed: 0,
  retrying: 0,
};

function RangeTabs({
  value,
  onChange,
  sampleOnly = false,
}: {
  value: MetricsWindow;
  onChange: (value: MetricsWindow) => void;
  sampleOnly?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Metrics window"
      className="inline-flex rounded-lg border border-line bg-surface p-0.5"
    >
      {WINDOWS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          disabled={sampleOnly && option.value !== "24h"}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-8 rounded-md px-2.5 font-mono text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
            value === option.value
              ? "bg-ink text-white"
              : "text-muted hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-canvas px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-3">
        <span className="label">{label}</span>
        <Icon className="size-3.5 text-faint" />
      </div>
      <p className="stat mt-4">{value}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted">{detail}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState<MetricsWindow>("24h");
  const {
    data: metrics,
    isError: metricsError,
    refetch: refetchMetrics,
  } = useMetrics(range);
  const {
    data: notificationsData,
    isError: notificationsError,
    isPending: notificationsPending,
  } = useNotifications({ limit: 8 });

  const usingDemo = metricsError && !metrics;
  const total = metricTotal(metrics) ?? (usingDemo ? DEMO_TOTAL : null);
  const deliverability =
    metricDeliverability(metrics) ??
    (usingDemo
      ? (DEMO_STATUS.sent / (DEMO_STATUS.sent + DEMO_STATUS.failed)) * 100
      : null);
  const p95 = metricP95(metrics) ?? (usingDemo ? 61 : null);
  const status = metricStatus(metrics);
  const queue = status
    ? status.pending + status.sending + status.retrying
    : usingDemo
      ? DEMO_STATUS.pending + DEMO_STATUS.sending + DEMO_STATUS.retrying
      : null;

  const realSeries = metricSeries(metrics);
  const chartSeries = usingDemo ? DEMO_SERIES : realSeries;
  const chartIsSample = usingDemo;

  const realChannels = metricChannels(metrics);
  const channelRows = realChannels.length
    ? realChannels
    : usingDemo
      ? DEMO_CHANNELS
      : [];

  const statusRows = status ?? (usingDemo ? DEMO_STATUS : EMPTY_STATUS);
  const statusOrder: NotificationStatus[] = [
    "sent",
    "pending",
    "sending",
    "retrying",
    "failed",
  ];

  const realNotifications = notificationsData?.results ?? [];
  const usingSampleRows = notificationsError && !notificationsData;
  const rows = (usingSampleRows ? DEMO_NOTIFICATIONS : realNotifications).slice(
    0,
    6,
  );

  const channelMax = Math.max(...channelRows.map((row) => row.total), 1);

  const exportCsv = () => {
    const header = [
      "notification_id",
      "status",
      "channel",
      "recipient",
      "template",
      "latency_ms",
      "created_at",
    ];
    const lines = rows.map((row) =>
      [
        row.notification_id,
        row.status,
        row.channel,
        row.to,
        row.template_name,
        deliveryMs(row.created_at, row.sent_at) ?? "",
        row.created_at,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = usingSampleRows
      ? "pulse-sample-deliveries.csv"
      : "pulse-deliveries.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ConsoleShell activePath="overview">
      <div className="space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Overview</p>
            <h1 className="mt-2 font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em] sm:text-[3.2rem]">
              Delivery health
            </h1>
            <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-muted">
              Every send from request to final status, in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RangeTabs
              value={usingDemo ? "24h" : range}
              onChange={setRange}
              sampleOnly={usingDemo}
            />
            <button
              type="button"
              onClick={exportCsv}
              aria-label="Export CSV"
              className="btn btn-secondary btn-sm px-3"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        {/* Live-data notice */}
        {metricsError && (
          <div
            role="status"
            className="flex flex-col gap-3 rounded-xl border border-warn/30 bg-warn/[0.05] p-3.5 text-[11px] leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 size-3.5 shrink-0 text-faint" />
              <p>
                Live metrics are unavailable.{" "}
                {usingDemo
                  ? "Showing clearly labeled 24h sample values."
                  : "Showing the last successful response."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetchMetrics()}
              className="btn btn-secondary btn-sm self-start sm:self-auto"
            >
              Retry
            </button>
          </div>
        )}

        {/* Ledger */}
        <section className="grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-4">
          <Metric
            label="Volume"
            value={total == null ? "—" : fmtCompact(total)}
            detail={
              usingDemo
                ? "Notifications in the sample 24h"
                : `Notifications in the last ${range}`
            }
            icon={Inbox}
          />
          <Metric
            label="Provider success"
            value={
              deliverability == null ? "—" : `${fmtPct(deliverability, 1)}%`
            }
            detail={
              usingDemo
                ? `${fmtInt(DEMO_STATUS.failed)} failed in the sample window`
                : status
                  ? status.failed
                    ? `${fmtInt(status.failed)} failed in this window`
                    : "No failed deliveries recorded"
                  : "Status breakdown is not reported"
            }
            icon={ArrowUpRight}
          />
          <Metric
            label="P95 latency"
            value={p95 == null ? "—" : fmtMs(p95)}
            detail={
              usingDemo
                ? "Sample value; request accepted to provider acknowledgement"
                : "Request accepted to provider acknowledgement (includes queue time)"
            }
            icon={ArrowRight}
          />
          <Metric
            label="In queue"
            value={queue == null ? "—" : fmtInt(queue)}
            detail={
              usingDemo
                ? `${fmtInt(DEMO_STATUS.pending)} queued · ${fmtInt(
                    DEMO_STATUS.sending,
                  )} sending · ${fmtInt(
                    DEMO_STATUS.retrying,
                  )} retrying in the sample`
                : status
                  ? `${fmtInt(status.pending)} queued · ${fmtInt(
                      status.sending,
                    )} sending · ${fmtInt(status.retrying)} retrying`
                  : "Queue depth is not reported by this endpoint"
            }
            icon={Inbox}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-12">
          {/* Volume chart */}
          <section className="panel min-w-0 p-5 sm:p-6 xl:col-span-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[15px] font-semibold">Volume</h2>
                <p className="mt-1 text-[12px] text-muted">
                  Notifications by channel · last {usingDemo ? "24h" : range}
                </p>
              </div>
              {chartIsSample && (
                <span className="badge self-start border-line bg-canvas px-2 py-0.5 text-[10px]">
                  Sample
                </span>
              )}
            </div>
            <div className="mt-6">
              <VolumeChart series={chartSeries} />
            </div>
          </section>

          {/* Channel + status */}
          <div className="space-y-6 xl:col-span-4">
            <section className="panel p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold">Channels</h2>
                {realChannels.length ? (
                  <span className="eyebrow">Success</span>
                ) : usingDemo ? (
                  <span className="badge border-line bg-canvas px-2 py-0.5 text-[10px]">
                    Sample
                  </span>
                ) : (
                  <span className="eyebrow">No data</span>
                )}
              </div>
              <div className="mt-5 space-y-4">
                {channelRows.map((row) => {
                  const meta = channelMeta(row.channel);
                  const Icon = meta.icon;
                  const success =
                    row.success_rate ??
                    (row.total ? (row.sent / row.total) * 100 : null);
                  return (
                    <div key={row.channel}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-[12px] text-ink">
                          <Icon className="size-3.5 text-faint" />
                          {meta.label}
                        </span>
                        <span className="font-mono text-[11px] text-muted">
                          {fmtCompact(row.total)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(
                                4,
                                (row.total / channelMax) * 100,
                              )}%`,
                              background: meta.color,
                            }}
                          />
                        </div>
                        <span className="w-12 text-right font-mono text-[10px] text-faint">
                          {success == null ? "—" : `${fmtPct(success, 1)}%`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="panel p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold">Status</h2>
                {status ? (
                  <span className="eyebrow">This window</span>
                ) : usingDemo ? (
                  <span className="badge border-line bg-canvas px-2 py-0.5 text-[10px]">
                    Sample
                  </span>
                ) : (
                  <span className="eyebrow">No data</span>
                )}
              </div>
              <div className="mt-3 divide-y divide-line">
                {statusOrder.map((key) => {
                  const meta = STATUS_META[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2.5 text-[12px]"
                    >
                      <span className="flex items-center gap-2 text-muted">
                        <span className={cn("dot", meta.dot)} />
                        {meta.label}
                      </span>
                      <span className="font-mono text-ink">
                        {fmtInt(statusRows[key])}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Recent deliveries */}
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-semibold">Recent deliveries</h2>
              {usingSampleRows && (
                <span className="badge border-line bg-canvas px-2 py-0.5 text-[10px]">
                  Sample
                </span>
              )}
            </div>
            <Link
              href="/logs"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted transition-colors hover:text-ink"
            >
              View all
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {notificationsError && (
            <div
              role="status"
              className="flex items-center gap-2 border-b border-warn/30 bg-warn/[0.05] px-5 py-2.5 text-[11px] text-muted"
            >
              <Info className="size-3.5 shrink-0 text-warn" />
              {usingSampleRows
                ? "Live deliveries are unavailable. Showing clearly labeled sample rows."
                : "Live deliveries are unavailable. Showing the last known rows."}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] sm:min-w-[720px]">
              <thead>
                <tr className="border-b border-line">
                  {[
                    "Status",
                    "Channel",
                    "Recipient",
                    "Template",
                    "Latency",
                    "Time",
                    "",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={cn(
                        "px-5 py-2.5 font-mono text-[10px] font-medium tracking-[0.1em] text-faint uppercase first:pl-6 last:pr-6 sm:px-4",
                        ["Template", "Latency", "Time"].includes(heading) &&
                          "hidden sm:table-cell",
                      )}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notificationsPending && !notificationsData ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-[12px] text-muted"
                    >
                      Loading recent deliveries…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-[12px] text-muted"
                    >
                      No deliveries yet. Send one from the composer.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const meta = channelMeta(row.channel);
                    const Icon = meta.icon;
                    const statusMeta = STATUS_META[row.status];
                    const latency = deliveryMs(row.created_at, row.sent_at);
                    return (
                      <tr
                        key={row.notification_id}
                        className="border-b border-line last:border-b-0 hover:bg-surface-2/45"
                      >
                        <td className="py-3 pr-4 pl-6 sm:px-4">
                          <span className="inline-flex items-center gap-2 text-[11px] text-muted">
                            <span className={cn("dot", statusMeta.dot)} />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2 text-[11px] text-ink">
                            <Icon className="size-3.5 text-faint" />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-muted">
                          {maskRecipient(row.to)}
                        </td>
                        <td className="hidden px-4 py-3 text-[11px] text-muted sm:table-cell">
                          {row.template_name}
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-[11px] text-muted sm:table-cell">
                          {latency == null ? "—" : fmtMs(latency)}
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-[10px] text-faint sm:table-cell">
                          {fmtClock(row.created_at)}
                        </td>
                        <td className="py-3 pr-6 pl-4 text-right">
                          <Link
                            href={`/logs?q=${encodeURIComponent(
                              row.notification_id,
                            )}`}
                            aria-label={`Open ${shortId(row.notification_id)}`}
                            className="inline-flex text-faint transition-colors hover:text-ink"
                          >
                            <ArrowUpRight className="size-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="font-mono text-[10px] text-faint">
          Metrics every 10s · deliveries every 5s
        </p>
      </div>
    </ConsoleShell>
  );
}
