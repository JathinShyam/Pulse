"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  DollarSign,
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
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [volumeSlider, setVolumeSlider] = useState(5_000_000);

  // Dynamic cost calculation based on slider
  const baseMonthly = Math.round(
    499 + ((volumeSlider - 2_000_000) / 1000) * 0.12,
  );
  const displayCost =
    volumeSlider <= 10_000 ? 0 : volumeSlider <= 2_000_000 ? 499 : baseMonthly;
  const finalCost =
    billingCycle === "annual" ? Math.round(displayCost * 0.8) : displayCost;

  return (
    <div className="min-h-screen bg-pitch text-fg font-sans selection:bg-brand selection:text-white overflow-x-hidden">
      {/* Background Lighting Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand/[0.08] blur-[180px] pointer-events-none -z-10 rounded-full" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand/[0.03] blur-[180px] pointer-events-none -z-10 rounded-full" />

      {/* Header Bar */}
      <header className="sticky top-0 z-50 w-full bg-pitch/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center text-brand shadow-[0_0_15px_rgba(254,88,36,0.2)]">
              <Radio className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                PULSE
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              </span>
              <span className="font-mono text-[9px] tracking-widest text-subtle uppercase -mt-0.5">
                SLA Tier Plans
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-card/90 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Console
            </Link>
            <Link
              href="/composer"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Composer
            </Link>
            <Link
              href="/gateways"
              className="px-3 py-1.5 rounded-full text-muted hover:text-white transition-colors"
            >
              Gateways
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full border border-line text-xs font-medium text-muted hover:text-white transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/composer"
              className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>Deploy Signal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col gap-20">
        {/* Title Area */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <span className="label-caps text-brand">
            INCOMING SPECIFICATIONS &amp; DISPATCH RATES
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-4 leading-tight">
            Predictable scale. Sub-50ms latency.{" "}
            <span className="text-brand drop-shadow-[0_0_35px_rgba(254,88,36,0.6)]">
              Zero dropped packets.
            </span>
          </h1>
          <p className="text-muted text-base sm:text-lg mt-5 max-w-2xl leading-relaxed">
            Transparent usage-based pricing with automated carrier SLAs,
            automated cross-load failover, and dedicated voice / bearer channels
            built for mission-critical dispatch.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-10 flex items-center p-1.5 rounded-full bg-card border border-line text-xs font-mono">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full transition-all ${
                billingCycle === "monthly"
                  ? "bg-surface border border-line text-white font-bold shadow-sm"
                  : "text-muted hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full flex items-center gap-1.5 transition-all ${
                billingCycle === "annual"
                  ? "bg-brand text-pitch font-bold shadow-[0_0_15px_rgba(254,88,36,0.3)]"
                  : "text-muted hover:text-white"
              }`}
            >
              <span>Annual Allocation</span>
              <span className="label-caps text-[9px] px-1.5 py-0.5 rounded bg-pitch text-brand font-bold">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* 3 Core Tier Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* 01 // DEVELOPER SANDBOX */}
          <div className="ph-card p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
                <span className="label-caps text-subtle">
                  01 // EVALUATION TIER
                </span>
                <span className="label-caps text-muted">DEV-READY</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Developer Sandbox
              </h3>
              <p className="text-muted text-xs mt-2 leading-relaxed">
                For engineers and teams building, validating, and testing
                mission-critical dispatch architecture.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display font-extrabold text-5xl text-white">
                  $0
                </span>
                <span className="font-mono text-xs text-muted">/ forever</span>
              </div>

              <ul className="mt-8 space-y-3 font-mono text-xs text-fg/90">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>10,000 Dispatches / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>3 Core Channels (APNs, FCM, SES)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Shared cluster egress topology</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Sub-200ms telemetry logs &amp; tracing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Global Community Discord support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/composer"
              className="mt-10 w-full py-3 rounded-xl bg-surface hover:bg-card border border-line text-xs font-mono text-white text-center font-semibold transition-colors"
            >
              Start Developing Free &rarr;
            </Link>
          </div>

          {/* 02 // PRODUCTION SCALE (Glowing Orange Feature Card) */}
          <div className="relative ph-card p-8 rounded-3xl border-brand/60 shadow-[0_0_50px_rgba(254,88,36,0.2)] flex flex-col justify-between">
            {/* Top Recommended Tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand text-pitch font-mono font-bold text-[10px] uppercase tracking-wider shadow-lg">
              Most Popular For Production Teams
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
                <span className="label-caps text-brand">
                  02 // ENTERPRISE CORE
                </span>
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Production Scale
              </h3>
              <p className="text-muted text-xs mt-2 leading-relaxed">
                Zero-loss delivery, automated carrier failover, and
                high-frequency edge rate limit buffers.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display font-extrabold text-5xl text-white">
                  ${billingCycle === "annual" ? "399" : "499"}
                </span>
                <span className="font-mono text-xs text-muted">/ month</span>
              </div>
              <span className="font-mono text-[10px] text-subtle block mt-1">
                + $0.12 per 1,000 dispatches beyond quota
              </span>

              <ul className="mt-8 space-y-3 font-mono text-xs text-fg/90">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span className="font-semibold text-white">
                    2,000,000 Dispatches included / month
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>All 5 Channels (incl. Tier-1 SMPP Direct)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>High-speed deterministic routing redundancy</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span className="text-brand font-bold">
                    25,000 msg/sec peak guaranteed throughput
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Live unmanaged failbacks across carriers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>24/7 dedicated escalation engineering</span>
                </li>
              </ul>
            </div>

            <Link
              href="/composer"
              className="btn-glow mt-10 w-full py-3.5 rounded-xl bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(254,88,36,0.4)]"
            >
              <span>Deploy Production Cluster</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 03 // HYPERSCALE ENTERPRISE */}
          <div className="ph-card p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
                <span className="label-caps text-subtle">
                  03 // DEDICATED MESH
                </span>
                <span className="label-caps text-ok">SLA 99.999%</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Hyperscale Enterprise
              </h3>
              <p className="text-muted text-xs mt-2 leading-relaxed">
                For Tier-1 financial institutions, defense networks, and
                high-frequency scale architectures.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display font-extrabold text-4xl text-white">
                  Custom
                </span>
                <span className="font-mono text-xs text-muted">
                  Tailored SLA
                </span>
              </div>

              <ul className="mt-8 space-y-3 font-mono text-xs text-fg/90">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Unlimited unthrottled throughput</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Multi-cloud cluster isolate deployment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Custom BGP peering &amp; Direct SMPP trunks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>
                    On-premise HSM key store &amp; zero-knowledge relays
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-brand shrink-0" />
                  <span>Dedicated Principal Solutions Architect</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() =>
                alert(
                  "Enterprise Architecture Briefing requested. Our solutions team will reach out.",
                )
              }
              className="mt-10 w-full py-3 rounded-xl bg-surface hover:bg-card border border-line text-xs font-mono text-white text-center font-semibold transition-colors"
            >
              Request Architecture Briefing &rarr;
            </button>
          </div>
        </section>

        {/* 4. Interactive Dispatch Trajectory Calculator ("Dial your dispatch trajectory") */}
        <section className="ph-card p-8 sm:p-12 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Slider Form */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="label-caps text-brand">
                  LIVE BUDGET // VOLUME ESTIMATOR
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
                  Dial your dispatch trajectory.
                </h3>
                <p className="text-muted text-xs mt-2">
                  Tailor your projected packet volume per edge. Pricing scales
                  linearly based on the exact throughput your nodes demand.
                </p>
              </div>

              {/* Slider Component */}
              <div className="flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-subtle text-xs">
                    Monthly Egress Volume
                  </span>
                  <span className="text-brand font-bold text-xl">
                    {volumeSlider.toLocaleString()}{" "}
                    <span className="text-xs text-muted font-normal">pkts</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={100_000}
                  max={25_000_000}
                  step={100_000}
                  value={volumeSlider}
                  onChange={(e) => setVolumeSlider(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-surface accent-brand cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-subtle">
                  <span>100K (Hobbyist)</span>
                  <span>5M (Growth)</span>
                  <span>25M+ (High-Scale)</span>
                </div>
              </div>

              {/* Channels Distribution Estimate */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs pt-4 border-t border-line">
                <div className="p-3 rounded-xl bg-surface border border-line">
                  <span className="text-subtle label-caps block">
                    PUSH (60%)
                  </span>
                  <span className="text-white font-bold text-sm">
                    {Math.round((volumeSlider * 0.6) / 1000)}k
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-line">
                  <span className="text-subtle label-caps block">
                    EMAIL (30%)
                  </span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {Math.round((volumeSlider * 0.3) / 1000)}k
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-line">
                  <span className="text-subtle label-caps block">
                    SMS (10%)
                  </span>
                  <span className="text-purple-400 font-bold text-sm">
                    {Math.round((volumeSlider * 0.1) / 1000)}k
                  </span>
                </div>
              </div>
            </div>

            {/* Right Projected Cost Box */}
            <div className="lg:col-span-5 p-8 rounded-2xl bg-pitch/90 border border-brand/40 shadow-[0_0_30px_rgba(254,88,36,0.15)] flex flex-col justify-between">
              <div>
                <span className="label-caps text-subtle">
                  ESTIMATED RUN-RATE
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-5xl text-white">
                    ${finalCost.toLocaleString()}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    / billing cycle
                  </span>
                </div>
                <p className="font-mono text-[11px] text-subtle mt-1">
                  Guaranteed zero hidden carrier surcharges or packet drop
                  penalties.
                </p>

                <div className="mt-6 pt-4 border-t border-line space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Routing Topology:</span>
                    <span className="text-white font-bold">
                      12 Global Edge Nodes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Target Transit Latency:</span>
                    <span className="text-ok font-bold">&lt; 34ms E2E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Dedicated Support:</span>
                    <span className="text-brand font-bold">Included</span>
                  </div>
                </div>
              </div>

              <Link
                href="/composer"
                className="btn-glow mt-8 w-full py-3.5 rounded-xl bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(254,88,36,0.35)]"
              >
                <span>Deploy with This Volume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Architected for Uptime (Financial Penalty Backed) */}
        <section className="flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="label-caps text-brand">CONTRACTUAL GUARANTEE</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2">
              Architected for uptime, backed by financial penalties.
            </h2>
            <p className="text-muted text-sm mt-3">
              We credit your account automatically if our telemetry SLA metrics
              drop below contractual thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-card border border-line">
              <span className="label-caps text-brand">99.99% UPTIME</span>
              <h4 className="font-display font-bold text-lg text-white mt-1">
                Uptime Guarantee
              </h4>
              <p className="text-muted text-xs mt-2">
                Automatic tiered credits issued on any minute of degraded
                transit across major carriers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-line">
              <span className="label-caps text-cyan-400">SUB-50MS TRANSIT</span>
              <h4 className="font-display font-bold text-lg text-white mt-1">
                Latency Bounds
              </h4>
              <p className="text-muted text-xs mt-2">
                Direct edge peering guarantees packet ingestion to egress
                handoff under 50ms globally.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-line">
              <span className="label-caps text-purple-400">
                CRYPTOGRAPHIC PROOF
              </span>
              <h4 className="font-display font-bold text-lg text-white mt-1">
                Audit Traceability
              </h4>
              <p className="text-muted text-xs mt-2">
                Every dispatch packet receives a tamper-free HMAC-SHA256
                signature recorded in telemetry logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-line">
              <span className="label-caps text-ok">CARRIER FAILOVER</span>
              <h4 className="font-display font-bold text-lg text-white mt-1">
                Auto-Healing Mesh
              </h4>
              <p className="text-muted text-xs mt-2">
                Dynamic circuit breakers shift egress traffic if a carrier
                network experiences latency surges.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="ph-card p-10 sm:p-14 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <span className="label-caps text-brand">
              CUSTOM INFRASTRUCTURE INQUIRIES
            </span>
            <h3 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2">
              Need custom throughput benchmarks?
            </h3>
            <p className="text-muted text-sm mt-2">
              Our site reliability engineering team will test and model your
              dispatch profile across global carriers.
            </p>
          </div>
          <Link
            href="/composer"
            className="btn-glow px-8 py-4 rounded-full bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-[0_0_24px_rgba(254,88,36,0.4)]"
          >
            <span>Launch Live Test</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
