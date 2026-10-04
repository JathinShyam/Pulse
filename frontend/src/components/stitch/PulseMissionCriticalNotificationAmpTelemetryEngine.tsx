import React from "react";

export default function PulseMissionCriticalNotificationAmpTelemetryEngine() {
  return (
    <>
      <div>
        {/* Ambient Glow Orbs */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-brand/10 blur-[180px] pointer-events-none -z-10 rounded-full" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-orange-brand/5 blur-[160px] pointer-events-none -z-10 rounded-full" />
        {/* Editorial Top Bar / Announcement */}
        <div className="w-full border-b border-surface-border/60 bg-surface-dark/80 backdrop-blur text-[11px] font-mono py-2 px-6 flex items-center justify-between text-on-surface-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-brand/15 text-orange-brand font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-brand animate-ping" />
              v2.4 TELEMETRY CORE
            </span>
            <span className="hidden md:inline text-on-surface-subtle">|</span>
            <span className="hidden md:inline text-on-surface/80">
              Dispatched 14.8M notifications across 194 countries past 24h
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-on-surface/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              GLOBAL CLUSTER ACTIVE (41.8ms)
            </span>
            <a
              className="hidden sm:inline-block hover:text-white transition-colors underline decoration-orange-brand/50 underline-offset-4"
              href="#payload"
            >
              Explore SDK Docs →
            </a>
          </div>
        </div>
        {/* Phenomenon Studio Inspired Header */}
        <header className="sticky top-0 z-50 w-full bg-surface-pitch/85 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Brand Logo */}
            <a className="flex items-center gap-3 group" href="#">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-surface-card to-surface-card-hover border border-white/10 flex items-center justify-center text-orange-brand group-hover:scale-105 group-hover:border-orange-brand/50 transition-all shadow-[0_0_15px_rgba(254,88,36,0.2)]">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  hub
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                  PULSE
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                </span>
                <span className="font-mono text-[9px] tracking-widest text-on-surface-subtle uppercase -mt-0.5">
                  Telemetry Engine
                </span>
              </div>
            </a>
            {/* Navigation Pill */}
            <nav className="hidden lg:flex items-center gap-1 bg-surface-card/90 border border-white/10 px-3 py-1.5 rounded-full shadow-inner">
              <a
                className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-on-surface-muted hover:text-white rounded-full hover:bg-white/5 transition-all"
                href="#features"
              >
                Features
              </a>
              <a
                className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-on-surface-muted hover:text-white rounded-full hover:bg-white/5 transition-all"
                href="#telemetry-console"
              >
                Telemetry Radar
              </a>
              <a
                className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-on-surface-muted hover:text-white rounded-full hover:bg-white/5 transition-all"
                href="#architecture"
              >
                Architecture
              </a>
              <a
                className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-on-surface-muted hover:text-white rounded-full hover:bg-white/5 transition-all"
                href="#payload"
              >
                API &amp; Fallback
              </a>
              <a
                className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-on-surface-muted hover:text-white rounded-full hover:bg-white/5 transition-all"
                href="#metrics"
              >
                Performance
              </a>
            </nav>
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <a
                className="text-xs font-mono uppercase tracking-wider text-on-surface-muted hover:text-white px-3 py-2 transition-colors hidden sm:block"
                href="#signin"
              >
                Console Login
              </a>
              <a
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-surface-card hover:bg-white/5 text-xs font-mono text-white transition-all"
                href="#payload"
              >
                <span className="material-symbols-outlined text-[15px] text-orange-brand">
                  terminal
                </span>
                <span>Sandbox</span>
              </a>
              <a
                className="btn-orange-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider"
                href="#collaborate"
              >
                <span>Deploy Now</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {/* Hero Section: Editorial Bold Phenomenon Aesthetic */}
          <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 editorial-grid-bg border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              {/* Top Editorial Label */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-card border border-white/10 text-xs font-mono text-white">
                  <span className="w-2 h-2 rounded-full bg-orange-brand" />
                  <span>NEXT-GEN NOTIFICATION INFRASTRUCTURE</span>
                </div>
                <div className="font-mono text-xs text-on-surface-muted flex items-center gap-4">
                  <span>[ LATENCY: SUB-50MS ]</span>
                  <span>[ RETRY ENGINE: RFC-8999 ]</span>
                  <span className="text-orange-brand">[ DISPATCH: READY ]</span>
                </div>
              </div>
              {/* Phenomenon Giant Typography Hero */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
                <div className="lg:col-span-8">
                  <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[84px] tracking-tight leading-[0.98] text-white">
                    The Notification Engine for <br />
                    <span className="inline-block relative">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-brand via-orange-300 to-white">
                        Mission-Critical
                      </span>
                      <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-orange-brand to-transparent" />
                    </span>
                    <span className="block text-white/95 mt-1">Telemetry.</span>
                  </h1>
                </div>
                <div className="lg:col-span-4 space-y-6">
                  <p className="text-base md:text-lg text-on-surface-muted leading-relaxed font-sans">
                    Dispatch transactional emails, high-throughput SMS, and
                    real-time mobile push notifications with sub-50ms latency,
                    zero-drop delivery, and end-to-end cryptographic tracing.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      className="btn-orange-glow px-7 py-4 rounded-full font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2.5"
                      href="#collaborate"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        bolt
                      </span>
                      <span>Get Started Now</span>
                    </a>
                    <a
                      className="px-6 py-4 rounded-full bg-surface-card hover:bg-surface-card-hover border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                      href="#payload"
                    >
                      <span className="material-symbols-outlined text-[16px] text-orange-brand">
                        code
                      </span>
                      <span>API Playground</span>
                    </a>
                  </div>
                </div>
              </div>
              {/* Phenomenon Studio Style Live Micro Stats Pill Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 rounded-2xl bg-surface-card/60 border border-white/10 backdrop-blur-xl mb-14">
                <div className="p-4 rounded-xl bg-surface-pitch/70 border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-subtle">
                    Average P99 Latency
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span
                      className="font-display text-3xl font-extrabold text-white"
                      id="stat-latency"
                    >
                      41.8
                    </span>
                    <span className="font-mono text-xs text-orange-brand font-semibold">
                      ms
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">
                    ↓ 4.2ms faster vs SES direct
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-pitch/70 border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-subtle">
                    Global Deliverability
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display text-3xl font-extrabold text-white">
                      99.982%
                    </span>
                  </div>
                  <div className="text-[11px] text-orange-brand font-mono mt-1">
                    Multi-carrier failover active
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-pitch/70 border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-subtle">
                    Fan-Out Throughput
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display text-3xl font-extrabold text-white">
                      2.4M
                    </span>
                    <span className="font-mono text-xs text-on-surface-muted">
                      / sec
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">
                    Zero dropped packets queue
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-pitch/70 border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-subtle">
                    Carrier Networks
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display text-3xl font-extrabold text-white">
                      194
                    </span>
                    <span className="font-mono text-xs text-orange-brand">
                      Countries
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-muted font-mono mt-1">
                    Direct SMPP Tier-1 routes
                  </div>
                </div>
              </div>
              {/* Hero Telemetry Visualizer: Phenomenon Studio Motion Canvas / High-Tech Dashboard */}
              <div
                className="rounded-3xl ph-card p-1 shadow-2xl overflow-hidden relative group"
                id="telemetry-console"
              >
                {/* Glass Top Header */}
                <div className="px-6 py-4 bg-surface-card/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="font-mono text-xs text-white tracking-wide pl-2 border-l border-white/10">
                      telemetry-visualizer.pulse.internal
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-orange-brand/20 text-orange-brand font-semibold">
                      Live Socket
                    </span>
                  </div>
                  {/* Interactive Tab controls */}
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-full bg-orange-brand/10 hover:bg-orange-brand/20 text-orange-brand border border-orange-brand/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-all"
                      onclick="simulateDispatch()"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        refresh
                      </span>
                      <span>Trigger Test Event</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>SYNCED: 41.8ms</span>
                    </div>
                  </div>
                </div>
                {/* Main Interactive Telemetry Pipeline */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-pitch/90 relative">
                  {/* Left Ingestion Block */}
                  <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-surface-dark border border-white/5 p-5 font-mono">
                    <div>
                      <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-white/10">
                        <span className="text-orange-brand font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-orange-brand animate-pulse" />
                          POST /v2/events/dispatch
                        </span>
                        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          202 ACCEPTED
                        </span>
                      </div>
                      <pre className="text-on-surface-muted text-xs leading-relaxed overflow-x-auto">
                        <code id="code-stream">
                          {"{"}
                          {"\n"}
                          {"  "}
                          <span className="text-orange-brand">
                            "event"
                          </span>:{" "}
                          <span className="text-white">"order.shipped"</span>,
                          {"\n"}
                          {"  "}
                          <span className="text-orange-brand">
                            "recipient_id"
                          </span>
                          : <span className="text-orange-300">"usr_9f42b"</span>
                          ,{"\n"}
                          {"  "}
                          <span className="text-orange-brand">"channels"</span>:
                          [{"\n"}
                          {"    "}
                          <span className="text-emerald-400">"email"</span>,
                          {"\n"}
                          {"    "}
                          <span className="text-amber-400">"sms"</span>,{"\n"}
                          {"    "}
                          <span className="text-orange-brand">"push"</span>
                          {"\n"}
                          {"  "}],{"\n"}
                          {"  "}
                          <span className="text-orange-brand">
                            "priority"
                          </span>:{" "}
                          <span className="text-white">"P0_URGENT"</span>,{"\n"}
                          {"  "}
                          <span className="text-orange-brand">
                            "crypto_sig"
                          </span>
                          :{" "}
                          <span className="text-on-surface-subtle">
                            "0x9c4e207a"
                          </span>
                          {"\n"}
                          {"}"}
                        </code>
                      </pre>
                    </div>
                    <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-on-surface-subtle">
                      <span>Buffer Pool: 0.04%</span>
                      <span className="text-emerald-400 font-mono">
                        Ingest rate: 42,910/s
                      </span>
                    </div>
                  </div>
                  {/* Middle Fanout Animated Node */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center relative py-6">
                    {/* SVG Wave Connection Lines */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                    >
                      <path
                        className="pulse-path"
                        d="M 0 50 Q 50 50 100 20"
                        fill="none"
                        stroke="rgba(254, 88, 36, 0.4)"
                        strokeWidth="1.5"
                      />
                      <path
                        className="pulse-path"
                        d="M 0 50 Q 50 50 100 50"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1.5"
                      />
                      <path
                        className="pulse-path"
                        d="M 0 50 Q 50 50 100 80"
                        fill="none"
                        stroke="rgba(254, 88, 36, 0.4)"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div className="w-16 h-16 rounded-2xl bg-surface-card border-2 border-orange-brand/70 flex flex-col items-center justify-center text-orange-brand shadow-[0_0_30px_rgba(254,88,36,0.35)] z-10">
                      <span className="material-symbols-outlined text-[26px]">
                        alt_route
                      </span>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-white mt-0.5">
                        FAN-OUT
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-on-surface-muted mt-2 tracking-widest uppercase">
                      Multi-Route Engine
                    </span>
                  </div>
                  {/* Right Telemetry Targets */}
                  <div className="lg:col-span-6 space-y-3.5">
                    {/* Channel 1: Email Relay */}
                    <div className="p-4 rounded-xl bg-surface-dark border border-white/10 hover:border-orange-brand/40 transition-all flex items-center justify-between group/row">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-orange-brand/10 border border-orange-brand/20 flex items-center justify-center text-orange-brand group-hover/row:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[20px]">
                            forward_to_inbox
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-display font-bold text-white">
                              Email SMTP Cluster
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              DKIM / DMARC PASS
                            </span>
                          </div>
                          <div className="text-xs text-on-surface-muted font-mono mt-0.5">
                            AWS-SES &amp; Proprietary Relay Pipeline
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-white font-bold">
                          38.4ms
                        </div>
                        <div className="text-[11px] text-emerald-400">
                          99.98% Delivered
                        </div>
                      </div>
                    </div>
                    {/* Channel 2: SMS Gateway */}
                    <div className="p-4 rounded-xl bg-surface-dark border border-white/10 hover:border-orange-brand/40 transition-all flex items-center justify-between group/row">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover/row:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[20px]">
                            cell_tower
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-display font-bold text-white">
                              Global SMS Gateway
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-on-surface border border-white/10">
                              SMPP TIER-1
                            </span>
                          </div>
                          <div className="text-xs text-on-surface-muted font-mono mt-0.5">
                            Direct Carrier Priority Lanes (194 Countries)
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-white font-bold">
                          142.1ms
                        </div>
                        <div className="text-[11px] text-emerald-400">
                          100% Routed
                        </div>
                      </div>
                    </div>
                    {/* Channel 3: Mobile Push */}
                    <div className="p-4 rounded-xl bg-surface-dark border border-white/10 hover:border-orange-brand/40 transition-all flex items-center justify-between group/row">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-orange-brand/10 border border-orange-brand/20 flex items-center justify-center text-orange-brand group-hover/row:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[20px]">
                            devices
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-display font-bold text-white">
                              APNs &amp; FCM Dual Orchestrator
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-orange-brand/20 text-orange-brand border border-orange-brand/30">
                              HTTP/2 MUX
                            </span>
                          </div>
                          <div className="text-xs text-on-surface-muted font-mono mt-0.5">
                            Sub-50ms iOS &amp; Android Device Fan-Out
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-white font-bold">
                          21.8ms
                        </div>
                        <div className="text-[11px] text-emerald-400">
                          99.99% Delivered
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Client / Enterprise Reliability Strip (Phenomenon Studio DNA) */}
          <section className="py-12 border-b border-white/5 bg-surface-dark/40">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-xs font-mono uppercase tracking-widest text-on-surface-subtle shrink-0">
                  Trusted by critical infrastructure teams
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-10 opacity-70 hover:opacity-100 transition-opacity font-display font-bold text-lg tracking-wider text-on-surface-muted">
                  <span className="hover:text-white transition-colors cursor-default">
                    ▲ HYPERSCALE
                  </span>
                  <span className="hover:text-white transition-colors cursor-default">
                    ◆ CYBERDEFENSE
                  </span>
                  <span className="hover:text-white transition-colors cursor-default">
                    ● FINROUTER
                  </span>
                  <span className="hover:text-white transition-colors cursor-default">
                    ■ VORTEX CLOUD
                  </span>
                  <span className="hover:text-white transition-colors cursor-default">
                    ◈ SENTINEL LABS
                  </span>
                </div>
              </div>
            </div>
          </section>
          {/* Core Features Section (Editorial Layout with Phenomenon Studio Card Grids) */}
          <section
            className="py-24 border-b border-white/5 relative"
            id="features"
          >
            <div className="max-w-7xl mx-auto px-6">
              {/* Editorial Section Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-white/10">
                <div className="md:col-span-8">
                  <span className="text-xs font-mono uppercase tracking-widest text-orange-brand mb-3 block font-semibold">
                    // 01 — ARCHITECTURE MATRIX
                  </span>
                  <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-[1.05]">
                    Engineered for Resilient Multi-Channel Delivery
                  </h2>
                </div>
                <div className="md:col-span-4">
                  <p className="text-sm sm:text-base text-on-surface-muted">
                    Pulse unifies fragmented notification silos into a single
                    high-density, fault-tolerant dispatch core built for
                    mission-critical scale.
                  </p>
                </div>
              </div>
              {/* 3 Phenomenon-Style Brutalist Cards with Hover Accents */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Email */}
                <div className="ph-card rounded-3xl p-8 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center text-orange-brand group-hover:scale-105 group-hover:border-orange-brand transition-all">
                        <span className="material-symbols-outlined text-[32px]">
                          forward_to_inbox
                        </span>
                      </div>
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface font-medium">
                        99.8% health
                      </span>
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-orange-brand mb-2">
                      Protocol 01
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-3">
                      Email Delivery Engine
                    </h3>
                    <p className="text-sm text-on-surface-muted leading-relaxed mb-8">
                      Custom SMTP relay infrastructure with dynamic MJML
                      template compilation, auto-reputation warming, and
                      real-time bounce telemetry.
                    </p>
                    <div className="space-y-3 pt-6 border-t border-white/5 text-xs text-on-surface-muted">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                        <span>Automated SPF, DKIM &amp; DMARC compliance</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                        <span>MJML components with JSON variable binding</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                        <span>Predictive bounce suppression queue</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-subtle uppercase">
                      Max Batch Dispatch
                    </span>
                    <span className="text-orange-brand font-bold">
                      50,000 / sec
                    </span>
                  </div>
                </div>
                {/* Card 2: SMS */}
                <div className="ph-card rounded-3xl p-8 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:border-white transition-all">
                        <span className="material-symbols-outlined text-[32px]">
                          cell_tower
                        </span>
                      </div>
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface font-medium">
                        142ms latency
                      </span>
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-white/70 mb-2">
                      Protocol 02
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-3">
                      Global SMS Gateway
                    </h3>
                    <p className="text-sm text-on-surface-muted leading-relaxed mb-8">
                      Direct carrier routes across 190+ countries with automatic
                      multi-carrier failover, dedicated OTP priority lanes, and
                      dynamic phone pool balancing.
                    </p>
                    <div className="space-y-3 pt-6 border-t border-white/5 text-xs text-on-surface-muted">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>Sub-second 2FA / OTP verification lane</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>
                          Local virtual numbers &amp; shortcode pooling
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>Real-time route cost &amp; rate arbitrage</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-subtle uppercase">
                      Global Reach
                    </span>
                    <span className="text-white font-bold">194 Countries</span>
                  </div>
                </div>
                {/* Card 3: Push */}
                <div className="ph-card rounded-3xl p-8 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center text-orange-brand group-hover:scale-105 group-hover:border-orange-brand transition-all">
                        <span className="material-symbols-outlined text-[32px]">
                          devices
                        </span>
                      </div>
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-orange-brand/10 border border-orange-brand/30 text-orange-brand font-medium">
                        sub-50ms delivery
                      </span>
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-orange-brand mb-2">
                      Protocol 03
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-3">
                      Push Infrastructure
                    </h3>
                    <p className="text-sm text-on-surface-muted leading-relaxed mb-8">
                      APNs and FCM dual orchestration with rich interactive
                      notifications, automated device token lifecycle rotation,
                      and zero-drop fan-out.
                    </p>
                    <div className="space-y-3 pt-6 border-t border-white/5 text-xs text-on-surface-muted">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                        <span>HTTP/2 multiplexed persistent connections</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                        <span>
                          Live badging, action categories &amp; rich media
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand" />
                        <span>Stale token pruning &amp; auto-invalidation</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-subtle uppercase">
                      Concurrent Sockets
                    </span>
                    <span className="text-orange-brand font-bold">
                      8.2 Million
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Architecture & Cascading Failover (Phenomenon Studio High-End Code Presentation) */}
          <section
            className="py-24 border-b border-white/5 relative bg-surface-dark/30"
            id="architecture"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column Content */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-white/10 text-orange-brand text-xs font-mono font-medium">
                    <span className="material-symbols-outlined text-[15px]">
                      code
                    </span>
                    <span>UNIFIED DISPATCH API</span>
                  </div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">
                    One Unified API. Deterministic Multi-Channel Cascading.
                  </h2>
                  <p className="text-base text-on-surface-muted leading-relaxed">
                    Eliminate brittle microservice logic. Pulse handles token
                    refreshes, carrier route congestion, backpressure
                    rate-limiting, and cryptographic verification inside a
                    single deterministic SDK call.
                  </p>
                  <div className="space-y-4 pt-4">
                    <div className="p-4 rounded-2xl bg-surface-card border border-white/5 hover:border-orange-brand/30 transition-all flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-orange-brand/10 border border-orange-brand/30 flex items-center justify-center text-orange-brand shrink-0">
                        <span className="material-symbols-outlined text-[18px]">
                          terminal
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-display font-bold text-white">
                          Universal SDK Bindings
                        </h4>
                        <p className="text-xs text-on-surface-muted mt-0.5">
                          First-class bindings for TypeScript, Go, Python, and
                          Rust with native idempotency key generation.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-card border border-white/5 hover:border-orange-brand/30 transition-all flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-orange-brand/10 border border-orange-brand/30 flex items-center justify-center text-orange-brand shrink-0">
                        <span className="material-symbols-outlined text-[18px]">
                          shuffle
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-display font-bold text-white">
                          Smart Fallback Cascade
                        </h4>
                        <p className="text-xs text-on-surface-muted mt-0.5">
                          If mobile push is unread after 90 seconds,
                          automatically cascade to SMS or transactional email.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-card border border-white/5 hover:border-orange-brand/30 transition-all flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-orange-brand/10 border border-orange-brand/30 flex items-center justify-center text-orange-brand shrink-0">
                        <span className="material-symbols-outlined text-[18px]">
                          verified_user
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-display font-bold text-white">
                          Cryptographic Trace Stamps
                        </h4>
                        <p className="text-xs text-on-surface-muted mt-0.5">
                          Audit every microsecond of delivery lifecycle with
                          HMAC-SHA256 immutable trace stamps.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Column: Interactive Code Console */}
                <div className="lg:col-span-7" id="payload">
                  <div className="ph-card rounded-3xl overflow-hidden font-mono shadow-2xl">
                    {/* Console Toolbar */}
                    <div className="px-5 py-3.5 bg-surface-card border-b border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-full bg-orange-brand text-surface-pitch font-bold text-[11px]">
                          TypeScript
                        </button>
                        <button className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-on-surface-muted hover:text-white transition-all text-[11px]">
                          cURL
                        </button>
                        <button className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-on-surface-muted hover:text-white transition-all text-[11px]">
                          Python
                        </button>
                        <button className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-on-surface-muted hover:text-white transition-all text-[11px]">
                          Go
                        </button>
                      </div>
                      <button
                        className="flex items-center gap-1.5 text-on-surface-muted hover:text-white text-[11px] px-2.5 py-1 rounded hover:bg-white/5 transition-all"
                        id="copy-btn"
                        onclick="copySnippet()"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          content_copy
                        </span>
                        <span id="copy-label">Copy snippet</span>
                      </button>
                    </div>
                    {/* Code Editor Body */}
                    <div className="p-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto text-on-surface bg-surface-pitch/95">
                      <span className="text-on-surface-subtle">
                        // Initialize automated cascading delivery
                      </span>
                      <br />
                      <span className="text-orange-brand font-semibold">
                        import
                      </span>{" "}
                      {"{"}{" "}
                      <span className="text-white font-medium">
                        PulseClient
                      </span>{" "}
                      {"}"}{" "}
                      <span className="text-orange-brand font-semibold">
                        from
                      </span>{" "}
                      <span className="text-emerald-400">'@pulse/engine'</span>;
                      <br />
                      <br />
                      <span className="text-orange-brand font-semibold">
                        const
                      </span>{" "}
                      pulse ={" "}
                      <span className="text-orange-brand font-semibold">
                        new
                      </span>{" "}
                      <span className="text-white">PulseClient</span>({"{"}{" "}
                      <br />
                      &nbsp;&nbsp;apiKey: process.env.
                      <span className="text-amber-300">PULSE_KEY</span>,<br />
                      &nbsp;&nbsp;cluster:{" "}
                      <span className="text-emerald-400">"us-east-global"</span>
                      <br />
                      {"}"});
                      <br />
                      <br />
                      <span className="text-on-surface-subtle">
                        // Dispatch with deterministic failover
                      </span>
                      <br />
                      <span className="text-orange-brand font-semibold">
                        await
                      </span>{" "}
                      pulse.dispatch({"{"}
                      <br />
                      &nbsp;&nbsp;target: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;userId:{" "}
                      <span className="text-emerald-400">"usr_9f42b"</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;email:{" "}
                      <span className="text-emerald-400">
                        "alex.v@enterprise.io"
                      </span>
                      ,<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;phone:{" "}
                      <span className="text-emerald-400">"+14155550192"</span>
                      <br />
                      &nbsp;&nbsp;{"}"},<br />
                      &nbsp;&nbsp;strategy:{" "}
                      <span className="text-orange-brand font-semibold">
                        "cascade_push_first"
                      </span>
                      ,<br />
                      &nbsp;&nbsp;cascadeDelaySec:{" "}
                      <span className="text-amber-400">90</span>,<br />
                      &nbsp;&nbsp;payload: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;title:{" "}
                      <span className="text-emerald-400">
                        "Security Alert: Root API Key Rotated"
                      </span>
                      ,<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;urgency:{" "}
                      <span className="text-amber-400">"HIGH"</span>
                      <br />
                      &nbsp;&nbsp;{"}"}
                      <br />
                      {"}"});
                    </div>
                    {/* Console Bottom Telemetry Bar */}
                    <div className="px-5 py-3 bg-surface-card border-t border-white/10 flex items-center justify-between text-[11px] text-on-surface-muted">
                      <span className="flex items-center gap-2 text-emerald-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Response: 200 OK — Trace ID: 0x9c4e207a</span>
                      </span>
                      <span className="font-mono text-white">
                        Execution: 38ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Interactive Performance Radar / Metrics Section */}
          <section
            className="py-24 border-b border-white/5 relative"
            id="metrics"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-orange-brand mb-2 block font-semibold">
                  // 02 — BENCHMARK METRICS
                </span>
                <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                  Engineered for Extreme Latency Predictability
                </h2>
                <p className="text-sm sm:text-base text-on-surface-muted mt-3">
                  Real-world benchmark streams comparing standard providers
                  against the Pulse edge routing fabric.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="p-6 rounded-2xl bg-surface-card border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-on-surface-subtle mb-4">
                      <span>PUSH DELIVERY (P95)</span>
                      <span className="text-orange-brand font-bold">
                        PULSE CORE
                      </span>
                    </div>
                    <div className="font-display text-4xl font-extrabold text-white mb-2">
                      21.8 ms
                    </div>
                    <div className="w-full bg-surface-pitch h-2 rounded-full overflow-hidden mb-4 border border-white/5">
                      <div
                        className="bg-orange-brand h-full rounded-full"
                        style={{ width: "28%" }}
                      />
                    </div>
                    <p className="text-xs text-on-surface-muted">
                      Direct HTTP/2 socket persistence eliminates TLS handshake
                      delay per notification event.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[11px] text-on-surface-subtle flex justify-between">
                    <span>Standard Provider: 140ms</span>
                    <span className="text-emerald-400 font-bold">
                      6.4x Faster
                    </span>
                  </div>
                </div>
                {/* Metric 2 */}
                <div className="p-6 rounded-2xl bg-surface-card border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-on-surface-subtle mb-4">
                      <span>SMS OTP ROUTE CONGESTION</span>
                      <span className="text-white font-bold">
                        PRIORITY SMPP
                      </span>
                    </div>
                    <div className="font-display text-4xl font-extrabold text-white mb-2">
                      0.001%
                    </div>
                    <div className="w-full bg-surface-pitch h-2 rounded-full overflow-hidden mb-4 border border-white/5">
                      <div
                        className="bg-white h-full rounded-full"
                        style={{ width: "4%" }}
                      />
                    </div>
                    <p className="text-xs text-on-surface-muted">
                      Automated route switching bypasses saturated carrier
                      trunks within 200ms of latency spike.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[11px] text-on-surface-subtle flex justify-between">
                    <span>Carrier Average: 3.8%</span>
                    <span className="text-emerald-400 font-bold">
                      Zero Dropped
                    </span>
                  </div>
                </div>
                {/* Metric 3 */}
                <div className="p-6 rounded-2xl bg-surface-card border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-on-surface-subtle mb-4">
                      <span>EMAIL REPUTATION INTEGRITY</span>
                      <span className="text-orange-brand font-bold">
                        WARMED IP POOL
                      </span>
                    </div>
                    <div className="font-display text-4xl font-extrabold text-white mb-2">
                      99.8%
                    </div>
                    <div className="w-full bg-surface-pitch h-2 rounded-full overflow-hidden mb-4 border border-white/5">
                      <div
                        className="bg-orange-brand h-full rounded-full"
                        style={{ width: "99.8%" }}
                      />
                    </div>
                    <p className="text-xs text-on-surface-muted">
                      Predictive suppression shields sending domains before hard
                      bounces trigger blacklists.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[11px] text-on-surface-subtle flex justify-between">
                    <span>Inbox Placement</span>
                    <span className="text-emerald-400 font-bold">Top Tier</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Signature Phenomenon Studio Bottom Hero CTA Banner ('Ready to scale? Let's collaborate ->') */}
          <section
            className="py-24 md:py-32 relative overflow-hidden bg-surface-dark border-t border-white/10"
            id="collaborate"
          >
            {/* Big Orange Gradient Mesh behind CTA */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[800px] h-[350px] bg-orange-brand/15 blur-[160px] rounded-full" />
            </div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-10 border-b border-white/15">
                <div className="max-w-2xl">
                  <span className="text-xs font-mono uppercase tracking-widest text-orange-brand font-bold mb-3 block">
                    // NEXT STEP — PRODUCTION ONBOARDING
                  </span>
                  <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.05]">
                    Ready to scale mission-critical dispatch?
                  </h2>
                  <p className="text-base text-on-surface-muted mt-4 leading-relaxed max-w-xl">
                    Deploy your first test event in under 3 minutes with our
                    pre-built SDKs, instant sandbox credentials, and
                    multi-channel failover redundancy.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    className="px-7 py-4 rounded-full bg-surface-card hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    href="#payload"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      support_agent
                    </span>
                    <span>Schedule Review</span>
                  </a>
                </div>
              </div>
              {/* Phenomenon Studio Massive Interactive Arrow Button Banner */}
              <a
                className="group block w-full rounded-3xl bg-surface-card/90 border border-white/10 hover:border-orange-brand p-8 sm:p-12 transition-all duration-300 hover:shadow-[0_0_50px_rgba(254,88,36,0.25)]"
                href="#payload"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-orange-brand block mb-1">
                      Instant Deployment
                    </span>
                    <span className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight group-hover:text-orange-brand transition-colors">
                      Let's collaborate
                    </span>
                  </div>
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-orange-brand text-surface-pitch flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-xl self-end md:self-center">
                    <span className="material-symbols-outlined text-[36px] sm:text-[48px] font-bold group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </section>
        </main>
        {/* Global Footer with Phenomenon Aesthetic */}
        <footer className="bg-surface-pitch border-t border-white/10 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
              {/* Brand Info */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-card border border-white/10 flex items-center justify-center text-orange-brand">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      hub
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-xl text-white tracking-tight">
                    PULSE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-muted max-w-sm leading-relaxed">
                  Observability &amp; Delivery Suite for high-scale
                  transactional dispatch, telemetry stream routing, and
                  zero-drop mission-critical communications.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-white/10 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cluster US-East / EU-Central Operational</span>
                </div>
              </div>
              {/* Product Links */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-white uppercase tracking-widest font-bold">
                  Product
                </div>
                <ul className="space-y-2 text-xs text-on-surface-muted font-sans">
                  <li>
                    <a
                      className="hover:text-white transition-colors"
                      href="#features"
                    >
                      Email SMTP Relay
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white transition-colors"
                      href="#features"
                    >
                      SMS Gateway
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white transition-colors"
                      href="#features"
                    >
                      APNs &amp; FCM Push
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white transition-colors"
                      href="#metrics"
                    >
                      Latency Radar
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white transition-colors"
                      href="#architecture"
                    >
                      Cascading Failover
                    </a>
                  </li>
                </ul>
              </div>
              {/* Developers Links */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-white uppercase tracking-widest font-bold">
                  Developers
                </div>
                <ul className="space-y-2 text-xs text-on-surface-muted font-sans">
                  <li>
                    <a
                      className="hover:text-white transition-colors"
                      href="#payload"
                    >
                      API Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white transition-colors"
                      href="#payload"
                    >
                      Client SDKs
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      Changelog v2.4
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      GitHub Repository
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      Network Status
                    </a>
                  </li>
                </ul>
              </div>
              {/* Company & Legal Links */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-white uppercase tracking-widest font-bold">
                  Company &amp; Legal
                </div>
                <ul className="space-y-2 text-xs text-on-surface-muted font-sans">
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      Security &amp; SOC2 Type II
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white transition-colors" href="#">
                      Subprocessors
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Footer Bottom Copyright & Links */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-subtle gap-4 font-mono">
              <div>
                © 2025 Pulse Observability &amp; Delivery Suite. Phenomenon
                Tech Aesthetic.
              </div>
              <div className="flex items-center gap-6">
                <a className="hover:text-white transition-colors" href="#">
                  System Architecture
                </a>
                <a className="hover:text-white transition-colors" href="#">
                  Compliance
                </a>
                <a className="hover:text-white transition-colors" href="#">
                  Security Advisories
                </a>
              </div>
            </div>
          </div>
        </footer>
        {/* Interactive JavaScript for Live Simulation & Copy Trigger */}
      </div>
    </>
  );
}
