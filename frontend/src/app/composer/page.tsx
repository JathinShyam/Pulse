"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  KeyRound,
  Loader2,
  MessageSquareText,
  RotateCcw,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { ConsoleShell } from "@/components/console-shell";
import { CopyButton } from "@/components/copy-button";
import { PulseMark } from "@/components/logo";
import { useSendNotification, useTemplates } from "@/lib/queries";
import { errorMessage, errorStatus } from "@/lib/api";
import { channelMeta } from "@/lib/channels";
import { renderPreview } from "@/lib/format";
import type { Channel } from "@/lib/types";
import { cn } from "@/lib/utils";

const CHANNEL_ORDER: Channel[] = ["email", "sms", "push"];

const CHANNEL_DEFAULTS: Record<Channel, string> = {
  email: "ops-lead@pulse.dev",
  sms: "+14155550123",
  push: "demo-device-token",
};

interface TemplateOption {
  name: string;
  subject: string;
  body: string;
  context?: Record<string, string>;
}

const FALLBACK_TEMPLATES: Record<Channel, TemplateOption[]> = {
  email: [
    {
      name: "welcome_email",
      subject: "Welcome to Pulse",
      body: "Hello {name}, welcome aboard. Your first delivery is on us.",
      context: { name: "Alex" },
    },
    {
      name: "invoice_ready",
      subject: "Your invoice is ready",
      body: "Hi {name}, invoice {invoice} is ready to review.",
      context: { name: "Alex", invoice: "INV-1042" },
    },
    {
      name: "weekly_digest",
      subject: "Your weekly digest",
      body: "Here is what happened across your workspace this week, {name}.",
      context: { name: "Alex" },
    },
  ],
  sms: [
    {
      name: "otp_login",
      subject: "",
      body: "Your Pulse verification code is {code}. It expires in 5 minutes.",
      context: { code: "482913" },
    },
  ],
  push: [
    {
      name: "security_alert",
      subject: "Security alert",
      body: "A new sign-in was detected for {name}.",
      context: { name: "Alex" },
    },
    {
      name: "incident_opened",
      subject: "Incident opened",
      body: "Incident {incident} has been opened for {service}.",
      context: { incident: "INC-8891", service: "delivery-api" },
    },
  ],
};

const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.1.0";

function priorityForTemplate(name: string): "high" | "low" {
  return /(otp|verif|2fa)/i.test(name) ? "high" : "low";
}

function sampleContext(
  channel: Channel,
  name?: string,
): Record<string, string> {
  if (!name) return {};
  return (
    FALLBACK_TEMPLATES[channel].find((template) => template.name === name)
      ?.context ?? {}
  );
}

function parseContext(value: string): Record<string, string> | null {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return Object.fromEntries(
      Object.entries(parsed).map(([key, item]) => [key, String(item)]),
    );
  } catch {
    return null;
  }
}

