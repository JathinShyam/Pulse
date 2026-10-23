"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Globe,
  Mail,
  MessageSquareText,
  Radio,
  Server,
  ShieldCheck,
} from "lucide-react";
import { ConsoleShell } from "@/components/console-shell";
import { PulseMark } from "@/components/logo";

const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.1.0";

const routes = [
  {
    name: "SMTP",
    channel: "Email",
    endpoint: "EMAIL_HOST",
    config: "EMAIL_*",
    note: "Django SMTP backend",
    icon: Mail,
  },
  {
    name: "Twilio",
    channel: "SMS",
    endpoint: "api.twilio.com",
    config: "TWILIO_*",
    note: "Twilio Messages API",
    icon: MessageSquareText,
  },
  {
    name: "Firebase Cloud Messaging",
    channel: "Push",
    endpoint: "fcm.googleapis.com",
    config: "FIREBASE_CREDENTIALS_FILE",
    note: "Set PUSH_BACKEND=fcm for live push",
    icon: Bell,
  },
];

const policies = [
  {
    match: "priority: high",
    title: "Explicit priority",
    copy: "An explicit high priority always wins over template keywords and selects the high-priority queue.",
    queue: "high_priority",
  },
  {
    match: "otp_login",
    title: "OTP-like template names",
    copy: "When priority is omitted, template names containing the configured OTP keywords route to the high-priority queue.",
    queue: "high_priority",
  },
  {
    match: "priority: low / default",
    title: "Low priority",
    copy: "An explicit low priority overrides OTP keywords. Templates without a priority override or OTP keyword also route to the low-priority queue.",
    queue: "low_priority",
  },
];

