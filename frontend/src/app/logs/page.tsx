"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  Clock,
  Download,
  Inbox,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { ConsoleShell } from "@/components/console-shell";
import { CopyButton } from "@/components/copy-button";
import { useNotification, useNotifications } from "@/lib/queries";
import { channelMeta, STATUS_META } from "@/lib/channels";
import { DEMO_NOTIFICATIONS } from "@/lib/demo";
import {
  deliveryMs,
  fmtClock,
  fmtInt,
  fmtMs,
  maskRecipient,
  shortId,
} from "@/lib/format";
import type { NotificationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "sent", label: "Sent" },
  { value: "pending", label: "Queued" },
  { value: "sending", label: "Sending" },
  { value: "retrying", label: "Retrying" },
  { value: "failed", label: "Failed" },
];

const CHANNEL_OPTIONS = [
  { value: "all", label: "All channels" },
  { value: "push", label: "Push" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
];

function LogsFallback() {
  return (
    <ConsoleShell activePath="logs">
      <div className="animate-pulse space-y-6">
        <div className="h-24 rounded-2xl border border-line bg-surface/60" />
        <div className="h-80 rounded-2xl border border-line bg-surface/60" />
      </div>
    </ConsoleShell>
  );
}

function LogsContent({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("all");
  const [channel, setChannel] = useState("all");
  const [live, setLive] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filters = {
    limit: 50,
    ...(status !== "all" ? { status } : {}),
    ...(channel !== "all" ? { channel } : {}),
  };
  const { data, isError, isPending, refetch } = useNotifications(filters, {
    live,
  });
  const realRows = data?.results ?? [];
  const usingSample = isError && !data;
  // Sample rows are still filtered locally so the visible controls do not
  // imply a filter that was applied to live data.
  const baseRows = usingSample
    ? DEMO_NOTIFICATIONS.filter(
        (row) =>
          (status === "all" || row.status === status) &&
          (channel === "all" || row.channel === channel),
      )
    : realRows;

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return baseRows;
    return baseRows.filter((row) =>
      [row.notification_id, row.user_id, row.to, row.template_name]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [baseRows, query]);

  const active =
    rows.find((row) => row.notification_id === selectedId) ?? rows[0] ?? null;
  const { data: detail } = useNotification(
    !usingSample && active ? active.notification_id : null,
  );
  const activeDetail = detail ?? active;

  const counts = useMemo(() => {
    const total = rows.length;
    const sent = rows.filter((row) => row.status === "sent").length;
    const failed = rows.filter((row) => row.status === "failed").length;
    const activeCount = rows.filter(
      (row) =>
        row.status === "pending" ||
        row.status === "sending" ||
        row.status === "retrying",
    ).length;
    return { total, sent, failed, active: activeCount };
  }, [rows]);

  const hasFilters = Boolean(query || status !== "all" || channel !== "all");

  const resetFilters = () => {
    setQuery("");
    setStatus("all");
    setChannel("all");
  };

  const exportCsv = () => {
    const header = [
      "notification_id",
      "status",
      "channel",
      "recipient",
      "template",
      "attempts",
      "created_at",
      "sent_at",
    ];
    const lines = rows.map((row) =>
      [
        row.notification_id,
        row.status,
        row.channel,
        row.to,
        row.template_name,
        row.attempts,
        row.created_at,
        row.sent_at ?? "",
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
    link.download = usingSample
      ? "pulse-sample-deliveries.csv"
      : "pulse-deliveries.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeMeta = activeDetail ? channelMeta(activeDetail.channel) : null;
  const ActiveIcon = activeMeta?.icon ?? Inbox;
  const activeStatus = activeDetail
    ? STATUS_META[activeDetail.status as NotificationStatus]
    : null;
  const activeLatency = activeDetail
    ? deliveryMs(activeDetail.created_at, activeDetail.sent_at)
    : null;
  const providerError =
    activeDetail && "error_message" in activeDetail
      ? (activeDetail.error_message as string | null)
      : null;
  const idempotencyKey =
    activeDetail && "idempotency_key" in activeDetail
      ? (activeDetail.idempotency_key as string | null)
      : null;
  const lastAttempt =
    activeDetail && "last_attempt_at" in activeDetail
      ? (activeDetail.last_attempt_at as string | null)
      : null;
  const nextRetry =
    activeDetail && "next_retry_at" in activeDetail
      ? (activeDetail.next_retry_at as string | null)
      : null;

  const detailRows: { label: string; value: string; mono?: boolean }[] =
    activeDetail
      ? [
          {
            label: "Recipient",
            value: maskRecipient(activeDetail.to),
            mono: true,
          },
          { label: "Template", value: activeDetail.template_name },
          { label: "User", value: activeDetail.user_id, mono: true },
          {
            label: "Attempts",
            value: String(activeDetail.attempts),
            mono: true,
          },
          {
            label: "Latency",
            value: activeLatency == null ? "—" : fmtMs(activeLatency),
            mono: true,
          },
        ]
      : [];

  const timeline: { label: string; value: string }[] = activeDetail
    ? [
        { label: "Created", value: activeDetail.created_at },
        {
          label: "Last attempt",
          value: lastAttempt ?? activeDetail.created_at,
        },
        { label: "Sent", value: activeDetail.sent_at ?? "" },
        { label: "Next retry", value: nextRetry ?? "" },
      ].filter((step) => Boolean(step.value))
    : [];

  return (
    <ConsoleShell activePath="logs">
      <div className="space-y-7">
        <header className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Deliveries</p>
            <h1 className="mt-2 font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em] sm:text-[3.2rem]">
              Delivery log
            </h1>
            <p className="mt-3 max-w-[48ch] text-[13px] leading-relaxed text-muted">
              Every request, provider response and retry, in the order it
              happened.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLive((value) => !value)}
              aria-pressed={live}
              aria-label={
                live ? "Pause delivery refresh" : "Resume delivery refresh"
              }
              className={cn(
                "btn btn-sm border",
                live
                  ? "border-line bg-surface text-ink"
                  : "border-line bg-surface-2 text-muted",
              )}
            >
              <span
                className={cn(
                  "dot",
                  !live ? "bg-faint" : isError ? "bg-warn" : "bg-ok",
                )}
              />
              {!live ? "Paused" : isError ? "Retrying" : "Live"}
            </button>
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

        {isError && (
          <div
            role="status"
            className="flex flex-col gap-3 rounded-xl border border-warn/30 bg-warn/[0.05] p-3.5 text-[12px] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-warn" />
              <p className="leading-relaxed text-muted">
                Live deliveries are unavailable.{" "}
                {usingSample
                  ? "Showing clearly labeled sample rows."
                  : "Showing the last known rows."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="btn btn-secondary btn-sm self-start sm:self-auto"
            >
              <RefreshCw className="size-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="flex flex-wrap items-center gap-4 border-y border-line py-3 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="font-mono text-ink">{fmtInt(counts.total)}</span>
            in view
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot bg-ok" />
            <span className="font-mono text-ink">{fmtInt(counts.sent)}</span>
            sent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot bg-warn" />
            <span className="font-mono text-ink">{fmtInt(counts.active)}</span>
            in flight
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot bg-err" />
            <span className="font-mono text-ink">{fmtInt(counts.failed)}</span>
            failed
          </span>
          {usingSample && (
            <span className="badge ml-auto border-line bg-canvas px-2 py-0.5 text-[10px]">
              Sample
            </span>
          )}
          {!usingSample && live && !isError && (
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-faint">
              <RefreshCw className="size-3" />
              Refreshes every 5s
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="logs-filters flex flex-col gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter loaded rows by ID, recipient, template or user"
              aria-label="Search deliveries"
              className="input pr-9 pl-9 text-[12px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-faint hover:text-ink"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <select
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              aria-label="Filter by channel"
              className="select h-11 text-[12px] sm:w-40"
            >
              {CHANNEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status"
              className="select h-11 text-[12px] sm:w-40"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-ghost btn-sm self-start px-2 text-faint hover:text-ink lg:self-auto"
            >
              <X className="size-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Table + detail */}
        <div className="grid items-start gap-6 xl:grid-cols-12">
          <section className="panel min-w-0 overflow-hidden xl:col-span-8">
            {isPending && !data ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <span className="flex size-10 items-center justify-center rounded-full border border-line bg-surface-2">
                  <RefreshCw className="size-4 animate-spin text-faint" />
                </span>
                <p className="mt-4 text-[13px] font-medium">
                  Loading deliveries…
                </p>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <span className="flex size-10 items-center justify-center rounded-full border border-line bg-surface-2">
                  <Inbox className="size-4 text-faint" />
                </span>
                <p className="mt-4 text-[13px] font-medium">
                  No deliveries match these filters.
                </p>
                <p className="mt-1 max-w-[34ch] text-[12px] leading-relaxed text-muted">
                  Clear the search or widen the channel and status filters.
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-secondary btn-sm mt-4"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] sm:min-w-[680px]">
                  <thead>
                    <tr className="border-b border-line">
                      {[
                        "ID",
                        "Status",
                        "Channel",
                        "Recipient",
                        "Template",
                        "Tries",
                        "Created",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={cn(
                            "px-2.5 py-2.5 font-mono text-[10px] font-medium tracking-[0.1em] text-faint uppercase first:pl-4 last:pr-4 sm:px-4 sm:first:pl-5 sm:last:pr-5",
                            ["ID", "Template", "Tries", "Created"].includes(
                              heading,
                            ) && "hidden sm:table-cell",
                          )}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const meta = channelMeta(row.channel);
                      const Icon = meta.icon;
                      const statusMeta = STATUS_META[row.status];
                      const selected =
                        active?.notification_id === row.notification_id;
                      return (
                        <tr
                          key={row.notification_id}
                          onClick={() => setSelectedId(row.notification_id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedId(row.notification_id);
                            }
                          }}
                          tabIndex={0}
                          aria-selected={selected}
                          className={cn(
                            "cursor-pointer border-b border-line outline-none transition-colors last:border-b-0",
                            selected
                              ? "bg-accent-soft/45"
                              : "hover:bg-surface-2/50 focus-visible:bg-surface-2/50",
                          )}
                        >
                          <td className="hidden py-3 pr-3 pl-5 font-mono text-[10px] text-muted sm:table-cell">
                            {shortId(row.notification_id)}
                          </td>
                          <td className="px-2.5 py-3 sm:px-4">
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                              <span className={cn("dot", statusMeta.dot)} />
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="px-2.5 py-3 sm:px-4">
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-ink">
                              <Icon className="size-3.5 text-faint" />
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-2.5 py-3 font-mono text-[10px] text-muted sm:px-4">
                            {maskRecipient(row.to)}
                          </td>
                          <td className="hidden px-4 py-3 text-[11px] text-muted sm:table-cell">
                            {row.template_name}
                          </td>
                          <td className="hidden px-4 py-3 font-mono text-[10px] text-faint sm:table-cell">
                            {row.attempts}
                          </td>
                          <td className="hidden py-3 pr-5 pl-4 font-mono text-[10px] text-faint sm:table-cell">
                            {fmtClock(row.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Detail */}
          <aside className="xl:sticky xl:top-24 xl:col-span-4">
            {activeDetail ? (
              <div className="panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div className="flex items-center gap-2">
                    <ActiveIcon className="size-4 text-faint" />
                    <h2 className="text-[13px] font-semibold">
                      Delivery detail
                    </h2>
                  </div>
                  {activeStatus && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.06em] text-muted uppercase">
                      <span className={cn("dot", activeStatus.dot)} />
                      {activeStatus.label}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label">Notification</p>
                      <p className="mt-1 truncate font-mono text-[12px] text-ink">
                        {activeDetail.notification_id}
                      </p>
                    </div>
                    <CopyButton
                      value={activeDetail.notification_id}
                      label=""
                      className="mt-3 shrink-0 border border-line bg-surface text-faint hover:text-ink"
                    />
                  </div>

                  <div className="mt-5 divide-y divide-line border-y border-line">
                    {detailRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 py-2.5"
                      >
                        <span className="text-[11px] text-muted">
                          {row.label}
                        </span>
                        <span
                          className={cn(
                            "max-w-[60%] truncate text-right text-[11px] text-ink",
                            row.mono && "font-mono text-[10px]",
                          )}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <p className="label">Timeline</p>
                    <div className="mt-3 space-y-0">
                      {timeline.map((step, index) => (
                        <div
                          key={step.label}
                          className="relative flex gap-3 pb-3 last:pb-0"
                        >
                          {index < timeline.length - 1 && (
                            <span className="absolute top-2.5 left-[3px] h-full w-px bg-line" />
                          )}
                          <span
                            className={cn(
                              "relative mt-1.5 size-[7px] shrink-0 rounded-full",
                              index === timeline.length - 1
                                ? "bg-accent"
                                : "bg-line-strong",
                            )}
                          />
                          <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                            <span className="text-[11px] text-muted">
                              {step.label}
                            </span>
                            <span className="font-mono text-[10px] text-faint">
                              {fmtClock(step.value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {providerError && (
                    <div className="mt-5 rounded-lg border border-err/25 bg-err/[0.04] p-3">
                      <p className="font-mono text-[9px] tracking-[0.08em] text-err uppercase">
                        Provider error
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted">
                        {providerError}
                      </p>
                    </div>
                  )}

                  {idempotencyKey && (
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-3">
                      <span className="label">Idempotency</span>
                      <div className="flex min-w-0 items-center gap-1">
                        <span className="truncate font-mono text-[9px] text-faint">
                          {idempotencyKey}
                        </span>
                        <CopyButton
                          value={idempotencyKey}
                          label=""
                          className="px-1 text-faint hover:text-ink"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-line bg-surface-2/40 px-5 py-3">
                  <Link
                    href="/composer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-ink"
                  >
                    Send another
                    <ArrowUpRight className="size-3" />
                  </Link>
                  {usingSample && (
                    <span className="font-mono text-[10px] tracking-[0.08em] text-faint uppercase">
                      Sample record
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="panel flex flex-col items-center px-6 py-16 text-center">
                <Clock className="size-5 text-faint" />
                <p className="mt-3 text-[12px] text-muted">
                  Select a delivery to inspect it.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </ConsoleShell>
  );
}

function LogsQuery() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  return <LogsContent key={query} initialQuery={query} />;
}

export default function LogsPage() {
  return (
    <Suspense fallback={<LogsFallback />}>
      <LogsQuery />
    </Suspense>
  );
}
