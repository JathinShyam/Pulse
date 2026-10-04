"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Screen0() {
  const router = useRouter();
  return (
    <>
      <div>
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 w-full z-50 bg-surface-pitch/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="h-20 max-w-[1440px] mx-auto px-margin-desktop flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-DEFAULT bg-primary-container flex items-center justify-center shadow-[0_0_24px_rgba(254,88,36,0.35)]">
                <span className="material-symbols-outlined text-surface-pitch text-[22px] font-bold">
                  bolt
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-surface-light">
                  PULSE
                </span>
                <span className="font-label-caps text-label-caps tracking-widest text-primary-container font-mono">
                  MISSION ENGINE
                </span>
              </div>
            </div>
            <nav
              className="hidden lg:flex items-center gap-space-md bg-surface-container-lowest px-space-md py-space-xs rounded-full"
              data-active-classes="bg-primary-container text-on-primary-container font-bold rounded-full"
            >
              <a
                className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-space-sm py-space-xs transition-colors"
                onClick={() => router.push("/composer")}
                style={{ cursor: "pointer" }}
              >
                Features
              </a>
              <a
                className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-space-sm py-space-xs transition-colors"
                data-path="gateways-carrier-routing-architecture"
              >
                Architecture
              </a>
              <a
                className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-space-sm py-space-xs transition-colors"
                data-path="gateways"
              >
                Gateways
              </a>
              <a
                aria-current="page"
                className="px-space-sm py-space-xs transition-colors bg-primary-container text-on-primary-container font-bold rounded-full"
                data-path="pricing-sla-tier-plans"
              >
                Pricing
              </a>
              <a
                className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-space-sm py-space-xs transition-colors"
                data-path="docs"
              >
                Documentation
              </a>
            </nav>
            <div className="flex items-center gap-space-md">
              <a
                className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
                onClick={() => router.push("/login")}
                style={{ cursor: "pointer" }}
              >
                Sign In
              </a>
              <button className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_8px_24px_-4px_rgba(254,88,36,0.35)] hover:bg-tertiary-container hover:text-on-tertiary-container transition-all">
                <span className="material-symbols-outlined text-[16px]">
                  electric_bolt
                </span>
                <span>Deploy Signal</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
            </div>
          </div>
        </motion.header>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full pt-20 bg-surface-pitch min-h-screen"
        >
          <div className="flex flex-col w-full">
            {/* Top Ambient Glow Field */}
            <div className="relative w-full overflow-hidden">
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary-container/20 via-primary-container/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
              {/* 1. Editorial Hero Section */}
              <section className="relative max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pt-12 pb-space-2xl flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high/90 text-primary-container shadow-md mb-space-lg backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                  <span className="font-label-caps text-label-caps tracking-widest uppercase">
                    // PRICING &amp; ENTERPRISE SLA GUARANTEES
                  </span>
                </div>
                <h1 className="font-display-hero text-display-hero text-surface-light max-w-5xl tracking-tighter mb-space-md">
                  Predictable scale. Sub-50ms latency.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-tertiary-container">
                    Zero dropped packets.
                  </span>
                </h1>
                <p className="font-body-xl text-body-xl text-text-muted-dark max-w-3xl mb-space-2xl">
                  Transparent usage-based pricing with guaranteed carrier SLAs,
                  automated cascading failover, and dedicated edge clusters
                  built for relentless mission dispatch.
                </p>
                {/* Billing Switcher Pill */}
                <div className="relative inline-flex items-center gap-2 p-1.5 rounded-full bg-surface-container-lowest shadow-xl">
                  <button
                    className="billing-btn px-space-lg py-space-sm rounded-full font-label-md text-label-md text-surface-light bg-surface-container-high transition-all"
                    id="btn-monthly"
                    onclick="switchBilling('monthly')"
                  >
                    Monthly Billing
                  </button>
                  <button
                    className="billing-btn px-space-lg py-space-sm rounded-full font-label-md text-label-md text-text-muted-dark hover:text-surface-light transition-all flex items-center gap-2"
                    id="btn-annual"
                    onclick="switchBilling('annual')"
                  >
                    <span>Annual Invoicing</span>
                    <span className="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase font-bold tracking-wider">
                      Save 20% + Ingress Pool
                    </span>
                  </button>
                </div>
              </section>
              {/* 2. Tier Comparison Cards */}
              <section className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pb-space-3xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-desktop items-stretch">
                  {/* Tier 1: Developer / Sandbox */}
                  <div className="flex flex-col justify-between p-space-xl rounded-lg bg-surface-card-dark shadow-xl hover:bg-surface-card-hover transition-colors group">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-widest font-mono">
                          01 // EVALUATION PHASE
                        </span>
                        <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-text-muted-dark group-hover:text-surface-light transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            terminal
                          </span>
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-surface-light mb-space-xs">
                        Developer Sandbox
                      </h3>
                      <p className="font-body-md text-body-md text-text-muted-dark min-h-[44px] mb-space-lg">
                        For engineering teams building, simulating, and
                        validating mission-critical dispatch pipelines.
                      </p>
                      <div className="flex items-baseline gap-2 mb-space-xl">
                        <span className="font-stat-counter text-stat-counter text-surface-light font-bold">
                          $0
                        </span>
                        <span className="font-body-md text-body-md text-text-muted-dark">
                          / forever
                        </span>
                      </div>
                      <div className="w-full h-px bg-surface-container-high mb-space-lg" />
                      <ul className="flex flex-col gap-space-sm mb-space-xl">
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>
                            <strong className="text-surface-light">
                              50,000
                            </strong>{" "}
                            dispatches / month
                          </span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>3 Core Channels (APNs, FCM, SES)</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>Shared cluster egress topology</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>48h live telemetry logs &amp; tracing</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>Global community Discord support</span>
                        </li>
                      </ul>
                    </div>
                    <a className="w-full py-space-md rounded-full bg-surface-container-high hover:bg-surface-bright text-surface-light font-label-md text-label-md text-center transition-all flex items-center justify-center gap-2">
                      <span>Start Building Free</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                  {/* Tier 2: Production Scale (Highlighted / Kinetic Anchor) */}
                  <div className="relative flex flex-col justify-between p-space-xl rounded-lg bg-surface-container-low shadow-[0_20px_50px_rgba(254,88,36,0.12)] -mt-2 lg:-mt-4 mb-2 lg:mb-0 group">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-space-md py-1 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase font-bold tracking-widest shadow-[0_4px_20px_rgba(254,88,36,0.45)] whitespace-nowrap">
                      RECOMMENDED FOR INFRASTRUCTURE
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-space-md pt-2">
                        <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-mono">
                          02 // VELOCITY CORE
                        </span>
                        <span className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined text-[18px]">
                            bolt
                          </span>
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-surface-light mb-space-xs">
                        Production Scale
                      </h3>
                      <p className="font-body-md text-body-md text-text-muted-dark min-h-[44px] mb-space-lg">
                        For high-velocity platforms demanding sub-50ms verified
                        delivery and automated carrier-grade fallback.
                      </p>
                      <div className="flex items-baseline gap-2 mb-space-xs">
                        <span
                          className="font-stat-counter text-stat-counter text-surface-light font-bold"
                          id="tier2-price"
                        >
                          $499
                        </span>
                        <span className="font-body-md text-body-md text-text-muted-dark">
                          / month
                        </span>
                      </div>
                      <p className="font-label-caps text-label-caps text-primary mb-space-lg font-mono">
                        +$0.0008 per dispatch beyond 1M base
                      </p>
                      <div className="w-full h-px bg-surface-container-high mb-space-lg" />
                      <ul className="flex flex-col gap-space-sm mb-space-xl">
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            check_circle
                          </span>
                          <span>
                            <strong className="text-surface-light">
                              1,000,000
                            </strong>{" "}
                            dispatches included / month
                          </span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            check_circle
                          </span>
                          <span>
                            All 5 channels (incl. Global SMS &amp; Webhooks)
                          </span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            check_circle
                          </span>
                          <span>Multi-region dynamic routing redundancy</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            check_circle
                          </span>
                          <span>
                            <strong className="text-surface-light">
                              99.95% SLA
                            </strong>{" "}
                            guaranteed carrier pass-through
                          </span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            check_circle
                          </span>
                          <span>15s automated fallback cascade routines</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            check_circle
                          </span>
                          <span>
                            30-day live trace stream &amp; audit export
                          </span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            check_circle
                          </span>
                          <span>24/7 dedicated escalation engineering</span>
                        </li>
                      </ul>
                    </div>
                    <a className="w-full py-space-md rounded-full bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-md text-label-md font-bold text-center shadow-[0_8px_32px_rgba(254,88,36,0.35)] transition-all flex items-center justify-center gap-2">
                      <span>Deploy Production Tier</span>
                      <span className="material-symbols-outlined text-[18px]">
                        bolt
                      </span>
                    </a>
                  </div>
                  {/* Tier 3: Hyperscale Enterprise */}
                  <div className="flex flex-col justify-between p-space-xl rounded-lg bg-surface-card-dark shadow-xl hover:bg-surface-card-hover transition-colors group">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-widest font-mono">
                          03 // DEDICATED FABRIC
                        </span>
                        <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-text-muted-dark group-hover:text-surface-light transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            hub
                          </span>
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-surface-light mb-space-xs">
                        Hyperscale Enterprise
                      </h3>
                      <p className="font-body-md text-body-md text-text-muted-dark min-h-[44px] mb-space-lg">
                        For Tier-1 financial institutions, defense networks, and
                        high-frequency real-time systems.
                      </p>
                      <div className="flex items-baseline gap-2 mb-space-xl">
                        <span className="font-stat-counter text-stat-counter text-surface-light font-bold">
                          Custom
                        </span>
                        <span className="font-body-md text-body-md text-text-muted-dark">
                          / tailored SLA
                        </span>
                      </div>
                      <div className="w-full h-px bg-surface-container-high mb-space-lg" />
                      <ul className="flex flex-col gap-space-sm mb-space-xl">
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>
                            <strong className="text-surface-light">
                              Unlimited
                            </strong>{" "}
                            volume &amp; bursting reserves
                          </span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>Dedicated single-tenant edge clusters</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>
                            <strong className="text-surface-light">
                              99.999% SLA
                            </strong>{" "}
                            (&lt; 20ms p95 global latency)
                          </span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>Custom SMPP carrier direct interconnects</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>SOC2 Type II &amp; HIPAA BAA compliant</span>
                        </li>
                        <li className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            check_circle
                          </span>
                          <span>
                            Designated Principal Technical Account Manager
                          </span>
                        </li>
                      </ul>
                    </div>
                    <a className="w-full py-space-md rounded-full bg-surface-container-high hover:bg-surface-bright text-surface-light font-label-md text-label-md text-center transition-all flex items-center justify-center gap-2">
                      <span>Schedule Architecture Review</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              </section>
              {/* 3. Interactive Volume Calculator */}
              <section className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pb-space-3xl">
                <div className="p-space-xl lg:p-space-2xl rounded-lg bg-surface-card-dark shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-primary-container/10 blur-[100px] pointer-events-none rounded-full" />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
                    {/* Slider & Control Side */}
                    <div className="lg:col-span-7 flex flex-col gap-space-lg">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-primary-container" />
                        <span className="font-label-caps text-label-caps text-primary uppercase font-mono tracking-widest">
                          LIVE BANDWIDTH &amp; DISPATCH ESTIMATOR
                        </span>
                      </div>
                      <h2 className="font-headline-lg text-headline-lg text-surface-light">
                        Dial your dispatch trajectory.
                      </h2>
                      <p className="font-body-md text-body-md text-text-muted-dark">
                        Adjust your projected payload envelope. Overages
                        calculate down to the exact microsecond packet dispatch.
                      </p>
                      <div className="flex flex-col gap-space-md pt-space-md">
                        <div className="flex items-center justify-between">
                          <span className="font-label-md text-label-md text-surface-light font-semibold">
                            Monthly Projected Dispatches
                          </span>
                          <span
                            className="font-headline-sm text-headline-sm text-primary font-mono font-bold"
                            id="slider-val-label"
                          >
                            5,000,000
                          </span>
                        </div>
                        {/* Styled Volume Slider */}
                        <input
                          className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary-container"
                          id="volume-slider"
                          max={25000000}
                          min={100000}
                          oninput="updateCalculator(this.value)"
                          step={100000}
                          type="range"
                          defaultValue={5000000}
                        />
                        <div className="flex items-center justify-between text-text-muted-dark font-label-caps text-label-caps font-mono">
                          <span>100K MSG</span>
                          <span>5M MSG</span>
                          <span>15M MSG</span>
                          <span>25M+ MSG</span>
                        </div>
                      </div>
                      {/* Protocol Weight Allocation */}
                      <div className="grid grid-cols-3 gap-space-md pt-space-sm">
                        <div className="p-space-md rounded-DEFAULT bg-surface-container-lowest">
                          <div className="flex items-center gap-1.5 text-text-muted-dark font-label-caps text-label-caps mb-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">
                              notifications_active
                            </span>
                            <span>PUSH (APNs/FCM)</span>
                          </div>
                          <div
                            className="font-headline-sm text-headline-sm text-surface-light font-mono"
                            id="metric-push"
                          >
                            3.00M
                          </div>
                          <div className="font-label-caps text-label-caps text-text-muted-dark">
                            60% traffic share
                          </div>
                        </div>
                        <div className="p-space-md rounded-DEFAULT bg-surface-container-lowest">
                          <div className="flex items-center gap-1.5 text-text-muted-dark font-label-caps text-label-caps mb-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">
                              mail
                            </span>
                            <span>HIGH-SPEED EMAIL</span>
                          </div>
                          <div
                            className="font-headline-sm text-headline-sm text-surface-light font-mono"
                            id="metric-email"
                          >
                            1.25M
                          </div>
                          <div className="font-label-caps text-label-caps text-text-muted-dark">
                            25% traffic share
                          </div>
                        </div>
                        <div className="p-space-md rounded-DEFAULT bg-surface-container-lowest">
                          <div className="flex items-center gap-1.5 text-text-muted-dark font-label-caps text-label-caps mb-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">
                              sms
                            </span>
                            <span>GLOBAL SMS</span>
                          </div>
                          <div
                            className="font-headline-sm text-headline-sm text-surface-light font-mono"
                            id="metric-sms"
                          >
                            750K
                          </div>
                          <div className="font-label-caps text-label-caps text-text-muted-dark">
                            15% traffic share
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Live Breakdown Result Card */}
                    <div className="lg:col-span-5 p-space-xl rounded-DEFAULT bg-surface-container-low flex flex-col justify-between shadow-lg">
                      <div className="flex flex-col gap-space-md">
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider font-mono">
                            ESTIMATED RUN-RATE
                          </span>
                          <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps font-mono">
                            SLA TIER: PRODUCTION
                          </span>
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span
                              className="font-stat-counter text-stat-counter text-surface-light font-bold"
                              id="calc-total"
                            >
                              $3,699
                            </span>
                            <span className="font-body-md text-body-md text-text-muted-dark">
                              / billing cycle
                            </span>
                          </div>
                          <div
                            className="font-label-caps text-label-caps text-primary font-mono mt-1"
                            id="calc-overage"
                          >
                            Includes $499 base + $3,200 overage allowance
                          </div>
                        </div>
                        {/* Inline Visual Sparkline / Bar */}
                        <div className="flex flex-col gap-1.5 pt-space-xs">
                          <div className="flex justify-between font-label-caps text-label-caps text-text-muted-dark font-mono">
                            <span>PACKET BURST CAPACITY</span>
                            <span
                              className="text-surface-light"
                              id="calc-burst"
                            >
                              42,500 msg/sec
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden flex">
                            <div
                              className="h-full bg-primary-container"
                              style={{ width: "60%" }}
                            />
                            <div
                              className="h-full bg-tertiary"
                              style={{ width: "25%" }}
                            />
                            <div
                              className="h-full bg-primary"
                              style={{ width: "15%" }}
                            />
                          </div>
                        </div>
                        <div className="p-space-md rounded-DEFAULT bg-surface-container-lowest flex flex-col gap-space-xs text-text-muted-dark font-body-md text-body-md">
                          <div className="flex justify-between">
                            <span>Routing Redundancy</span>
                            <span className="text-surface-light font-mono">
                              3 Global Availability Zones
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Guaranteed Egress Latency</span>
                            <span className="text-surface-light font-mono">
                              &lt; 38ms P95
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Failover Retries</span>
                            <span className="text-surface-light font-mono">
                              Infinite Idempotent
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="mt-space-lg w-full py-space-md rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold hover:bg-tertiary-container transition-all flex items-center justify-center gap-2">
                        <span>Lock In Calculator Quote</span>
                        <span className="material-symbols-outlined text-[16px]">
                          lock
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              {/* 4. Enterprise SLA & Guarantee Grid */}
              <section className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pb-space-3xl">
                <div className="flex flex-col gap-space-md mb-space-2xl">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2 h-2 rounded-full bg-primary-container" />
                    <span className="font-label-caps text-label-caps text-primary uppercase font-mono tracking-widest">
                      CONTRACTUAL ASSURANCE
                    </span>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                    <h2 className="font-headline-xl text-headline-xl text-surface-light max-w-2xl">
                      Architected for uptime, backed by financial penalties.
                    </h2>
                    <p className="font-body-md text-body-md text-text-muted-dark max-w-md">
                      If our global dispatch pipeline breaches agreed latency or
                      availability thresholds, service credits are disbursed
                      automatically to your ledger.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                  {/* SLA Pillar 1 */}
                  <div className="p-space-lg rounded-lg bg-surface-card-dark shadow-md flex flex-col justify-between hover:bg-surface-card-hover transition-colors group">
                    <div>
                      <div className="w-12 h-12 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary mb-space-lg group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
                        <span className="material-symbols-outlined text-[24px]">
                          verified_user
                        </span>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-surface-light mb-space-xs">
                        99.99% Uptime Guarantee
                      </div>
                      <p className="font-body-md text-body-md text-text-muted-dark mb-space-md">
                        High-availability distributed consensus across 12 tier-4
                        cloud edge clusters. Zero single points of failure.
                      </p>
                    </div>
                    <div className="font-label-caps text-label-caps text-primary font-mono uppercase tracking-wider">
                      CREDIT: 100% CYCLE REFUND &lt; 99.9%
                    </div>
                  </div>
                  {/* SLA Pillar 2 */}
                  <div className="p-space-lg rounded-lg bg-surface-card-dark shadow-md flex flex-col justify-between hover:bg-surface-card-hover transition-colors group">
                    <div>
                      <div className="w-12 h-12 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary mb-space-lg group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
                        <span className="material-symbols-outlined text-[24px]">
                          speed
                        </span>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-surface-light mb-space-xs">
                        Sub-50ms P95 Global Latency
                      </div>
                      <p className="font-body-md text-body-md text-text-muted-dark mb-space-md">
                        From our ingress endpoint to carrier shortcode handoff
                        in 48 milliseconds or less across North America and
                        Europe.
                      </p>
                    </div>
                    <div className="font-label-caps text-label-caps text-primary font-mono uppercase tracking-wider">
                      MEASURED VIA INDEPENDENT RUM PROBES
                    </div>
                  </div>
                  {/* SLA Pillar 3 */}
                  <div className="p-space-lg rounded-lg bg-surface-card-dark shadow-md flex flex-col justify-between hover:bg-surface-card-hover transition-colors group">
                    <div>
                      <div className="w-12 h-12 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary mb-space-lg group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
                        <span className="material-symbols-outlined text-[24px]">
                          security
                        </span>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-surface-light mb-space-xs">
                        Cryptographic Trace Immutability
                      </div>
                      <p className="font-body-md text-body-md text-text-muted-dark mb-space-md">
                        Every dispatched message receipt is signed via ed25519
                        payload attestations, eliminating delivery disputes.
                      </p>
                    </div>
                    <div className="font-label-caps text-label-caps text-primary font-mono uppercase tracking-wider">
                      SOC2 TYPE II AUDIT ARCHIVE
                    </div>
                  </div>
                  {/* SLA Pillar 4 */}
                  <div className="p-space-lg rounded-lg bg-surface-card-dark shadow-md flex flex-col justify-between hover:bg-surface-card-hover transition-colors group">
                    <div>
                      <div className="w-12 h-12 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary mb-space-lg group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
                        <span className="material-symbols-outlined text-[24px]">
                          alt_route
                        </span>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-surface-light mb-space-xs">
                        Carrier Auto-Healing
                      </div>
                      <p className="font-body-md text-body-md text-text-muted-dark mb-space-md">
                        Real-time upstream rate-limit detection triggers
                        automated carrier hopping in &lt;15 seconds with no
                        manual intervention.
                      </p>
                    </div>
                    <div className="font-label-caps text-label-caps text-primary font-mono uppercase tracking-wider">
                      AUTOMATED RE-ROUTE PROTOCOL
                    </div>
                  </div>
                </div>
              </section>
              {/* 5. Phenomenon Studio Signature Conversion Footer Banner */}
              <section className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pb-space-3xl">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-surface-card-dark via-surface-container-high to-surface-card-dark p-space-xl md:p-space-2xl shadow-2xl group">
                  <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-container/20 blur-[90px] group-hover:bg-primary-container/30 transition-all" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-xl">
                    <div className="flex flex-col gap-space-xs max-w-2xl">
                      <span className="font-label-caps text-label-caps text-primary uppercase font-mono tracking-widest">
                        // CUSTOM INFRASTRUCTURE WORKBENCH
                      </span>
                      <h3 className="font-headline-xl text-headline-xl text-surface-light leading-tight">
                        Need custom throughput benchmarks?{" "}
                        <span className="text-primary">Let's collaborate.</span>
                      </h3>
                      <p className="font-body-md text-body-md text-text-muted-dark">
                        Our core infrastructure engineers will simulate your
                        peak event dispatches and formulate a tailor-made SLA
                        package within 24 hours.
                      </p>
                    </div>
                    <div className="flex items-center gap-space-md">
                      <a className="px-space-xl py-space-md rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_8px_32px_rgba(254,88,36,0.4)] hover:bg-tertiary-container transition-all flex items-center gap-space-sm whitespace-nowrap">
                        <span>Request Stress Test Run</span>
                        <span className="material-symbols-outlined text-[18px]">
                          play_arrow
                        </span>
                      </a>
                      <a className="w-14 h-14 rounded-full bg-surface-container-lowest hover:bg-surface-bright text-surface-light flex items-center justify-center transition-all group-hover:rotate-45 transform">
                        <span className="material-symbols-outlined text-[24px]">
                          arrow_outward
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </motion.main>
        <footer className="w-full bg-surface-container-lowest pt-space-3xl pb-space-2xl">
          <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col gap-space-2xl">
            <div className="flex items-center justify-between p-space-md rounded-DEFAULT bg-surface-container-low">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container -ml-3.5" />
                  <span className="font-label-caps text-label-caps text-surface-light font-mono">
                    ALL 12 CORE REGIONS OPERATIONAL
                  </span>
                </div>
                <span className="text-border-dark">|</span>
                <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                  GLOBAL THROUGHPUT: 94.8k msg/sec
                </span>
                <span className="text-border-dark">|</span>
                <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                  DELIVERY SUCCESS RATE: 99.998%
                </span>
              </div>
              <div className="font-label-caps text-label-caps text-primary-container font-mono">
                SLA P99: 12ms
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-desktop">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-7 h-7 rounded-DEFAULT bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-surface-pitch text-[16px] font-bold">
                      bolt
                    </span>
                  </div>
                  <span className="font-headline-sm text-headline-sm tracking-tight text-surface-light">
                    PULSE
                  </span>
                </div>
                <p className="font-body-md text-body-md text-text-muted-dark">
                  Next-generation low-latency notification dispatch and carrier
                  telemetry fabric engineered for mission-critical scale.
                </p>
              </div>
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-surface-light">
                  ROUTING FABRIC
                </span>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Multi-carrier Failover
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Smart SMS Shortcodes
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  WhatsApp Enterprise
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  APNs / FCM Queues
                </a>
              </div>
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-surface-light">
                  DEVELOPERS
                </span>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  REST &amp; gRPC SDKs
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  CLI Signal Tools
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Telemetry Stream Webhooks
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Security &amp; SOC2 Type II
                </a>
              </div>
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-surface-light">
                  COMMAND
                </span>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Carrier Latency Index
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Cluster Status Hub
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Enterprise SLA Guarantee
                </a>
                <a className="font-body-md text-body-md text-text-muted-dark hover:text-on-surface transition-colors">
                  Incident Archives
                </a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between pt-space-xl border-t border-border-dark">
              <span className="font-label-caps text-label-caps text-text-muted-dark">
                © 2025 PULSE TELEMETRY ENGINE INC. ARCHITECTED FOR RESILIENCE.
              </span>
              <div className="flex items-center gap-space-lg">
                <a className="font-label-caps text-label-caps text-text-muted-dark hover:text-on-surface transition-colors">
                  PRIVACY PROTOCOL
                </a>
                <a className="font-label-caps text-label-caps text-text-muted-dark hover:text-on-surface transition-colors">
                  TERMS OF SERVICE
                </a>
                <a className="font-label-caps text-label-caps text-text-muted-dark hover:text-on-surface transition-colors">
                  TRUST CENTER
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