export default function GatewaysPage() {
  return (
    <ConsoleShell activePath="gateways">
      <div className="space-y-7">
        <header className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Gateways</p>
            <h1 className="mt-2 font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em] sm:text-[3.2rem]">
              Routing & providers
            </h1>
            <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-muted">
              The provider adapters Pulse supports for each channel. Channel and
              priority are explicit; retries stay on the same channel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge border-line bg-surface px-2.5 py-1 text-[10px]">
              Provider adapters
            </span>
            <Link href="/logs" className="btn btn-secondary btn-sm px-3">
              View traces
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </header>

        {/* Ledger */}
        <section className="grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-4">
          {[
            ["Channels", "3", "Email · SMS · push"],
            ["Queues", "2", "high_priority · low_priority"],
            ["Adapters", String(routes.length), "One per channel"],
            ["Fallback", "None", "Retries reuse the channel"],
          ].map(([label, value, detail]) => (
            <div key={label} className="bg-canvas px-4 py-5 sm:px-6">
              <p className="label">{label}</p>
              <p className="stat mt-3">{value}</p>
              <p className="mt-1.5 text-[11px] text-muted">{detail}</p>
            </div>
          ))}
        </section>

        {/* Topology */}
        <section className="panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[14px] font-semibold">Routing topology</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Request ingress to the selected channel adapter.
              </p>
            </div>
          </div>

          <div className="grid items-stretch gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_auto_1fr_auto_1.15fr] lg:items-center">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2 text-faint">
                <Globe className="size-4" />
                <span className="label">Ingress</span>
              </div>
              <p className="mt-4 font-mono text-[11px] break-all text-ink">
                POST /api/notifications/send/
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["API key / JWT", `Schema v${VERSION}`, "Idempotent"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[9px] text-faint"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="hidden items-center gap-1 lg:flex">
              <span className="h-px w-6 bg-line" />
              <ArrowRight className="size-3 text-faint" />
            </div>

            <div className="rounded-xl border border-ink/15 bg-ink p-4 text-white">
              <div className="flex items-center gap-2 text-white/65">
                <PulseMark className="size-4 text-accent" />
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase">
                  Router
                </span>
              </div>
              <p className="mt-4 text-[13px] font-medium">Priority router</p>
              <div className="mt-3 space-y-1.5">
                {[
                  ["High", "priority: high · OTP (priority omitted)"],
                  ["Low", "priority: low · default"],
                ].map(([queue, copy]) => (
                  <div
                    key={queue}
                    className="flex items-center justify-between gap-3 text-[10px]"
                  >
                    <span className="font-mono text-white/65 uppercase">
                      {queue}
                    </span>
                    <span className="text-right text-white/55">{copy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-1 lg:flex">
              <span className="h-px w-6 bg-line" />
              <ArrowRight className="size-3 text-faint" />
            </div>

            <div className="rounded-xl border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <div className="flex items-center gap-2 text-faint">
                  <Server className="size-4" />
                  <span className="label">Adapters</span>
                </div>
                <span className="font-mono text-[9px] text-faint">
                  {routes.length} adapters
                </span>
              </div>
              <div className="divide-y divide-line">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <div
                      key={route.name}
                      className="flex items-center gap-2.5 px-4 py-2.5"
                    >
                      <Icon className="size-3.5 text-faint" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px]">{route.name}</p>
                        <p className="font-mono text-[9px] text-faint">
                          {route.channel}
                        </p>
                      </div>
                      <span className="dot bg-line-strong" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Routes */}
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-[14px] font-semibold">Provider routes</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                One adapter per channel. Credentials are read from the
                environment at runtime.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] lg:min-w-[760px]">
              <thead>
                <tr className="border-b border-line">
                  {["Route", "Channel", "Endpoint", "Configuration"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-2.5 font-mono text-[10px] font-medium tracking-[0.1em] text-faint uppercase first:pl-6 last:pr-6"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <tr
                      key={route.name}
                      className="border-b border-line last:border-b-0 hover:bg-surface-2/45"
                    >
                      <td className="py-3 pr-4 pl-6">
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-3.5 text-faint" />
                          <div>
                            <p className="text-[12px] font-medium">
                              {route.name}
                            </p>
                            <p className="mt-0.5 text-[9px] text-faint">
                              {route.note}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted">
                        {route.channel}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-muted">
                        {route.endpoint}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-faint">
                        {route.config}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Policies */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div className="panel overflow-hidden xl:col-span-8">
            <div className="border-b border-line px-5 py-4 sm:px-6">
              <h2 className="text-[14px] font-semibold">Routing policy</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Priority affects queue order. It never changes the channel.
              </p>
            </div>
            <div className="divide-y divide-line">
              {policies.map((policy) => (
                <div key={policy.match} className="px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[9px] text-muted">
                          {policy.match}
                        </span>
                        <h3 className="text-[12px] font-medium">
                          {policy.title}
                        </h3>
                      </div>
                      <p className="mt-2 max-w-[56ch] text-[11px] leading-relaxed text-muted">
                        {policy.copy}
                      </p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <code className="inline-flex rounded border border-line bg-surface px-2 py-1 font-mono text-[9px] text-muted">
                        {policy.queue}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <div className="panel p-5">
              <div className="flex items-center gap-2">
                <Radio className="size-4 text-accent" />
                <h2 className="text-[13px] font-semibold">How retries work</h2>
              </div>
              <div className="mt-4 space-y-3.5">
                {[
                  [
                    "01",
                    "Claim the send",
                    "The log moves to sending before the provider call, so concurrent duplicate executions skip.",
                  ],
                  [
                    "02",
                    "Record the result",
                    "The latest provider response or error and the attempt count stay attached to the trace.",
                  ],
                  [
                    "03",
                    "Retry the same channel",
                    "Transient failures retry with exponential backoff until the attempt budget is spent, then fail.",
                  ],
                ].map(([number, title, copy]) => (
                  <div key={number} className="flex gap-3">
                    <span className="font-mono text-[9px] text-faint">
                      {number}
                    </span>
                    <div>
                      <p className="text-[11px] font-medium">{title}</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
                        {copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ink-panel p-5">
              <div className="flex items-center gap-2 text-white/65">
                <ShieldCheck className="size-4 text-accent" />
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase">
                  Delivery contract
                </span>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/85">
                A send is marked sent only after the provider returns an
                acknowledgement. That is not proof the recipient read the
                message, and a queued request is not a delivered message.
              </p>
              <Link
                href="/logs"
                className="mt-5 inline-flex items-center gap-1 text-[11px] font-medium text-white/70 transition-colors hover:text-white"
              >
                Inspect send traces
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ConsoleShell>
  );
}