function makeKey() {
  return `idem_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[12px] font-medium text-ink">
        {children}
      </label>
      {hint && <span className="text-[10px] text-faint">{hint}</span>}
    </div>
  );
}

export default function ComposerPage() {
  const ids = useId();
  const [channel, setChannel] = useState<Channel>("email");
  const [templateName, setTemplateName] = useState("");
  const [recipient, setRecipient] = useState(CHANNEL_DEFAULTS.email);
  const [userId, setUserId] = useState("user_9918");
  // Template fields are derived defaults with optional user overrides. This
  // keeps live template data arriving from the API from needing a state-sync
  // effect, and preserves anything typed while templates are loading.
  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const [bodyOverride, setBodyOverride] = useState<string | null>(null);
  const [priorityOverride, setPriorityOverride] = useState<
    "high" | "low" | null
  >(null);
  const [contextOverride, setContextOverride] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [dispatchResult, setDispatchResult] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  const sendMutation = useSendNotification();
  const {
    data: templatesData,
    isPending: templatesPending,
    isError: templatesError,
  } = useTemplates(channel);

  const apiTemplates = useMemo(
    () =>
      templatesData?.results?.filter(
        (template) => template.channel === channel,
      ) ?? [],
    [templatesData, channel],
  );
  // Sample names are never sendable; only fall back when the request failed.
  const usingSampleTemplates = templatesError && !templatesData;
  const templateOptions: TemplateOption[] = useMemo(() => {
    if (apiTemplates.length) {
      return apiTemplates.map((template) => ({
        name: template.name,
        subject: template.subject,
        body: template.body_template,
      }));
    }
    return usingSampleTemplates ? FALLBACK_TEMPLATES[channel] : [];
  }, [apiTemplates, usingSampleTemplates, channel]);
  // Fall back to the first available template until the user picks one.
  const effectiveTemplate =
    templateOptions.find((template) => template.name === templateName) ??
    templateOptions[0];

  const title = titleOverride ?? effectiveTemplate?.subject ?? "";
  const body = bodyOverride ?? effectiveTemplate?.body ?? "";
  const priority =
    priorityOverride ?? priorityForTemplate(effectiveTemplate?.name ?? "");
  const defaultContext = JSON.stringify(
    sampleContext(channel, effectiveTemplate?.name),
    null,
    2,
  );
  const contextJson = contextOverride ?? defaultContext;

  // A per-mount random key avoids the global collisions of a deterministic
  // id. Deferring one tick keeps the server-rendered placeholder stable.
  useEffect(() => {
    const timer = window.setTimeout(() => setIdempotencyKey(makeKey()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const previewContext = useMemo(
    () => parseContext(contextJson) ?? {},
    [contextJson],
  );
  const previewTitle = renderPreview(title, previewContext);
  const previewBody = renderPreview(body, previewContext);

  const requestPreview = JSON.stringify(
    {
      template_name: effectiveTemplate?.name ?? templateName,
      user_id: userId,
      to: recipient,
      channel,
      priority,
      idempotency_key: idempotencyKey || "idem_…",
      subject: title,
      body,
      context: previewContext,
    },
    null,
    2,
  );

  const selectChannel = (next: Channel) => {
    setChannel(next);
    setRecipient((current) =>
      Object.values(CHANNEL_DEFAULTS).includes(current)
        ? CHANNEL_DEFAULTS[next]
        : current,
    );
    // The next channel's templates may still be loading; clearing the name
    // makes the first option the derived default when the query resolves.
    setTemplateName("");
    setTitleOverride(null);
    setBodyOverride(null);
    setPriorityOverride(null);
    setContextOverride(null);
    setDispatchError(null);
    setDispatchResult(null);
  };

  const selectTemplate = (name: string) => {
    setTemplateName(name);
    setTitleOverride(null);
    setBodyOverride(null);
    setPriorityOverride(null);
    setContextOverride(null);
  };

  const reset = () => {
    setChannel("email");
    setTemplateName("");
    setRecipient(CHANNEL_DEFAULTS.email);
    setUserId("user_9918");
    setTitleOverride(null);
    setBodyOverride(null);
    setPriorityOverride(null);
    setContextOverride(null);
    setIdempotencyKey(makeKey());
    setDispatchError(null);
    setDispatchResult(null);
  };

  const handleDispatch = async (event: React.FormEvent) => {
    event.preventDefault();
    setDispatchError(null);
    setDispatchResult(null);

    if (usingSampleTemplates) {
      setDispatchError(
        "Sample templates cannot be sent. Create a live template for this channel first.",
      );
      return;
    }
    if (!effectiveTemplate) {
      setDispatchError(
        templatesPending
          ? "Templates are still loading."
          : "No live template is available for this channel.",
      );
      return;
    }
    if (!recipient.trim()) {
      setDispatchError("Add a recipient before sending.");
      return;
    }
    if (!userId.trim()) {
      setDispatchError("Add a user ID before sending.");
      return;
    }

    let parsed: unknown = {};
    try {
      parsed = contextJson.trim() ? JSON.parse(contextJson) : {};
    } catch {
      setDispatchError("Template variables must be valid JSON.");
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setDispatchError("Template variables must be a JSON object.");
      return;
    }

    const context = Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, String(value)]),
    );
    const requestKey = idempotencyKey || makeKey();
    if (!idempotencyKey) setIdempotencyKey(requestKey);

    try {
      const response = await sendMutation.mutateAsync({
        template_name: effectiveTemplate.name,
        user_id: userId,
        to: recipient,
        channel,
        priority,
        idempotency_key: requestKey,
        subject: title,
        body,
        context,
      });
      setDispatchResult({
        id: response.notification_id,
        status: response.status,
      });
      setIdempotencyKey(makeKey());
    } catch (error) {
      // A 503 means the row was persisted as failed; the same key will keep
      // returning that failed record. Rotate so a later retry can create a
      // fresh dispatch, while ambiguous network errors keep the key.
      if (errorStatus(error) === 503) setIdempotencyKey(makeKey());
      setDispatchError(errorMessage(error));
    }
  };

  const meta = channelMeta(channel);
  const ChannelIcon = meta.icon;
  const pending = sendMutation.isPending;
  const dispatchFailed = dispatchResult?.status === "failed";
  const dispatchDuplicate =
    dispatchResult !== null && dispatchResult.status !== "queued";

  return (
    <ConsoleShell activePath="composer">
      <div className="space-y-7">
        <header className="flex flex-col gap-4 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Composer</p>
            <h1 className="mt-2 font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em] sm:text-[3.2rem]">
              New dispatch
            </h1>
            <p className="mt-3 max-w-[48ch] text-[13px] leading-relaxed text-muted">
              Send one message through one channel, with a trace from the first
              request to the provider acknowledgement.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge border-line bg-surface px-2.5 py-1 text-[9px]">
              Schema v{VERSION}
            </span>
            <button
              type="button"
              onClick={reset}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          </div>
        </header>

        {dispatchResult && (
          <div
            className={cn(
              "reveal flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
              dispatchFailed
                ? "border-err/25 bg-err/[0.04]"
                : "border-ok/30 bg-ok/[0.045]",
            )}
          >
            <div className="flex items-start gap-3">
              {dispatchFailed ? (
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-err" />
              ) : (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok" />
              )}
              <div>
                <p className="text-[13px] font-medium">
                  {dispatchFailed
                    ? "This idempotency key already returned a failed dispatch."
                    : dispatchDuplicate
                      ? "Existing record returned for this idempotency key."
                      : "Notification accepted by the queue."}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">
                  {dispatchResult.id} · {dispatchResult.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-7 sm:pl-0">
              <Link
                href={`/logs?q=${encodeURIComponent(dispatchResult.id)}`}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-ink hover:text-accent-ink"
              >
                View delivery
                <ArrowUpRight className="size-3.5" />
              </Link>
              <CopyButton
                value={dispatchResult.id}
                label="Copy ID"
                className="border border-line bg-surface text-muted hover:text-ink"
              />
            </div>
          </div>
        )}

        {dispatchError && (
          <div
            role="alert"
            className="reveal flex items-start gap-3 rounded-xl border border-err/25 bg-err/[0.04] p-4"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-err" />
            <div>
              <p className="text-[13px] font-medium">
                The dispatch did not complete.
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                {dispatchError}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleDispatch}
          className="grid items-start gap-6 lg:grid-cols-12"
        >
          <div className="space-y-6 lg:col-span-7">
            {/* Channel */}
            <section className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-[14px] font-semibold">Channel</h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    One channel per request.
                  </p>
                </div>
                <ChannelIcon className="size-4 text-faint" />
              </div>
              <div
                role="radiogroup"
                aria-label="Delivery channel"
                className="grid grid-cols-3 gap-2 p-4 sm:p-5"
              >
                {CHANNEL_ORDER.map((key) => {
                  const item = channelMeta(key);
                  const Icon = item.icon;
                  const selected = channel === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectChannel(key)}
                      className={cn(
                        "relative rounded-xl border p-3 text-left transition-colors sm:p-3.5",
                        selected
                          ? "border-ink bg-surface"
                          : "border-line bg-surface/60 hover:border-line-strong",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Icon
                          className={cn(
                            "size-4",
                            selected ? "text-ink" : "text-faint",
                          )}
                        />
                        <span
                          className={cn(
                            "flex size-4 items-center justify-center rounded-full border",
                            selected
                              ? "border-accent bg-accent text-white"
                              : "border-line-strong bg-surface",
                          )}
                        >
                          {selected && <Check className="size-2.5" />}
                        </span>
                      </div>
                      <p className="mt-3 text-[12px] font-medium">
                        {item.label}
                      </p>
                      <p className="mt-0.5 hidden font-mono text-[9px] tracking-[0.04em] text-faint uppercase sm:block">
                        {item.provider}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Message */}
            <section className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
                <h2 className="text-[14px] font-semibold">Message</h2>
                <span className="font-mono text-[10px] text-faint">
                  {usingSampleTemplates
                    ? "Sample templates"
                    : templatesPending
                      ? "Loading templates"
                      : templateOptions.length
                        ? meta.provider
                        : "No live templates"}
                </span>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {usingSampleTemplates && (
                  <div className="sm:col-span-2 rounded-lg border border-warn/30 bg-warn/[0.05] px-3 py-2.5 text-[11px] leading-relaxed text-muted">
                    Live templates could not be loaded for {meta.label}, so
                    sample templates are shown. Sending is disabled until the
                    API returns a real template.
                  </div>
                )}
                {!templatesPending &&
                  !usingSampleTemplates &&
                  templateOptions.length === 0 && (
                    <div className="sm:col-span-2 rounded-lg border border-line bg-surface-2/60 px-3 py-2.5 text-[11px] leading-relaxed text-muted">
                      No live templates are available for {meta.label}. Create
                      one through the API or Django admin before sending.
                    </div>
                  )}
                <div>
                  <FieldLabel htmlFor={`${ids}-template`} hint="Required">
                    Template
                  </FieldLabel>
                  <div className="relative">
                    <select
                      id={`${ids}-template`}
                      value={effectiveTemplate?.name ?? ""}
                      onChange={(event) => selectTemplate(event.target.value)}
                      className="select pr-9 appearance-none"
                    >
                      {templateOptions.length === 0 && (
                        <option value="">
                          {templatesPending
                            ? "Loading templates…"
                            : "No live templates"}
                        </option>
                      )}
                      {templateOptions.map((template) => (
                        <option key={template.name} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-faint" />
                  </div>
                </div>

                <div>
                  <FieldLabel
                    htmlFor={`${ids}-recipient`}
                    hint={
                      channel === "email"
                        ? "Email address"
                        : channel === "sms"
                          ? "E.164 phone"
                          : "Device token"
                    }
                  >
                    Recipient
                  </FieldLabel>
                  <input
                    id={`${ids}-recipient`}
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    placeholder={CHANNEL_DEFAULTS[channel]}
                    className="input font-mono text-[12px]"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`${ids}-user`} hint="Internal ID">
                    User
                  </FieldLabel>
                  <input
                    id={`${ids}-user`}
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="user_9918"
                    className="input font-mono text-[12px]"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`${ids}-priority`} hint="Queue">
                    Priority
                  </FieldLabel>
                  <div
                    id={`${ids}-priority`}
                    className="grid h-11 grid-cols-2 rounded-lg border border-line bg-surface p-0.5"
                  >
                    {(["high", "low"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPriorityOverride(value)}
                        aria-pressed={priority === value}
                        className={cn(
                          "rounded-md text-[11px] font-medium capitalize transition-colors",
                          priority === value
                            ? "bg-ink text-white"
                            : "text-muted hover:text-ink",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel
                    htmlFor={`${ids}-title`}
                    hint="Push title / subject"
                  >
                    Title
                  </FieldLabel>
                  <input
                    id={`${ids}-title`}
                    value={title}
                    onChange={(event) => setTitleOverride(event.target.value)}
                    placeholder="Template subject"
                    className="input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel htmlFor={`${ids}-body`} hint="Plain text">
                    Body
                  </FieldLabel>
                  <textarea
                    id={`${ids}-body`}
                    value={body}
                    onChange={(event) => setBodyOverride(event.target.value)}
                    placeholder="Template body"
                    className="textarea min-h-24"
                  />
                </div>
              </div>
            </section>

            {/* Advanced */}
            <details className="panel group overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 outline-none sm:px-6">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="size-4 text-faint" />
                  <div>
                    <p className="text-[13px] font-medium">
                      Template variables
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      Optional JSON passed to the template renderer.
                    </p>
                  </div>
                </div>
                <ChevronDown className="size-4 text-faint transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-line p-5 sm:p-6">
                <textarea
                  value={contextJson}
                  onChange={(event) => setContextOverride(event.target.value)}
                  spellCheck={false}
                  aria-label="Template variables JSON"
                  className="textarea min-h-36 font-mono text-[11px] leading-relaxed"
                />
                <p className="mt-2 text-[11px] leading-relaxed text-faint">
                  Values are stringified before sending. The preview substitutes
                  simple placeholders; the API renders the real request with the
                  same variables and rejects unknown ones.
                </p>
              </div>
            </details>
          </div>

          {/* Preview rail */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
            <section className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
                <h2 className="text-[13px] font-semibold">Preview</h2>
                <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.08em] text-faint uppercase">
                  <span className="dot" style={{ background: meta.color }} />
                  {meta.label}
                </span>
              </div>

              <div className="bg-surface-2/70 p-4 sm:p-5">
                {channel === "email" && (
                  <div className="overflow-hidden rounded-xl border border-line bg-surface">
                    <div className="border-b border-line px-4 py-3">
                      <div className="flex items-center gap-2">
                        <PulseMark className="size-4 text-accent" />
                        <span className="font-display text-[13px] font-semibold">
                          Pulse
                        </span>
                        <span className="ml-auto font-mono text-[9px] text-faint">
                          now
                        </span>
                      </div>
                      <p className="mt-3 text-[11px] text-muted">
                        Pulse &lt;DEFAULT_FROM_EMAIL&gt;
                      </p>
                      <p className="mt-0.5 text-[13px] font-medium">
                        {previewTitle || "Your subject line"}
                      </p>
                    </div>
                    <div className="px-4 py-4">
                      <p className="text-[12px] leading-relaxed whitespace-pre-line text-muted">
                        {previewBody || "Your message body will appear here."}
                      </p>
                      <div className="mt-4 border-t border-line pt-3 text-[10px] text-faint">
                        Sent by Pulse
                      </div>
                    </div>
                  </div>
                )}

                {channel === "push" && (
                  <div className="rounded-xl bg-ink p-3 shadow-[0_18px_40px_-24px_rgba(23,24,22,0.55)]">
                    <div className="flex items-center justify-between px-1 pb-2 font-mono text-[9px] text-white/60">
                      <span>now</span>
                      <span className="flex items-center gap-1">
                        <span className="dot bg-accent" /> Pulse
                      </span>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3">
                      <div className="flex items-start gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-white">
                          <PulseMark className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-medium text-white/90">
                            {previewTitle || "Notification title"}
                          </p>
                          <p className="mt-0.5 line-clamp-3 text-[11px] leading-relaxed text-white/60">
                            {previewBody ||
                              "Your message body will appear here."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="px-1 pt-2 text-right font-mono text-[9px] text-white/55">
                      Push · {priority} priority
                    </p>
                  </div>
                )}

                {channel === "sms" && (
                  <div className="rounded-xl border border-line bg-surface p-4">
                    <div className="flex items-center gap-2 border-b border-line pb-3">
                      <span className="flex size-7 items-center justify-center rounded-full border border-line bg-surface-2">
                        <MessageSquareText className="size-3.5 text-faint" />
                      </span>
                      <div>
                        <p className="text-[11px] font-medium">Pulse</p>
                        <p className="font-mono text-[9px] text-faint">
                          {recipient || "+1 ••• ••• ••••"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[12px] leading-relaxed text-white">
                        {previewBody || "Your message body will appear here."}
                      </div>
                    </div>
                    <p className="mt-3 text-right font-mono text-[9px] text-faint">
                      SMS · via Twilio
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-line px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="label">Idempotency key</span>
                  <div className="flex items-center gap-1">
                    <span className="max-w-40 truncate font-mono text-[10px] text-muted">
                      {idempotencyKey || "generating…"}
                    </span>
                    {idempotencyKey && (
                      <CopyButton
                        value={idempotencyKey}
                        label=""
                        className="px-1.5 py-1 text-faint hover:text-ink"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="label">Request</span>
                  <span className="font-mono text-[10px] text-muted">
                    {channel.toUpperCase()} · {priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="border-t border-line p-4">
                <button
                  type="submit"
                  disabled={
                    pending ||
                    templatesPending ||
                    usingSampleTemplates ||
                    !effectiveTemplate
                  }
                  className="btn btn-primary w-full"
                >
                  {pending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  {pending ? "Dispatching…" : "Send notification"}
                </button>
                <p className="mt-2.5 text-center text-[10px] leading-relaxed text-faint">
                  {usingSampleTemplates
                    ? "Sample templates cannot be sent. Create a live template for this channel first."
                    : templatesPending
                      ? "Loading live templates for this channel."
                      : !effectiveTemplate
                        ? "No live template is available for this channel."
                        : "The request is validated and persisted before it is queued."}
                </p>
              </div>
            </section>

            <details className="panel group overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-2 text-[12px] font-medium">
                  <KeyRound className="size-3.5 text-faint" />
                  Request preview
                </span>
                <div className="flex items-center gap-2">
                  <CopyButton
                    value={requestPreview}
                    label="Copy JSON"
                    className="text-faint hover:text-ink"
                  />
                  <ChevronDown className="size-3.5 text-faint transition-transform group-open:rotate-180" />
                </div>
              </summary>
              <pre className="max-h-72 overflow-auto border-t border-line bg-ink p-4 font-mono text-[10px] leading-relaxed text-white/65">
                {requestPreview}
              </pre>
            </details>
          </div>
        </form>
      </div>
    </ConsoleShell>
  );
}
