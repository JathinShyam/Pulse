"use client";

import Link from "next/link";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Radio,
  RefreshCw,
  Rocket,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { ConsoleShell } from "@/components/console-shell";
import { useSendNotification, useTemplates } from "@/lib/queries";
import { errorMessage } from "@/lib/api";

export default function ComposerPage() {
  const [activeChannels, setActiveChannels] = useState<{
    apns: boolean;
    fcm: boolean;
    ses: boolean;
    sms: boolean;
  }>({
    apns: true,
    fcm: true,
    ses: true,
    sms: true,
  });

  const [previewMode, setPreviewMode] = useState<"ios" | "android" | "email">(
    "ios",
  );
  const [priority, setPriority] = useState<"high" | "low">("high");
  const [dispatchResult, setDispatchResult] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [templateName, setTemplateName] = useState("test_email");
  const [recipient, setRecipient] = useState("ops-lead@pulse.dev");
  const [userId, setUserId] = useState("secops-admin");
  const [title, setTitle] = useState(
    "Critical Security Alert: Zero-Day Canary",
  );
  const [body, setBody] = useState(
    "Cluster [us-east-1] ingress breach canary triggered at 14:02:18 UTC.",
  );
  const [category, setCategory] = useState("INFRA_SECURITY");

  const sendMutation = useSendNotification();
  const { data: templatesData } = useTemplates();

  const handleChannelToggle = (channel: keyof typeof activeChannels) => {
    setActiveChannels((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  const handleDispatch = async () => {
    setDispatchResult(null);
    setDispatchError(null);

    const idempotencyKey = `idem_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    // Resolve channel to send
    let resolvedChannel: "email" | "sms" | "push" = "email";
    if (activeChannels.apns || activeChannels.fcm) resolvedChannel = "push";
    else if (activeChannels.sms) resolvedChannel = "sms";
    else if (activeChannels.ses) resolvedChannel = "email";

    try {
      const res = await sendMutation.mutateAsync({
        template_name: templateName,
        user_id: userId,
        to: recipient,
        channel: resolvedChannel,
        priority: priority,
        idempotency_key: idempotencyKey,
        title: title,
        context: {
          incident_id: "INC-8891",
          severity: "CRITICAL_P0",
          name: userId,
          subject: title,
          body: body,
        },
      });
      setDispatchResult({ id: res.notification_id, status: res.status });
    } catch (err) {
      setDispatchError(errorMessage(err));
    }
  };

  const jsonPayload = JSON.stringify(
    {
      dispatch_id: `dsp_${Date.now().toString(36)}`,
      urgency: priority === "high" ? "CRITICAL_P0" : "STANDARD_P2",
      notification: {
        title: title,
        body: body,
        badge: 1,
        category: category,
      },
      recipient: recipient,
      target_user: userId,
      channels_enabled: {
        apns_push: activeChannels.apns,
        fcm_android: activeChannels.fcm,
        ses_email: activeChannels.ses,
        direct_sms: activeChannels.sms,
      },
      hmac_digest: "e3b9cd44298f01c149afbf4c0996fb02427ae0...",
    },
    null,
    2,
  );

  return (
    <ConsoleShell activePath="composer">
      <div className="flex flex-col gap-6">
        {/* Top Header / Presets Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2 label-caps text-subtle">
              <span>DISPATCH WORKSPACE</span>
              <span>//</span>
              <span className="text-brand">EVENT COMPOSER</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-1">
              Mission Critical Signal Dispatch Composer
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="label-caps px-2.5 py-1 rounded bg-card border border-line text-white">
              US-EAST-1 [PRIMARY] 38MS
            </span>
            <span className="label-caps px-2.5 py-1 rounded bg-brand/10 border border-brand/30 text-brand">
              SCHEMA VALIDATED v2.4.1
            </span>
            <button
              onClick={() => {
                setTitle("High-Severity Infrastructure Canary Alarm");
                setBody(
                  "Telemetry threshold exceeded: 4,800 errors/sec in edge cluster.",
                );
                setCategory("CRITICAL_OUTAGE");
                setPriority("high");
              }}
              className="px-3 py-1 rounded-full bg-brand/15 hover:bg-brand/25 text-brand border border-brand/40 font-mono text-xs font-semibold transition-colors"
            >
              P0 - Security Preset
            </button>
          </div>
        </div>

        {/* 01 // Active Delivery Channel Mesh */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="label-caps text-subtle">
              01 // ACTIVE DELIVERY CHANNEL MESH
            </span>
            <span className="font-mono text-xs text-brand font-semibold">
              4 OF 5 CHANNELS ENGAGED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Apple APNs */}
            <div
              onClick={() => handleChannelToggle("apns")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeChannels.apns
                  ? "bg-card border-brand/60 shadow-[0_0_20px_rgba(254,88,36,0.15)]"
                  : "bg-surface/50 border-line opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-display font-bold text-sm text-white">
                    Apple APNs
                  </span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    activeChannels.apns
                      ? "bg-brand"
                      : "bg-card border border-line"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      activeChannels.apns ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">HTTP/2 Multiplexed Pipe</p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
                <span className="text-ok font-semibold">99.98% HEALTH</span>
                <span className="text-subtle">18ms</span>
              </div>
            </div>

            {/* Google FCM */}
            <div
              onClick={() => handleChannelToggle("fcm")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeChannels.fcm
                  ? "bg-card border-brand/60 shadow-[0_0_20px_rgba(254,88,36,0.15)]"
                  : "bg-surface/50 border-line opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand">
                  <Bell className="w-4 h-4" />
                  <span className="font-display font-bold text-sm text-white">
                    Google FCM
                  </span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    activeChannels.fcm
                      ? "bg-brand"
                      : "bg-card border border-line"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      activeChannels.fcm ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">HTTP v1 Protocol Async</p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
                <span className="text-ok font-semibold">99.94% HEALTH</span>
                <span className="text-subtle">24ms</span>
              </div>
            </div>

            {/* AWS SES */}
            <div
              onClick={() => handleChannelToggle("ses")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeChannels.ses
                  ? "bg-card border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  : "bg-surface/50 border-line opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Mail className="w-4 h-4" />
                  <span className="font-display font-bold text-sm text-white">
                    AWS SES
                  </span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    activeChannels.ses
                      ? "bg-cyan-400"
                      : "bg-card border border-line"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      activeChannels.ses ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">
                DKIM/SPF High-Throughput
              </p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
                <span className="text-ok font-semibold">99.82% HEALTH</span>
                <span className="text-subtle">128ms</span>
              </div>
            </div>

            {/* Global SMS */}
            <div
              onClick={() => handleChannelToggle("sms")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeChannels.sms
                  ? "bg-card border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                  : "bg-surface/50 border-line opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-display font-bold text-sm text-white">
                    Global SMS
                  </span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    activeChannels.sms
                      ? "bg-purple-400"
                      : "bg-card border border-line"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      activeChannels.sms ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">
                Direct Tier-1 SMPP Trunk
              </p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
                <span className="text-ok font-semibold">99.91% HEALTH</span>
                <span className="text-subtle">850ms</span>
              </div>
            </div>
          </div>
        </section>

        {/* 02 // Scope: Audience Filtering & Blast Radius */}
        <section className="p-5 rounded-2xl bg-card border border-line flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="label-caps text-subtle">02 // SCOPE</span>
              <span className="font-display font-bold text-white text-base">
                Audience Filtering &amp; Blast Radius
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/15 text-brand font-mono text-xs font-semibold">
              <Radio className="w-3.5 h-3.5" />
              <span>128,482 Estimated Devices</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-surface border border-line text-brand">
              tier: enterprise-tier-1{" "}
              <span className="text-subtle ml-1 cursor-pointer">×</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface border border-line text-white">
              region: apac-east + us-east{" "}
              <span className="text-subtle ml-1 cursor-pointer">×</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface border border-line text-white">
              role: secops-admin{" "}
              <span className="text-subtle ml-1 cursor-pointer">×</span>
            </span>
            <button className="px-2.5 py-1 rounded-lg bg-surface hover:bg-card border border-dashed border-line text-muted hover:text-white transition-colors">
              + Filter Group
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-line font-mono text-xs">
            <div>
              <span className="text-subtle label-caps">PRIORITY LEVEL</span>
              <div className="mt-1 flex gap-2">
                <button
                  onClick={() => setPriority("high")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    priority === "high"
                      ? "bg-brand text-pitch shadow-sm"
                      : "bg-surface border border-line text-muted hover:text-white"
                  }`}
                >
                  P0 - Instant Critical
                </button>
                <button
                  onClick={() => setPriority("low")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    priority === "low"
                      ? "bg-card border border-line text-white font-bold"
                      : "bg-surface border border-line text-muted hover:text-white"
                  }`}
                >
                  P2 - Standard
                </button>
              </div>
            </div>

            <div>
              <span className="text-subtle label-caps">TTL RETENTION</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-brand font-bold">1,800s</span>
                <span className="text-subtle text-[11px]">
                  (30 min timeout)
                </span>
              </div>
            </div>

            <div>
              <span className="text-subtle label-caps">RATE THROTTLE</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-white font-bold">25,000 req/s</span>
                <span className="text-ok text-[11px]">(Uncapped Tier)</span>
              </div>
            </div>
          </div>
        </section>

        {/* 03 // Main Grid: Code Payload Editor + Simulation Phone Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Code Form & Payload (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Form Inputs */}
            <div className="p-5 rounded-2xl bg-card border border-line flex flex-col gap-4">
              <span className="label-caps text-brand">SIGNAL PARAMETERS</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-caps text-subtle block mb-1.5">
                    Template Name
                  </label>
                  <select
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-xs font-mono text-white focus:border-brand focus:outline-none"
                  >
                    <option value="test_email">
                      test_email (Email Default)
                    </option>
                    <option value="test_sms">test_sms (SMS OTP)</option>
                    <option value="welcome_email">
                      welcome_email (Onboarding)
                    </option>
                    <option value="security_alert">
                      security_alert (P0 Incident)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="label-caps text-subtle block mb-1.5">
                    Destination Recipient
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="email, phone, or token"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-xs font-mono text-white focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="label-caps text-subtle block mb-1.5">
                  Signal Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-xs font-medium text-white focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="label-caps text-subtle block mb-1.5">
                  Payload Body Message
                </label>
                <textarea
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-xs font-mono text-white focus:border-brand focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Raw JSON Egress Spec */}
            <div className="p-5 rounded-2xl bg-pitch/90 border border-line flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xs">
                    payload_dispatch_v2.json
                  </span>
                  <span className="label-caps text-[9px] px-1.5 py-0.5 rounded bg-card text-subtle">
                    UTF-8
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(jsonPayload);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded bg-card hover:bg-card-hover border border-line text-[11px] text-muted hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-ok" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <span className="label-caps px-2 py-0.5 rounded bg-ok/10 text-ok border border-ok/30">
                    Validated
                  </span>
                </div>
              </div>

              <pre className="text-muted leading-relaxed overflow-x-auto text-[11px] max-h-56">
                {jsonPayload}
              </pre>
            </div>
          </div>

          {/* Right: Phone & Lockscreen Simulation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-card border border-line flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-line pb-4 mb-6">
                <span className="label-caps text-subtle">03 // SIMULATION</span>
                <div className="flex items-center p-1 rounded-full bg-surface border border-line text-xs font-mono">
                  {(["ios", "android", "email"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPreviewMode(m)}
                      className={`px-3 py-0.5 rounded-full capitalize transition-all ${
                        previewMode === m
                          ? "bg-brand text-pitch font-bold shadow-sm"
                          : "text-muted hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Styled iOS Phone Mockup from Stitch Screen 1 */}
              <div className="relative w-72 h-[450px] rounded-[38px] bg-pitch border-4 border-line/80 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
                {/* Dynamic Notch */}
                <div className="mx-auto w-24 h-4 bg-line rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-pitch" />
                </div>

                {/* Lockscreen Clock */}
                <div className="flex flex-col items-center mt-3 font-display">
                  <span className="label-caps text-[10px] text-subtle">
                    TUESDAY, OCT 24
                  </span>
                  <span className="font-extrabold text-4xl text-white tracking-tight mt-0.5">
                    09:41
                  </span>
                </div>

                {/* Glowing Notification Card */}
                <div className="my-auto p-3.5 rounded-2xl bg-card/95 border border-brand/40 shadow-[0_0_30px_rgba(254,88,36,0.18)] backdrop-blur-md flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md bg-brand flex items-center justify-center text-pitch">
                        <Radio className="w-2.5 h-2.5" />
                      </div>
                      <span className="label-caps text-white text-[9px]">
                        PULSE TELEMETRY
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-subtle">
                      now
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-sans font-bold text-xs text-white leading-tight">
                      {title}
                    </span>
                    <span className="font-sans text-[11px] text-muted mt-1 leading-snug line-clamp-3">
                      {body}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-line text-[10px] font-mono text-center">
                    <button className="py-1 rounded bg-brand/20 text-brand font-bold hover:bg-brand/30 transition-colors">
                      Investigate Node
                    </button>
                    <button className="py-1 rounded bg-surface text-muted hover:text-white transition-colors">
                      Acknowledge
                    </button>
                  </div>
                </div>

                {/* Bottom Home Indicator */}
                <div className="mx-auto w-28 h-1 bg-muted/40 rounded-full" />
              </div>

              {/* Hardware Footprint Stats */}
              <div className="w-full mt-6 pt-4 border-t border-line grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-subtle label-caps block">
                    PAYLOAD FOOTPRINT
                  </span>
                  <span className="text-white font-bold">
                    1.42 KB (OPTIMAL)
                  </span>
                </div>
                <div>
                  <span className="text-subtle label-caps block">
                    PROJECTED LATENCY
                  </span>
                  <span className="text-ok font-bold">~34ms E2E</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Alert Banners */}
        {dispatchResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-ok/10 border border-ok/30 flex items-center justify-between text-xs font-mono"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-ok shrink-0" />
              <div>
                <span className="text-ok font-bold">
                  Signal Dispatched to Celery Queue!
                </span>
                <p className="text-fg mt-0.5">
                  Notification ID:{" "}
                  <span className="text-white font-bold">
                    {dispatchResult.id}
                  </span>{" "}
                  • Status:{" "}
                  <span className="text-ok font-bold capitalize">
                    {dispatchResult.status}
                  </span>
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-ok text-pitch font-bold hover:bg-emerald-400 transition-colors"
            >
              View in Feed →
            </Link>
          </motion.div>
        )}

        {dispatchError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-err/10 border border-err/30 flex items-center gap-3 text-xs font-mono text-err"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Dispatch Failed</span>
              <p className="text-fg/80 mt-0.5">{dispatchError}</p>
            </div>
          </motion.div>
        )}

        {/* Bottom Action Bar */}
        <div className="sticky bottom-4 z-40 p-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-line shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-ok" />
            <span className="text-white font-semibold">
              Ready for Dispatch Pipeline
            </span>
            <span className="text-subtle hidden md:inline">
              • Cryptographic nonce seeded
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                alert(
                  "Simulated Dry Run: Payload conforms to schema v2.4. Projected delivery 28ms without error.",
                );
              }}
              className="px-4 py-2.5 rounded-xl bg-surface hover:bg-card border border-line text-xs font-mono text-muted hover:text-white transition-colors"
            >
              Simulate Dry Run [Sandbox]
            </button>

            <button
              onClick={handleDispatch}
              disabled={sendMutation.isPending}
              className="btn-glow flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(254,88,36,0.4)] disabled:opacity-60"
            >
              {sendMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin fill-pitch" />
                  <span>Enqueuing Packet...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 fill-pitch" />
                  <span>Dispatch Signal Immediately</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}
