"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Radio,
  Rocket,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<
    "curl" | "python" | "typescript" | "go"
  >("typescript");
  const [activeChannelSim, setActiveChannelSim] = useState<
    "push" | "email" | "sms"
  >("push");
  const [tickerLatency, setTickerLatency] = useState(41.8);

  // Subtle real-time fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerLatency(
        (prev) => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1),
      );
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const codeSnippets = {
    typescript: `import { PulseClient } from "@pulse/telemetry";

const pulse = new PulseClient({
  apiKey: process.env.PULSE_API_KEY,
  cluster: "us-east-1",
});

// Deterministic multi-channel cascading dispatch
const dispatch = await pulse.notifications.send({
  template_name: "security_alert",
  user_id: "usr_9918xfa",
  to: "+14155550123",
  channel: "sms",
  priority: "high",
  context: {
    incident_id: "INC-8891",
    severity: "CRITICAL_P0",
    cluster: "edge-us-east",
  },
  idempotency_key: "idem_8820f18aa0",
});

console.log("Packet dispatched:", dispatch.notification_id);`,

    curl: `curl -X POST https://api.pulse.dev/v1/notifications/send/ \\
  -H "X-API-Key: $PULSE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_name": "security_alert",
    "user_id": "usr_9918xfa",
    "to": "+14155550123",
    "channel": "sms",
    "priority": "high",
    "context": {
      "incident_id": "INC-8891",
      "severity": "CRITICAL_P0"
    },
    "idempotency_key": "idem_8820f18aa0"
  }'`,

    python: `from pulse import PulseClient

client = PulseClient(api_key="your-api-key")

response = client.notifications.send(
    template_name="security_alert",
    user_id="usr_9918xfa",
    to="ops@company.internal",
    channel="email",
    priority="high",
    context={
        "incident_id": "INC-8891",
        "severity": "CRITICAL_P0",
    },
    idempotency_key="idem_8820f18aa0",
)
print("Queued:", response.notification_id)`,

    go: `package main

import (
  "context"
  "fmt"
  "github.com/pulse-telemetry/pulse-go"
)

func main() {
  client := pulse.NewClient("pulse_key_sec99")
  res, err := client.Send(context.Background(), &pulse.SendRequest{
    TemplateName:   "security_alert",
    UserID:         "usr_9918xfa",
    To:             "+14155550123",
    Channel:        pulse.ChannelSMS,
    Priority:       pulse.PriorityHigh,
    IdempotencyKey: "idem_8820f18aa0",
  })
  if err != nil {
    panic(err)
  }
  fmt.Printf("Signal Queued: %s\\n", res.NotificationID)
}`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-pitch text-fg font-sans selection:bg-brand selection:text-white overflow-x-hidden">
      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand/[0.08] blur-[180px] pointer-events-none -z-10 rounded-full" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/[0.03] blur-[200px] pointer-events-none -z-10 rounded-full" />
      <div className="fixed bottom-0 -left-40 w-[600px] h-[600px] bg-brand/[0.04] blur-[180px] pointer-events-none -z-10 rounded-full" />

      {/* 1. Announcement Top Bar */}
      <div className="w-full border-b border-line/60 bg-surface/80 backdrop-blur text-[11px] font-mono py-2 px-4 sm:px-8 flex items-center justify-between text-muted">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/15 text-brand font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
            v2.4 TELEMETRY CORE
          </span>
          <span className="hidden md:inline text-subtle">|</span>
          <span className="hidden md:inline text-fg/80">
            Dispatched 14.8M notifications across 194 countries past 24h
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-fg/90">
            <span className="w-2 h-2 rounded-full bg-ok" />
            GLOBAL CLUSTER ACTIVE ({tickerLatency}ms)
          </span>
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1 text-brand hover:text-brand-bright transition-colors font-medium underline decoration-brand/40 underline-offset-4"
          >
            Console Live →
          </Link>
        </div>
      </div>

      {/* 2. Phenomenon Studio Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-pitch/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-card to-card-hover border border-white/10 flex items-center justify-center text-brand group-hover:scale-105 group-hover:border-brand/50 transition-all shadow-[0_0_20px_rgba(254,88,36,0.25)]">
              <Radio className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                PULSE
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              </span>
              <span className="font-mono text-[9px] tracking-widest text-subtle uppercase -mt-0.5">
                Telemetry Engine
              </span>
            </div>
          </Link>

          {/* Navigation Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-card/90 border border-white/10 px-4 py-1.5 rounded-full shadow-inner text-xs font-medium">
            <a
              href="#features"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#architecture"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Architecture
            </a>
            <Link
              href="/gateways"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Gateways
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/logs"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Telemetry Stream
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full border border-line text-xs font-medium text-muted hover:text-white hover:border-white/20 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Rapid Dispatch Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-white/10 shadow-[0_0_20px_rgba(254,88,36,0.15)] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="label-caps text-brand">
            RAPID DISPATCH ORCHESTRATION
          </span>
          <span className="text-subtle">|</span>
          <span className="font-mono text-xs text-muted">
            ZERO DROP PACKET GUARANTEE
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight max-w-5xl leading-[1.08] text-white"
        >
          The Notification Engine for{" "}
          <span className="text-brand drop-shadow-[0_0_35px_rgba(254,88,36,0.6)]">
            Mission-Critical
          </span>{" "}
          Telemetry.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-muted max-w-3xl font-normal leading-relaxed"
        >
          Engineered for mission-critical reliability, high-throughput SMS, and
          responsive multi-region push notifications with sub-20ms latency,
          zero-loss delivery, and automated cryptographic traces.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/composer"
            className="btn-glow px-8 py-4 rounded-full bg-brand hover:bg-brand-bright text-pitch font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-[0_0_30px_rgba(254,88,36,0.45)]"
          >
            <Rocket className="w-4 h-4 fill-pitch" />
            <span>Deploy Signal Free</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-4 rounded-full bg-card hover:bg-card-hover border border-line text-fg text-sm font-semibold flex items-center gap-2 transition-all hover:border-white/20"
          >
            <Activity className="w-4 h-4 text-brand" />
            <span>Live Analytics</span>
          </Link>
        </motion.div>

        {/* 4 Hero Counters (Stitch KPI Block) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-card/60 border border-white/5 backdrop-blur-xl"
        >
          <div className="p-4 flex flex-col items-center text-center">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              &lt;4.8<span className="text-brand text-2xl">ms</span>
            </span>
            <span className="label-caps text-subtle mt-1.5">
              P99 DISPATCH LATENCY
            </span>
            <span className="font-mono text-[11px] text-ok mt-0.5">
              EDGE-ROUTED 0-RTT
            </span>
          </div>
          <div className="p-4 flex flex-col items-center text-center border-l border-white/5">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              99.992<span className="text-brand text-2xl">%</span>
            </span>
            <span className="label-caps text-subtle mt-1.5">
              GLOBAL DELIVERABILITY
            </span>
            <span className="font-mono text-[11px] text-ok mt-0.5">
              SLA VERIFIED
            </span>
          </div>
          <div className="p-4 flex flex-col items-center text-center border-t sm:border-t-0 sm:border-l border-white/5">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              2.4M<span className="text-brand text-2xl">+</span>
            </span>
            <span className="label-caps text-subtle mt-1.5">PEAK CAPACITY</span>
            <span className="font-mono text-[11px] text-brand mt-0.5">
              MSGS / SECOND
            </span>
          </div>
          <div className="p-4 flex flex-col items-center text-center border-t sm:border-t-0 border-l border-white/5">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              194<span className="text-brand text-2xl"> countries</span>
            </span>
            <span className="label-caps text-subtle mt-1.5">
              CARRIER REDUNDANCY
            </span>
            <span className="font-mono text-[11px] text-ok mt-0.5">
              DIRECT SMPP + APNS
            </span>
          </div>
        </motion.div>

        {/* 4. Interactive Live Architecture / Protocol Simulator */}
        <motion.div
          id="architecture"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 w-full ph-card p-6 sm:p-8 rounded-3xl overflow-hidden shadow-2xl text-left"
        >
          {/* Top Window Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-err/80" />
                <span className="w-3 h-3 rounded-full bg-warn/80" />
                <span className="w-3 h-3 rounded-full bg-ok/80" />
              </div>
              <span className="font-mono text-xs text-muted">
                Universal Notification Dispatch Protocol (UNDP/v2.4)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="label-caps px-2.5 py-1 rounded bg-brand/10 border border-brand/30 text-brand">
                ACTIVE TRACE MESH
              </span>
              <span className="label-caps px-2.5 py-1 rounded bg-ok/10 border border-ok/30 text-ok">
                SOCKET CONNECTED
              </span>
            </div>
          </div>

          {/* Interactive Simulation Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Input Payload Box */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-pitch/90 border border-line flex flex-col gap-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-brand font-bold text-[11px]">
                  DISPATCH INGRESS PAYLOAD
                </span>
                <span className="text-ok text-[11px]">VALIDATED</span>
              </div>
              <pre className="text-muted leading-relaxed overflow-x-auto">
                {`{
  "dispatch_id": "dsp_09a8x00f89e",
  "urgency": "CRITICAL_P0",
  "notification": {
    "title": "System Surge Warning",
    "body": "Ingress breach canary triggered",
    "category": "INFRA_SECURITY"
  },
  "channel_matrix": {
    "apple_apns": true,
    "google_fcm": true,
    "aws_ses": true,
    "direct_sms": true
  },
  "idempotency_key": "pulse_trace_881a"
}`}
              </pre>
              <div className="flex gap-2 pt-2 border-t border-line">
                <button
                  onClick={() => setActiveChannelSim("push")}
                  className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
                    activeChannelSim === "push"
                      ? "bg-brand text-pitch font-bold"
                      : "bg-card text-muted hover:text-white"
                  }`}
                >
                  Simulate Push
                </button>
                <button
                  onClick={() => setActiveChannelSim("email")}
                  className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
                    activeChannelSim === "email"
                      ? "bg-cyan-400 text-pitch font-bold"
                      : "bg-card text-muted hover:text-white"
                  }`}
                >
                  Simulate Email
                </button>
                <button
                  onClick={() => setActiveChannelSim("sms")}
                  className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
                    activeChannelSim === "sms"
                      ? "bg-purple-400 text-pitch font-bold"
                      : "bg-card text-muted hover:text-white"
                  }`}
                >
                  Simulate SMS
                </button>
              </div>
            </div>

            {/* Center: Circuit Mesh Router */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-4">
              <div className="relative w-20 h-20 rounded-2xl bg-card border border-brand/50 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(254,88,36,0.3)]">
                <Radio className="w-8 h-8 text-brand animate-pulse" />
                <span className="font-mono text-[9px] text-white font-bold mt-1">
                  ROUTER
                </span>
              </div>
              <span className="font-mono text-[10px] text-brand font-semibold mt-2">
                0-RTT Egress
              </span>
            </div>

            {/* Right: Egress Gateways Live List */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* APNs */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  activeChannelSim === "push"
                    ? "bg-brand/10 border-brand shadow-[0_0_20px_rgba(254,88,36,0.2)]"
                    : "bg-card border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-brand" />
                    <span className="font-display font-bold text-sm text-white">
                      Apple APNs (HTTP/2)
                    </span>
                  </div>
                  <span className="font-mono text-xs text-ok font-semibold">
                    22ms • 99.99%
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Multiplexed binary stream with silent wakeup hooks
                </p>
              </div>

              {/* FCM */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  activeChannelSim === "push"
                    ? "bg-brand/10 border-brand shadow-[0_0_20px_rgba(254,88,36,0.2)]"
                    : "bg-card border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-brand" />
                    <span className="font-display font-bold text-sm text-white">
                      Google FCM (v1 API)
                    </span>
                  </div>
                  <span className="font-mono text-xs text-ok font-semibold">
                    19ms • 99.98%
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  OAuth2 token pooled dispatch with instant delivery receipts
                </p>
              </div>

              {/* SES */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  activeChannelSim === "email"
                    ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-card border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span className="font-display font-bold text-sm text-white">
                      AWS SES (TLS Multi-IP)
                    </span>
                  </div>
                  <span className="font-mono text-xs text-cyan-400 font-semibold">
                    41ms • 99.95%
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Dedicated IP warmup rotation & automated bounce parsing
                </p>
              </div>

              {/* SMS */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  activeChannelSim === "sms"
                    ? "bg-purple-500/10 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    : "bg-card border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span className="font-display font-bold text-sm text-white">
                      Carrier Direct SMPP
                    </span>
                  </div>
                  <span className="font-mono text-xs text-purple-400 font-semibold">
                    68ms • 99.91%
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Tier-1 telecommunication trunks with dynamic DLR webhook audit
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. Protocol Marquee */}
      <div className="w-full py-8 border-y border-line/60 bg-surface/40 overflow-hidden">
        <div className="flex gap-12 items-center justify-around text-muted font-mono text-xs tracking-wider uppercase opacity-75">
          <span className="flex items-center gap-2 text-white">
            <Radio className="w-4 h-4 text-brand" /> APPLE APNS HTTP/2
          </span>
          <span className="flex items-center gap-2 text-white">
            <Zap className="w-4 h-4 text-brand" /> GOOGLE FCM PROTOCOL
          </span>
          <span className="flex items-center gap-2 text-white">
            <Mail className="w-4 h-4 text-cyan-400" /> AWS SES HIGH-THROUGHPUT
          </span>
          <span className="flex items-center gap-2 text-white">
            <MessageSquare className="w-4 h-4 text-purple-400" /> CARRIER SMPP
            DIRECT
          </span>
          <span className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-4 h-4 text-ok" /> QUIC 0-RTT SECURITY
          </span>
        </div>
      </div>

      {/* 6. Multi-Channel Bento Grid Features */}
      <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="label-caps text-brand">MULTI-CHANNEL ENGINE</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mt-3">
            Engineered for Resilient Multi-Channel Delivery
          </h2>
          <p className="text-muted mt-4 text-base">
            Failover automatically across protocols. If push is unacknowledged
            within 800ms, Pulse cascades to SMS and high-priority email without
            duplicating user payloads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Card */}
          <div className="ph-card ph-card-hover p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <span className="label-caps text-cyan-400">
                PROTOCOL: SMTP / SES
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-2">
                Email Delivery Engine
              </h3>
              <p className="text-muted text-sm mt-3 leading-relaxed">
                Clean IP pools with automatic reputation warmup, DKIM/SPF
                auto-signing, and asynchronous bounce classification with
                webhook event dispatch.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-fg/90">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" /> Automated
                  DKIM/DMARC validation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" /> Granular recipient
                  suppression lists
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" /> Sub-50ms TLS
                  handshakes
                </li>
              </ul>
            </div>
            <Link
              href="/composer"
              className="mt-8 text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              Compose Test Email <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SMS Card */}
          <div className="ph-card ph-card-hover p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="label-caps text-purple-400">
                PROTOCOL: TIER-1 SMPP
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-2">
                Global SMS Gateway
              </h3>
              <p className="text-muted text-sm mt-3 leading-relaxed">
                Direct connections to tier-1 mobile aggregators worldwide.
                Automatic carrier routing, OTP shortcode optimization, and
                localized sender ID failover.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-fg/90">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400" /> 194 countries
                  with localized routing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400" /> Two-way SMS
                  inbound listener webhooks
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400" /> Real-time
                  delivery receipts (DLR)
                </li>
              </ul>
            </div>
            <Link
              href="/composer"
              className="mt-8 text-xs font-mono text-purple-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              Compose Test SMS <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Push Card */}
          <div className="ph-card ph-card-hover p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <span className="label-caps text-brand">
                PROTOCOL: APNS & FCM V1
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-2">
                Push Infrastructure
              </h3>
              <p className="text-muted text-sm mt-3 leading-relaxed">
                Direct HTTP/2 binary pipes for iOS and Web push with device
                token lifecycle rotation and silent data payload
                synchronization.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-fg/90">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand" /> HTTP/2 connection
                  multiplexing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand" /> Bad device token
                  auto-pruning
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand" /> Zero-payload silent
                  notifications
                </li>
              </ul>
            </div>
            <Link
              href="/composer"
              className="mt-8 text-xs font-mono text-brand hover:text-white flex items-center gap-1.5 transition-colors"
            >
              Compose Test Push <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Unified API & Code Showcase */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="ph-card p-8 sm:p-12 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-5">
              <span className="label-caps text-brand">DEVELOPER API</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">
                One Unified API. Deterministic Multi-Channel Cascading.
              </h2>
              <p className="text-muted text-sm mt-4 leading-relaxed">
                Never write custom provider retry loops again. Send a single
                JSON request and Pulse coordinates delivery, exponential backoff
                retries, and fallback channels with full cryptographic
                traceability.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-card border border-line flex items-center justify-center text-brand shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      Universal SDK Bindings
                    </h4>
                    <p className="text-muted text-xs mt-0.5">
                      First-class libraries for TypeScript, Python, Go, Rust,
                      and standard cURL endpoints.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-card border border-line flex items-center justify-center text-brand shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      Idempotency & Deduplication
                    </h4>
                    <p className="text-muted text-xs mt-0.5">
                      Built-in Redis & PostgreSQL atomic idempotency keys
                      eliminate duplicate notifications on client retries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-card border border-line flex items-center justify-center text-brand shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      Priority Routing Queues
                    </h4>
                    <p className="text-muted text-xs mt-0.5">
                      Separate Celery priority queues guarantee transactional
                      OTPs never queue behind marketing batches.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Code Block */}
            <div className="lg:col-span-7 bg-pitch/90 rounded-2xl border border-line p-5 shadow-2xl">
              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  {(["typescript", "python", "curl", "go"] as const).map(
                    (lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                          selectedLanguage === lang
                            ? "bg-brand text-pitch font-bold shadow-sm"
                            : "text-muted hover:text-white"
                        }`}
                      >
                        {lang === "typescript"
                          ? "TypeScript"
                          : lang === "curl"
                            ? "cURL"
                            : lang.toUpperCase()}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-muted hover:text-white bg-card border border-line transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-ok" />
                      <span className="text-ok">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Viewer */}
              <div className="font-mono text-xs text-fg/90 overflow-x-auto leading-relaxed">
                <pre>{codeSnippets[selectedLanguage]}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Predictable Latency & Benchmarks */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-caps text-brand">BENCHMARK SLA</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mt-3">
            Engineered for Extreme Latency Predictability
          </h2>
          <p className="text-muted mt-3 text-sm">
            Sub-50ms transit across global nodes with zero dropped frames.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-card border border-line flex flex-col justify-between">
            <div>
              <span className="label-caps text-subtle">P50 EDGE TRANSIT</span>
              <div className="font-display font-extrabold text-4xl text-white mt-2">
                21.0<span className="text-brand text-2xl">ms</span>
              </div>
              <p className="text-muted text-xs mt-3">
                Direct edge TLS terminations routing payloads through high-speed
                internal backbone relays.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between font-mono text-[11px] pt-4 border-t border-line">
              <span className="text-muted">Target: &lt;50ms</span>
              <span className="text-ok font-semibold">OPTIMAL</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-line flex flex-col justify-between">
            <div>
              <span className="label-caps text-subtle">ERROR & LOSS RATE</span>
              <div className="font-display font-extrabold text-4xl text-white mt-2">
                0.01<span className="text-brand text-2xl">%</span>
              </div>
              <p className="text-muted text-xs mt-3">
                Zero packet drop architecture. Automated instant retry queuing
                with exponential backoff algorithm.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between font-mono text-[11px] pt-4 border-t border-line">
              <span className="text-muted">Max Loss: 0.10%</span>
              <span className="text-ok font-semibold">VERIFIED</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-line flex flex-col justify-between">
            <div>
              <span className="label-caps text-subtle">
                GLOBAL AVAILABILITY
              </span>
              <div className="font-display font-extrabold text-4xl text-white mt-2">
                99.99<span className="text-brand text-2xl">%</span>
              </div>
              <p className="text-muted text-xs mt-3">
                Multi-region Kubernetes deployment with Postgres replica
                clustering and Redis sentinel failover.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between font-mono text-[11px] pt-4 border-t border-line">
              <span className="text-muted">Baseline: 99.90%</span>
              <span className="text-ok font-semibold">COMPLIANT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative ph-card p-10 sm:p-16 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-brand/15 blur-3xl pointer-events-none" />
          <div className="max-w-xl z-10 text-left">
            <span className="label-caps text-brand">GET STARTED TODAY</span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mt-2 leading-tight">
              Ready to scale mission-critical dispatch?
            </h2>
            <p className="text-muted text-sm mt-3">
              Deploy your first notification in under two minutes with our SDK
              or live dispatch console.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 z-10">
            <Link
              href="/composer"
              className="btn-glow px-8 py-4 rounded-full bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(254,88,36,0.5)] transition-all"
            >
              <span>Launch Composer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="px-7 py-4 rounded-full bg-card hover:bg-card-hover border border-line text-white font-medium text-xs flex items-center justify-center transition-all"
            >
              <span>Explore Metrics</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Editorial Footer */}
      <footer className="border-t border-line/60 bg-surface/40 py-16 px-6 sm:px-12 text-xs font-mono text-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand" />
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                PULSE
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-card border border-line text-brand">
                v2.4
              </span>
            </div>
            <p className="text-subtle text-xs leading-relaxed max-w-sm font-sans">
              High-velocity notification engine and background job orchestration
              for mission-critical telemetry, distributed across Tier-1 carriers
              and edge clusters.
            </p>
            <div className="flex items-center gap-2 text-ok text-[11px]">
              <span className="w-2 h-2 rounded-full bg-ok" />
              <span>All Systems Operational (99.992% SLA)</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-muted">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Telemetry Console
                </Link>
              </li>
              <li>
                <Link
                  href="/composer"
                  className="hover:text-white transition-colors"
                >
                  Dispatch Composer
                </Link>
              </li>
              <li>
                <Link
                  href="/gateways"
                  className="hover:text-white transition-colors"
                >
                  Routing Mesh
                </Link>
              </li>
              <li>
                <Link
                  href="/logs"
                  className="hover:text-white transition-colors"
                >
                  Egress Stream
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Developers
            </h4>
            <ul className="space-y-2 text-muted">
              <li>
                <a
                  href="#architecture"
                  className="hover:text-white transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  SLA Tiers
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:8000/api/docs/"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  Swagger OpenAPI
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5555"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  Flower Tasks
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Compliance
            </h4>
            <ul className="space-y-2 text-muted">
              <li>SOC2 Type II</li>
              <li>ISO 27001</li>
              <li>HIPAA BAA</li>
              <li>GDPR Compliant</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-subtle text-[11px]">
          <span>
            © 2026 Pulse Telemetry Infrastructure Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <span className="hover:text-muted cursor-pointer">
              Security Protocol
            </span>
            <span>•</span>
            <span className="hover:text-muted cursor-pointer">
              Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-muted cursor-pointer">
              Terms of Dispatch
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
