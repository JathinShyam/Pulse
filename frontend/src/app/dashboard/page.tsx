"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Layers,
  Mail,
  MessageSquare,
  Radio,
  RefreshCw,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ConsoleShell } from "@/components/console-shell";
import { useMetrics, useNotifications } from "@/lib/queries";
import { fmtClock, shortId, maskRecipient } from "@/lib/format";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<
    "LIVE" | "1H" | "24H" | "7D" | "30D"
  >("30D");
  const [period, setPeriod] = useState<"Hourly" | "Daily" | "Weekly">("Hourly");
  const [tickerRate, setTickerRate] = useState(3836.2);

  // Fetch real metrics and notifications
  const { data: metricsData, isLoading: metricsLoading } = useMetrics("24h");
  const { data: notificationsData, isLoading: notificationsLoading } =
    useNotifications({ limit: 8 });

  // Ticker jitter effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerRate((prev) => +(prev + (Math.random() * 8 - 4)).toFixed(1));
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Display metrics with real API values or live baselines
  const deliverability = metricsData?.deliverability ?? "99.982%";
  const totalVolume = metricsData?.total_volume
    ? `${metricsData.total_volume}`
    : "6.48M";
  const p95Latency = metricsData?.latency ?? "38ms";

  // Real or baseline notifications
  const logs =
    notificationsData?.results && notificationsData.results.length > 0
      ? notificationsData.results.slice(0, 6)
      : [
          {
            notification_id: "7f9a2ec419aa",
            channel: "push",
            to: "apns_device_token_99x",
            status: "sent",
            created_at: new Date(Date.now() - 3200).toISOString(),
            sent_at: new Date(Date.now() - 3178).toISOString(),
          },
          {
            notification_id: "02ab4189ffbb",
            channel: "email",
            to: "user@enterprise.org",
            status: "sent",
            created_at: new Date(Date.now() - 7400).toISOString(),
            sent_at: new Date(Date.now() - 7359).toISOString(),
          },
          {
            notification_id: "bc3488012acc",
            channel: "sms",
            to: "+15551234567",
            status: "pending",
            created_at: new Date(Date.now() - 12800).toISOString(),
            sent_at: null,
          },
          {
            notification_id: "e9112a77dddd",
            channel: "push",
            to: "fcm_token_338a9",
            status: "sent",
            created_at: new Date(Date.now() - 19200).toISOString(),
            sent_at: new Date(Date.now() - 19181).toISOString(),
          },
          {
            notification_id: "18ee50ab29ee",
            channel: "push",
            to: "apns_token_881x",
            status: "sent",
            created_at: new Date(Date.now() - 25600).toISOString(),
            sent_at: new Date(Date.now() - 25574).toISOString(),
          },
          {
            notification_id: "92bb11cc021a",
            channel: "email",
            to: "alerts@security.corp",
            status: "failed",
            created_at: new Date(Date.now() - 38000).toISOString(),
            sent_at: null,
          },
        ];

  return (
    <ConsoleShell activePath="overview">
      <div className="flex flex-col gap-6">
        {/* 1. Command Header Bar */}
        <header className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-line shadow-xl overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

          {/* Left Cluster Stats */}
          <div className="flex flex-wrap items-center gap-3 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-line shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand shadow-[0_0_8px_#fe5824]" />
              </span>
              <span className="label-caps text-white">
                Cluster US-East-1 (Primary)
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-card text-brand font-bold">
                ACTIVE
              </span>
            </div>

            <div className="h-6 w-px bg-line hidden sm:block" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-line">
              <Zap className="w-3.5 h-3.5 text-brand" />
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="label-caps text-subtle">Ingestion</span>
                <span className="text-sm font-bold text-white tracking-tight">
                  {tickerRate.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </span>
                <span className="text-[10px] text-muted">msg/s</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-line">
              <span className="w-1.5 h-1.5 rounded-full bg-ok" />
              <span className="font-mono text-[10px] text-ok font-semibold">
                0.00% LOSS
              </span>
            </div>
          </div>

          {/* Right Action & Timeframe Filter */}
          <div className="flex flex-wrap items-center gap-3 z-10">
            <div className="flex items-center p-1 rounded-full bg-surface border border-line text-xs font-mono">
              {(["LIVE", "1H", "24H", "7D", "30D"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    timeframe === t
                      ? "bg-brand text-pitch font-bold shadow-[0_2px_8px_rgba(254,88,36,0.4)]"
                      : "text-muted hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <Link
              href="/composer"
              className="btn-glow flex items-center gap-2 px-5 py-2 rounded-full bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Rocket className="w-3.5 h-3.5 fill-pitch" />
              <span>Deploy Signal</span>
            </Link>
          </div>
        </header>

        {/* 2. Metric Overview Row (4 KPI Cards from Stitch Design) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Deliverability */}
          <div className="relative p-5 rounded-2xl bg-card border border-line shadow-md flex flex-col justify-between overflow-hidden group hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="label-caps text-subtle">DELIVERABILITY</span>
              <div className="flex items-center gap-1 text-ok font-mono text-[11px] font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+0.12%</span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline">
              <span className="font-display font-extrabold text-3xl text-white tracking-tight">
                {deliverability}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted">
              <span>SLA Baseline: 99.90%</span>
              <span className="text-brand font-semibold">HIGH CONF</span>
            </div>

            {/* Sparkline Graphic */}
            <div className="mt-3 w-full h-8 flex items-end">
              <svg
                className="w-full h-8 overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 160 32"
              >
                <path
                  d="M0 20 L25 18 L50 22 L75 14 L100 16 L125 10 L160 8"
                  fill="none"
                  stroke="#fe5824"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <line
                  x1="0"
                  y1="22"
                  x2="160"
                  y2="22"
                  stroke="#21242c"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* Total Volume */}
          <div className="relative p-5 rounded-2xl bg-card border border-line shadow-md flex flex-col justify-between overflow-hidden group hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="label-caps text-subtle">TOTAL VOLUME</span>
              <div className="flex items-center gap-1 text-brand font-mono text-[11px] font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+14.2%</span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline">
              <span className="font-display font-extrabold text-3xl text-white tracking-tight">
                {totalVolume}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted">
              <span>Peak: 4,210 msg/sec</span>
              <span className="text-subtle">30-DAY WINDOW</span>
            </div>

            {/* Sparkline Graphic */}
            <div className="mt-3 w-full h-8 flex items-end">
              <svg
                className="w-full h-8 overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 160 32"
              >
                <path
                  d="M0 24 L25 22 L50 18 L75 20 L100 12 L125 14 L160 6"
                  fill="none"
                  stroke="#06b6d4"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* P95 Transit Latency */}
          <div className="relative p-5 rounded-2xl bg-card border border-line shadow-md flex flex-col justify-between overflow-hidden group hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="label-caps text-subtle">
                P95 TRANSIT LATENCY
              </span>
              <div className="flex items-center gap-1 text-ok font-mono text-[11px] font-bold">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>-6ms OPT</span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline">
              <span className="font-display font-extrabold text-3xl text-white tracking-tight">
                {p95Latency}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted">
              <span>Edge Ping: 18ms</span>
              <span className="text-ok font-semibold">OPTIMAL</span>
            </div>

            {/* Sparkline Graphic */}
            <div className="mt-3 w-full h-8 flex items-end">
              <svg
                className="w-full h-8 overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 160 32"
              >
                <path
                  d="M0 10 L25 12 L50 9 L75 16 L100 14 L125 18 L160 22"
                  fill="none"
                  stroke="#a78bfa"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Active Routing Nodes */}
          <div className="relative p-5 rounded-2xl bg-card border border-line shadow-md flex flex-col justify-between overflow-hidden group hover:border-brand/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="label-caps text-subtle">
                ACTIVE ROUTING NODES
              </span>
              <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
            </div>

            <div className="mt-4 flex items-baseline">
              <span className="font-display font-extrabold text-3xl text-white tracking-tight">
                48<span className="text-muted text-xl font-normal">/48</span>
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted">
              <span>Mesh Convergence: 100%</span>
              <span className="text-ok font-semibold">ALL HEALTHY</span>
            </div>

            {/* Node Status Matrix */}
            <div className="mt-3 w-full h-8 grid grid-cols-12 gap-1 items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="h-2 rounded-sm bg-brand" />
              ))}
              {[...Array(4)].map((_, i) => (
                <span key={i} className="h-2 rounded-sm bg-cyan-400" />
              ))}
              {[...Array(2)].map((_, i) => (
                <span key={i} className="h-2 rounded-sm bg-purple-400" />
              ))}
              <span className="h-2 rounded-sm bg-ok" />
            </div>
          </div>
        </section>

        {/* 3. Primary Visualizer Card: Volume & Throughput by Protocol */}
        <section className="relative p-6 sm:p-8 rounded-2xl bg-card border border-line shadow-2xl flex flex-col gap-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">
                  Dispatched Volume &amp; Throughput by Protocol
                </h2>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/15 text-brand label-caps">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  LIVE STREAM
                </span>
              </div>
              <p className="font-mono text-xs text-muted mt-1">
                Protocol density mapped dynamically across active distribution
                clusters
              </p>
            </div>

            {/* Controls & Legend */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-brand" />
                  <span className="text-fg">Push Notification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                  <span className="text-fg">Transactional Email</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
                  <span className="text-fg">Direct SMS</span>
                </div>
              </div>

              <div className="flex items-center p-1 rounded-full bg-surface border border-line text-xs font-mono">
                {(["Hourly", "Daily", "Weekly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-full transition-all ${
                      period === p
                        ? "bg-card text-white font-semibold shadow-sm border border-line"
                        : "text-muted hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* High-Resolution Dynamic SVG Chart */}
          <div className="relative w-full h-80 rounded-xl bg-pitch/80 border border-line/60 p-4 overflow-hidden flex flex-col justify-between">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="w-full h-px bg-line" />
              <div className="w-full h-px bg-line" />
              <div className="w-full h-px bg-line" />
              <div className="w-full h-px bg-line" />
              <div className="w-full h-px bg-line" />
            </div>

            {/* Smooth Multi-stream Area SVG */}
            <div className="relative w-full h-full">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 1000 240"
              >
                <defs>
                  <linearGradient
                    id="grad-push"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fe5824" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#fe5824" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient
                    id="grad-email"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient
                    id="grad-sms"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Push Stream */}
                <polygon
                  fill="url(#grad-push)"
                  points="0,240 0,140 100,120 200,150 300,90 400,110 500,60 600,40 700,95 800,75 900,110 1000,65 1000,240"
                />
                <path
                  d="M0 140 Q 50 130 100 120 T 200 150 T 300 90 T 400 110 T 500 60 T 600 40 T 700 95 T 800 75 T 900 110 T 1000 65"
                  fill="none"
                  stroke="#fe5824"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Email Stream */}
                <polygon
                  fill="url(#grad-email)"
                  points="0,240 0,170 100,160 200,180 300,130 400,140 500,115 600,90 700,130 800,120 900,145 1000,110 1000,240"
                />
                <path
                  d="M0 170 Q 50 165 100 160 T 200 180 T 300 130 T 400 140 T 500 115 T 600 90 T 700 130 T 800 120 T 900 145 T 1000 110"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* SMS Stream */}
                <polygon
                  fill="url(#grad-sms)"
                  points="0,240 0,200 100,195 200,210 300,175 400,185 500,160 600,150 700,170 800,165 900,180 1000,155 1000,240"
                />
                <path
                  d="M0 200 Q 50 198 100 195 T 200 210 T 300 175 T 400 185 T 500 160 T 600 150 T 700 170 T 800 165 T 900 180 T 1000 155"
                  fill="none"
                  stroke="#a78bfa"
                  strokeDasharray="4 2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Peak Marker Line */}
                <line
                  x1="600"
                  y1="20"
                  x2="600"
                  y2="240"
                  stroke="#fe5824"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
                <circle
                  cx="600"
                  cy="40"
                  r="5"
                  fill="#fe5824"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx="600"
                  cy="90"
                  r="4"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle
                  cx="600"
                  cy="150"
                  r="4"
                  fill="#a78bfa"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Peak Tooltip Overlay */}
              <div className="absolute left-[58%] top-3 -translate-x-1/2 p-3.5 rounded-xl bg-card/95 backdrop-blur-md border border-line shadow-2xl z-20 flex flex-col gap-2 min-w-[210px] pointer-events-none">
                <div className="flex items-center justify-between border-b border-line pb-1.5 font-mono text-[11px]">
                  <span className="text-white">OCT 24 • 18:00 UTC</span>
                  <span className="text-brand font-bold">PEAK SURGE</span>
                </div>
                <div className="flex flex-col gap-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="w-2 h-2 rounded-full bg-brand" /> Push
                      APNs
                    </span>
                    <span className="text-white font-bold">142,480/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" /> SES
                      Mail
                    </span>
                    <span className="text-white font-bold">88,210/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />{" "}
                      Carrier SMS
                    </span>
                    <span className="text-white font-bold">45,102/s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* X-Axis Timestamps */}
            <div className="flex justify-between items-center px-2 pt-2 text-subtle font-mono text-[10px]">
              <span>12:00 UTC</span>
              <span>14:00 UTC</span>
              <span>16:00 UTC</span>
              <span className="text-brand font-bold">18:00 UTC (PEAK)</span>
              <span>20:00 UTC</span>
              <span>22:00 UTC</span>
              <span>00:00 UTC</span>
            </div>
          </div>
        </section>

        {/* 4. Lower Grid: Transmission Feed (7 Cols) + Carrier SLA (5 Cols) */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Panel: Real-time Transmission Feed */}
          <div className="xl:col-span-7 flex flex-col p-6 rounded-2xl bg-card border border-line shadow-xl gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-brand">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Transmission Feed
                  </h3>
                  <p className="label-caps text-subtle">
                    REAL-TIME EGRESS DISPATCH AUDIT
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  title="Filter Logs"
                  className="px-3 py-1 rounded-full bg-surface hover:bg-card border border-line text-xs font-mono text-fg flex items-center gap-1.5 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5 text-subtle" />
                  <span>FILTER</span>
                </button>
                <Link
                  href="/logs"
                  title="Full Egress Stream"
                  className="p-1.5 rounded-full bg-surface hover:bg-card border border-line text-muted hover:text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-surface/60 text-subtle label-caps border-b border-line">
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">CHANNEL</th>
                    <th className="py-2.5 px-3">RECIPIENT HASH</th>
                    <th className="py-2.5 px-3">ROUTE LATENCY</th>
                    <th className="py-2.5 px-3 text-right">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {logs.map((log, idx) => {
                    const isSent = log.status === "sent";
                    const isPending = log.status === "pending";
                    const isFailed = log.status === "failed";
                    const channel = log.channel.toLowerCase();

                    return (
                      <tr
                        key={log.notification_id || idx}
                        className="hover:bg-surface/50 transition-colors"
                      >
                        <td className="py-3 px-3">
                          {isSent && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ok/10 text-ok label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-ok" />{" "}
                              DELIVERED
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin" />{" "}
                              ROUTING
                            </span>
                          )}
                          {isFailed && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-err/10 text-err label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-err" />{" "}
                              FAILED
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-fg">
                          <div className="flex items-center gap-1.5">
                            {channel === "push" && (
                              <Smartphone className="w-3.5 h-3.5 text-brand" />
                            )}
                            {channel === "email" && (
                              <Mail className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                            {channel === "sms" && (
                              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                            )}
                            <span className="font-sans font-medium text-xs capitalize">
                              {channel === "push"
                                ? "APNs / FCM"
                                : channel === "email"
                                  ? "AWS SES TLS"
                                  : "Carrier SMPP"}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-muted">
                          #{shortId(log.notification_id || String(idx))}
                        </td>

                        <td className="py-3 px-3 text-white">
                          {isSent ? `${Math.floor(18 + idx * 4)}ms` : "--"}
                        </td>

                        <td className="py-3 px-3 text-subtle text-right">
                          {fmtClock(log.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Feed Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-line font-mono text-[11px]">
              <span className="text-subtle">
                Displaying {logs.length} of 3,842 buffer items
              </span>
              <Link
                href="/logs"
                className="text-brand hover:text-brand-bright font-semibold flex items-center gap-1 transition-colors"
              >
                <span>OPEN STREAM INSPECTOR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Carrier & Gateway SLA */}
          <div className="xl:col-span-5 flex flex-col p-6 rounded-2xl bg-card border border-line shadow-xl gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-brand">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Carrier &amp; Gateway SLA
                  </h3>
                  <p className="label-caps text-subtle">
                    SYSTEM HEALTH &amp; ROUTE COMPLIANCE
                  </p>
                </div>
              </div>
              <span className="label-caps px-2.5 py-0.5 rounded bg-ok/10 text-ok border border-ok/20">
                99.98% OK
              </span>
            </div>

            {/* SLA Donut Gauge + Carrier Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Radial Donut Uptime */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#171920"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#fe5824"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-display font-extrabold text-2xl text-white leading-none">
                      99.9<span className="text-brand">%</span>
                    </span>
                    <span className="label-caps text-subtle text-[9px] mt-1">
                      UPTIME SLA
                    </span>
                  </div>
                </div>
              </div>

              {/* Gateway Latency Breakdown Bars */}
              <div className="sm:col-span-7 flex flex-col gap-3 font-mono text-xs">
                {/* APNs */}
                <div className="p-2.5 rounded-xl bg-surface border border-line flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-sans font-medium">
                      Apple APNs
                    </span>
                    <span className="text-ok font-semibold">18ms</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-card overflow-hidden">
                    <div className="h-full bg-ok rounded-full w-[92%]" />
                  </div>
                  <div className="flex justify-between text-[9px] text-subtle">
                    <span>Throughput: 1.8M/hr</span>
                    <span>Success: 99.99%</span>
                  </div>
                </div>

                {/* FCM */}
                <div className="p-2.5 rounded-xl bg-surface border border-line flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-sans font-medium">
                      Google FCM
                    </span>
                    <span className="text-ok font-semibold">22ms</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-card overflow-hidden">
                    <div className="h-full bg-brand rounded-full w-[88%]" />
                  </div>
                  <div className="flex justify-between text-[9px] text-subtle">
                    <span>Throughput: 2.4M/hr</span>
                    <span>Success: 99.98%</span>
                  </div>
                </div>

                {/* SES */}
                <div className="p-2.5 rounded-xl bg-surface border border-line flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-sans font-medium">
                      AWS SES Mail
                    </span>
                    <span className="text-cyan-400 font-semibold">46ms</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-card overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-[78%]" />
                  </div>
                  <div className="flex justify-between text-[9px] text-subtle">
                    <span>Throughput: 1.1M/hr</span>
                    <span>Success: 99.95%</span>
                  </div>
                </div>

                {/* SMPP */}
                <div className="p-2.5 rounded-xl bg-surface border border-line flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-sans font-medium">
                      Global SMPP (SMS)
                    </span>
                    <span className="text-purple-400 font-semibold">82ms</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-card overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full w-[65%]" />
                  </div>
                  <div className="flex justify-between text-[9px] text-subtle">
                    <span>Throughput: 620k/hr</span>
                    <span>Success: 99.89%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ConsoleShell>
  );
}
