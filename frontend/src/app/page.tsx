import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Terminal,
  Webhook,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CopyButton } from "@/components/copy-button";
import { PulseMark } from "@/components/logo";
import { DEMO_NOTIFICATIONS, DEMO_SERIES } from "@/lib/demo";
import { channelMeta } from "@/lib/channels";
import { fmtClock } from "@/lib/format";
import { cn } from "@/lib/utils";

const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.1.0";

const requestCode = `// Server-side example. Browser sessions use the same-origin /api proxy.
await fetch("https://pulse.example.com/api/notifications/send/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.PULSE_API_KEY,
  },
  body: JSON.stringify({
    template_name: "security_alert",
    user_id: "user_9918",
    channel: "push",
    to: "demo-device-token",
    priority: "high",
    subject: "Security alert",
    body: "A new sign-in was detected for {name}.",
    context: { name: "Alex" },
    idempotency_key: "idem_8f2a",
  }),
});`;

const tracePayload = `{
  "template_name": "security_alert",
  "user_id": "user_9918",
  "channel": "push",
  "to": "demo-device-token",
  "priority": "high",
  "subject": "Security alert",
  "body": "A new sign-in was detected for {name}.",
  "context": { "name": "Alex" },
  "idempotency_key": "idem_8f2a"
}`;

const traceSteps = [
  {
    title: "Request accepted",
    detail: "Schema valid · idempotency key stored",
    time: "0ms",
  },
  {
    title: "Queued for push",
    detail: "Priority queue · high_priority",
    time: "3ms",
  },
  {
    title: "Provider accepted",
    detail: "FCM response attached to the trace",
    time: "21ms",
  },
  {
    title: "Acknowledged",
    detail: "Provider response stored · trace closed",
    time: "37ms",
  },
];

const channels = [
  {
    icon: Mail,
    name: "Email",
    provider: "SMTP",
    copy: "Transactional email through your configured SMTP server. Provider errors stay on the trace.",
  },
  {
    icon: MessageSquareText,
    name: "SMS",
    provider: "Twilio",
    copy: "One-way transactional SMS through Twilio. Provider responses are recorded on the trace.",
  },
  {
    icon: Bell,
    name: "Push",
    provider: "FCM",
    copy: "Push through Firebase Cloud Messaging. A console provider is available for local development.",
  },
];

const routingRules = [
  {
    name: "OTP / verification",
    detail: "Template keyword → high_priority",
    path: ["sms"],
  },
  {
    name: "Explicit priority",
    detail: "priority: high → high_priority",
    path: ["push"],
  },
  {
    name: "Everything else",
    detail: "Default → low_priority",
    path: ["email"],
  },
];

const principles = [
  {
    title: "Persist first.",
    copy: "A request is persisted before it is queued. Provider errors and the attempt count stay on the record.",
  },
  {
    title: "One accept per key.",
    copy: "Idempotency keys are enforced by a unique database constraint, so a retried request with the same key cannot become a second queue item.",
  },
  {
    title: "No mystery failures.",
    copy: "Provider metadata, the latest error and the attempt count remain attached to the message. You can see where sending stopped — and why.",
  },
];

function sparkline(values: number[], width = 560, height = 120) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / span) * (height - 10) - 5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return points.join(" ");
}

function HeroTrace() {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[1.6rem] border border-line/70" />
      <div className="ink-panel relative overflow-hidden border border-ink/10 shadow-[0_30px_80px_-40px_rgba(23,24,22,0.55)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <PulseMark className="size-4 text-accent" />
            <span className="font-mono text-[10px] tracking-[0.12em] text-white/50 uppercase">
              Delivery trace
            </span>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-white/60 uppercase">
            Example
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] text-white/65">
              <span className="text-white/90">POST</span>{" "}
              /api/notifications/send/
            </p>
            <CopyButton
              value={tracePayload}
              className="text-white/60 hover:bg-white/10 hover:text-white"
            />
          </div>

          <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.035] p-3.5 font-mono text-[11px] leading-relaxed text-white/65">
            {tracePayload}
          </pre>

          <div className="mt-6">
            {traceSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex gap-3.5 pb-5 last:pb-0"
              >
                {index < traceSteps.length - 1 && (
                  <span className="absolute top-3.5 left-[4px] h-[calc(100%-2px)] w-px bg-white/10" />
                )}
                <span
                  className={cn(
                    "relative mt-1.5 size-[9px] shrink-0 rounded-full border",
                    index === traceSteps.length - 1
                      ? "border-accent bg-accent"
                      : "border-white/25 bg-ink",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[13px] font-medium text-white/90">
                      {step.title}
                    </p>
                    <span className="shrink-0 font-mono text-[10px] text-white/55">
                      {step.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/60">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
            <span className="font-mono text-[10px] text-white/55">
              tr_8f2a…c91
            </span>
            <span className="font-mono text-[10px] font-medium text-accent-bright">
              Provider accepted in 37ms
            </span>
          </div>

          <svg
            viewBox="0 0 420 34"
            className="mt-4 h-8 w-full text-accent/70"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 24h30l7-15 9 27 8-21 6 9h34l7-12 8 20 7-9h26l9-17 10 29 9-23 7 11h31l8-13 8 21 7-9h29l9-16 10 27 8-19 7 9h26l8-11 8 18 7-7h40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CodePanel() {
  return (
    <div className="ink-panel min-w-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-white/65 uppercase">
          <Terminal className="size-3.5" />
          server.ts
        </div>
        <CopyButton
          value={requestCode}
          className="text-white/60 hover:bg-white/10 hover:text-white"
        />
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[11.5px] leading-[1.8] text-white/75">
        {requestCode}
      </pre>
      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-[10px]">
        <span className="text-accent-bright">202 Accepted</span>
        <span className="text-white/55">tr_8f2a…c91</span>
      </div>
    </div>
  );
}

function RoutingPanel() {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-faint uppercase">
          <Zap className="size-3.5" />
          Routing rules
        </div>
        <span className="badge border-line bg-canvas px-2 py-0.5 text-[9px]">
          Sample
        </span>
      </div>
      <div>
        {routingRules.map((rule) => (
          <div
            key={rule.name}
            className="border-b border-line px-4 py-3.5 last:border-b-0"
          >
            <p className="text-[13px] font-medium">{rule.name}</p>
            <p className="mt-0.5 text-[11px] text-faint">{rule.detail}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {rule.path.map((channel, index) => {
                const meta = channelMeta(channel);
                return (
                  <span key={channel} className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-canvas px-2 py-1 font-mono text-[9px] tracking-[0.04em] text-muted uppercase">
                      <span
                        className="size-1.5 rounded-full"
                        style={{ background: meta.color }}
                      />
                      {meta.label}
                    </span>
                    {index < rule.path.length - 1 && (
                      <ChevronRight className="size-3 text-faint" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-4 py-3 text-[11px] leading-relaxed text-faint">
        Priority is chosen from the request or template keyword. There is no
        automatic channel fallback.
      </div>
    </div>
  );
}

function ConsolePreview() {
  const values = DEMO_SERIES.map((point) => point.total);
  const rows = DEMO_NOTIFICATIONS.slice(0, 3);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <span className="dot bg-ok" />
          Deliveries
        </div>
        <span className="badge border-line bg-canvas px-2 py-0.5 text-[9px]">
          Sample
        </span>
      </div>

      <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
        {[
          ["Sent", "2,038"],
          ["Success rate", "99.4%"],
          ["P95 latency", "61ms"],
        ].map(([label, value]) => (
          <div key={label} className="px-4 py-3.5">
            <p className="font-mono text-[9px] tracking-[0.08em] text-faint uppercase">
              {label}
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-[-0.03em] tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted">Volume · last 24h</p>
          <p className="font-mono text-[9px] tracking-[0.06em] text-faint uppercase">
            All channels
          </p>
        </div>
        <svg
          viewBox="0 0 560 120"
          className="mt-2 h-24 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points={sparkline(values, 560, 110)}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points={`0,110 ${sparkline(values, 560, 110)} 560,110`}
            fill="var(--color-accent)"
            opacity="0.055"
          />
        </svg>
      </div>

      <div className="mt-2 divide-y divide-line border-t border-line">
        {rows.map((row) => {
          const meta = channelMeta(row.channel);
          const Icon = meta.icon;
          return (
            <div
              key={row.notification_id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span className="dot bg-ok" />
              <Icon className="size-3.5 text-faint" />
              <span className="w-14 font-mono text-[10px] tracking-[0.04em] text-muted uppercase">
                {meta.label}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-faint">
                #{row.notification_id.slice(0, 6)}…
                {row.notification_id.slice(-4)}
              </span>
              <span className="font-mono text-[10px] text-faint">
                {fmtClock(row.created_at)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="text-[11px] text-faint">
          Preview with sample data.
        </span>
        <Link
          href="/logs"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-ink hover:text-accent-ink"
        >
          Open deliveries
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="grid-paper pointer-events-none absolute inset-0 opacity-[0.32] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
          <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-14 px-5 pt-14 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:pt-24 lg:pb-24">
            <div className="min-w-0 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
                <span className="dot bg-accent" />
                Notification infrastructure · v{VERSION}
              </div>

              <h1 className="mt-7 max-w-[15ch] font-display text-[clamp(3rem,7.2vw,5.8rem)] leading-[0.94] font-semibold tracking-[-0.055em]">
                Messages that send. Proof of what happened.
              </h1>

              <p className="mt-6 max-w-[50ch] text-[17px] leading-relaxed text-muted sm:text-lg">
                Pulse sends email, SMS and push through one API — with priority
                queues, retries and an inspectable trace for every send.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/composer" className="btn btn-primary h-12 px-5">
                  Start sending
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/dashboard" className="btn btn-secondary h-12 px-5">
                  See the console
                </Link>
              </div>

              <ul className="mt-9 flex flex-wrap gap-4 gap-y-2 border-t border-line pt-5 text-[12px] text-muted">
                {[
                  "Idempotent requests",
                  "Priority routing",
                  "Per-message traces",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-3.5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 lg:col-span-5 lg:pt-2">
              <HeroTrace />
            </div>
          </div>

          <svg
            viewBox="0 0 1440 80"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-line-strong/50"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 54h280l14-26 18 48 15-38 10 16h180l14-22 17 40 14-18h210l15-30 18 52 16-42 11 20h200l14-24 17 42 14-18h200l15-28 18 50 14-40 10 18h170"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </section>

        {/* Channels */}
        <section className="border-b border-line bg-surface/50">
          <div className="mx-auto grid w-full max-w-[1280px] divide-y divide-line px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.name}
                  className="px-0 py-6 md:px-7 md:first:pl-0 md:last:pr-0"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 text-accent" />
                    <p className="text-[13px] font-medium">{channel.name}</p>
                    <span className="font-mono text-[9px] tracking-[0.08em] text-faint uppercase">
                      {channel.provider}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[34ch] text-[12px] leading-relaxed text-muted">
                    {channel.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Provider strip */}
        <div className="border-b border-line">
          <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-3 px-5 py-4 sm:gap-4 sm:px-8">
            <span className="font-mono text-[9px] tracking-[0.12em] text-faint uppercase">
              Connects to
            </span>
            {["FCM", "Twilio", "SMTP"].map((provider) => (
              <span
                key={provider}
                className="text-[11px] font-medium whitespace-nowrap text-muted/80 sm:text-[12px]"
              >
                {provider}
              </span>
            ))}
          </div>
        </div>

        {/* Product */}
        <section id="product" className="scroll-mt-20 border-b border-line">
          <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 lg:col-span-4">
              <p className="eyebrow">One request</p>
              <h2 className="mt-4 max-w-[13ch] font-display text-4xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-5xl">
                One request. One channel.
              </h2>
              <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-muted">
                Stop stitching provider SDKs together. Send one request and let
                Pulse queue it, retry the attempt and keep the provider
                response.
              </p>

              <ul className="mt-9 space-y-5">
                {[
                  {
                    title: "Idempotent requests",
                    copy: "Retrying with the same idempotency key cannot create a second message.",
                  },
                  {
                    title: "Priority queues",
                    copy: "An OTP template routes to high_priority rather than the low-priority queue.",
                  },
                  {
                    title: "Retries with backoff",
                    copy: "Failed provider attempts are retried until the attempt budget is spent.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
                      <Check className="size-3 text-accent" />
                    </span>
                    <div>
                      <p className="text-[13px] font-medium">{item.title}</p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                        {item.copy}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid min-w-0 gap-5 lg:col-span-8 xl:grid-cols-12">
              <div className="min-w-0 xl:col-span-7">
                <CodePanel />
              </div>
              <div className="min-w-0 xl:col-span-5">
                <RoutingPanel />
              </div>
            </div>
          </div>
        </section>

        {/* Delivery */}
        <section id="delivery" className="scroll-mt-20 border-b border-line">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 lg:col-span-5">
              <p className="eyebrow">Observability</p>
              <h2 className="mt-4 max-w-[12ch] font-display text-4xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-5xl">
                A trace for every message.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-muted">
                Delivery is not a promise, it is a record. Follow a message from
                the first request through every queue, provider call and retry.
              </p>

              <div className="mt-10 divide-y divide-line border-t border-line">
                {[
                  [
                    "01",
                    "Accepted",
                    "Request persisted and idempotency checked.",
                  ],
                  ["02", "Routed", "Priority queue and channel selected."],
                  [
                    "03",
                    "Acknowledged",
                    "Provider response attached to the trace.",
                  ],
                ].map(([number, title, copy]) => (
                  <div
                    key={title}
                    className="grid grid-cols-[2.5rem_1fr] gap-4 py-4"
                  >
                    <span className="font-mono text-[10px] text-faint">
                      {number}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium">{title}</p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                        {copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <ConsolePreview />
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-b border-line bg-surface/45">
          <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 lg:col-span-4">
              <p className="eyebrow">Operating principles</p>
              <h2 className="mt-4 max-w-[11ch] font-display text-4xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-5xl">
                Built for the people on call.
              </h2>
              <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-muted">
                When a message matters, the tooling should make the next step
                obvious — not hide it behind another dashboard.
              </p>
            </div>

            <div className="divide-y divide-line border-t border-line lg:col-span-8">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="grid gap-2 py-6 sm:grid-cols-[16rem_1fr] sm:gap-8"
                >
                  <h3 className="font-display text-xl font-semibold tracking-[-0.025em]">
                    {principle.title}
                  </h3>
                  <p className="max-w-[52ch] text-[13px] leading-relaxed text-muted">
                    {principle.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="ink-panel relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
            <svg
              viewBox="0 0 600 200"
              className="pointer-events-none absolute -right-16 -bottom-10 h-56 w-[34rem] text-white/[0.07]"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 140h100l14-40 20 78 18-62 12 24h90l14-34 18 64 16-46 12 16h100l14-28 18 52 16-38 12 14h100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="relative grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-white/60 uppercase">
                  <Webhook className="size-3.5" />
                  Start here
                </div>
                <h2 className="mt-4 max-w-[13ch] font-display text-4xl leading-[0.98] font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                  Start with one message.
                </h2>
                <p className="mt-4 max-w-[44ch] text-[14px] leading-relaxed text-white/70">
                  Bring a template and a destination. The composer sends the
                  request through your configured providers and records the
                  trace.
                </p>
              </div>

              <div className="flex flex-col gap-2 md:col-span-5 md:items-end">
                <Link
                  href="/composer"
                  className="btn h-12 w-full bg-white px-5 text-ink hover:bg-white/90 md:w-auto"
                >
                  Open the composer
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-10 items-center gap-1.5 text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  See pricing
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quiet closing note */}
        <section className="border-t border-line">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-2 text-[12px] text-muted">
              <ShieldCheck className="size-4 text-ok" />
              Every accepted send is authenticated and recorded.
            </div>
            <div className="flex items-center gap-5 text-[12px] text-faint">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" /> Retries with backoff
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> Idempotency keys enforced
              </span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
