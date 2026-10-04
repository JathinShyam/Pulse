"use client";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMetrics = async () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const { data } = await axios.get("http://localhost:8000/api/metrics", {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {
          "X-API-Key": "dummy-key-for-now", // Fallback for dev mode
        },
  });
  return data;
};

export default function Screen3() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
    refetchInterval: 5000,
  });

  const deliverability = metrics?.deliverability || "99.98%";
  const totalVolume = metrics?.total_volume || "6.48M";
  const volumeTrend = metrics?.volume_trend || "+14.2%";
  const latency = metrics?.latency || "18ms";

  return (
    <>
      <div>
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col pt-space-lg pb-space-lg justify-between transition-all"
          id="app-sidebar"
        >
          <div className="px-space-lg flex flex-col gap-space-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_14px_rgba(254,88,36,0.65)]" />
                </div>
                <div className="flex flex-col sidebar-expand-label">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight uppercase leading-none">
                    PULSE
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    ENGINE V4.19
                  </span>
                </div>
              </div>
              <button
                id="sidebar-toggle-btn"
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
                title="Toggle Sidebar"
              >
                <span
                  className="material-symbols-outlined text-[18px] transition-transform"
                  id="sidebar-toggle-icon"
                >
                  first_page
                </span>
              </button>
            </div>
            <div className="px-space-md py-space-sm rounded-DEFAULT bg-surface-container-low flex items-center justify-between overflow-hidden">
              <div className="flex items-center gap-space-xs min-w-0">
                <span className="material-symbols-outlined text-primary-container text-[18px] shrink-0">
                  hub
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate sidebar-expand-label">
                  cluster-us-east-1
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px] shrink-0 sidebar-expand-label">
                unfold_more
              </span>
            </div>
            <div className="px-space-xs flex items-center justify-between sidebar-expand-label">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                MONITORING
              </span>
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="font-label-caps text-label-caps text-on-surface">
                  38MS PING
                </span>
              </div>
            </div>
            <nav
              className="flex flex-col gap-space-xs px-0"
              data-active-classes="bg-primary-container text-on-primary-container font-bold rounded-DEFAULT"
            >
              <a
                title="Overview"
                className="flex items-center gap-space-md px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                data-path="overview"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  grid_view
                </span>
                <span className="font-label-md text-label-md sidebar-expand-label">
                  Overview
                </span>
              </a>
              <a
                title="Analytics"
                aria-current="page"
                className="flex items-center gap-space-md px-space-md py-space-sm transition-all bg-primary-container text-on-primary-container font-bold rounded-DEFAULT"
                data-path="analytics"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  monitoring
                </span>
                <span className="font-label-md text-label-md sidebar-expand-label">
                  Analytics
                </span>
              </a>
              <a
                title="Dispatch"
                className="flex items-center gap-space-md px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                data-path="dispatch"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  bolt
                </span>
                <span className="font-label-md text-label-md sidebar-expand-label">
                  Dispatch
                </span>
              </a>
              <a
                title="Gateways"
                className="flex items-center gap-space-md px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                data-path="gateways"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  alt_route
                </span>
                <span className="font-label-md text-label-md sidebar-expand-label">
                  Gateways
                </span>
              </a>
              <a
                title="Logs"
                className="flex items-center gap-space-md px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                data-path="logs"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  terminal
                </span>
                <span className="font-label-md text-label-md sidebar-expand-label">
                  Logs
                </span>
              </a>
              <a
                title="Settings"
                className="flex items-center gap-space-md px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                data-path="settings"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  tune
                </span>
                <span className="font-label-md text-label-md sidebar-expand-label">
                  Settings
                </span>
              </a>
            </nav>
          </div>
          <div className="px-space-lg flex flex-col gap-space-md">
            <a
              title="Fast Dispatch"
              className="w-full flex items-center justify-center gap-space-xs py-space-md bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-md text-label-md font-bold rounded-full shadow-[0_8px_24px_-4px_rgba(254,88,36,0.35)] transition-all overflow-hidden"
              data-path="dispatch"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">
                rocket_launch
              </span>
              <span className="sidebar-expand-label">Fast Dispatch</span>
            </a>
            <div className="flex items-center justify-between p-space-sm rounded-DEFAULT bg-surface-container-low overflow-hidden">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                </div>
                <div className="flex flex-col truncate sidebar-expand-label">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    alex.rivera@corp
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    OPERATOR
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 sidebar-expand-label">
                more_vert
              </span>
            </div>
          </div>
        </motion.aside>
        <div className="pl-72 transition-all" id="main-layout-wrapper">
          <header
            className="fixed top-0 left-72 right-0 h-20 bg-surface-pitch/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl transition-all"
            id="app-header"
          >
            <div className="flex items-center gap-space-md">
              <div className="px-space-md py-space-xs rounded-full bg-surface-container-high flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                <span className="font-label-caps text-label-caps text-on-surface uppercase">
                  ALL GATEWAYS OPERATIONAL
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-space-xs text-on-surface-variant font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[16px]">
                  sync
                </span>
                <span className>SYNCED VIA QUIC 0-RTT</span>
              </div>
            </div>
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  search
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Search payloads, events, keys...
                </span>
              </div>
              <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
              </button>
              <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  shield
                </span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
            </div>
          </header>
          <main className="relative pt-20 bg-surface-pitch min-h-screen px-space-xl pb-space-2xl">
            <div className="flex flex-col w-full gap-space-xl">
              {/* Command Header Bar */}
              <header className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg p-space-lg rounded-DEFAULT bg-surface-card-dark shadow-xl overflow-hidden">
                <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
                <div className="flex flex-wrap items-center gap-space-md z-10">
                  <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high shadow-inner">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container shadow-[0_0_8px_rgba(254,88,36,0.8)]" />
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                      Cluster US-East-1 (Primary)
                    </span>
                    <span className="font-label-caps text-label-caps text-text-muted-dark px-1.5 py-0.5 rounded bg-surface-container text-[9px]">
                      ACTIVE
                    </span>
                  </div>
                  <div className="h-6 w-px bg-surface-container-highest hidden sm:block" />
                  <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">
                      bolt
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-label-caps text-label-caps text-text-muted-dark uppercase">
                        Ingestion
                      </span>
                      <span
                        className="font-headline-sm text-headline-sm text-on-surface font-mono"
                        id="ticker-rate"
                      >
                        3,836.2
                      </span>
                      <span className="font-label-caps text-label-caps text-text-muted-dark lowercase">
                        msg/s
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-lowest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="font-label-caps text-label-caps text-emerald-400">
                      0.00% LOSS
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-md z-10">
                  {/* Timeframe Filter Tabs */}
                  <div
                    className="flex items-center p-1 rounded-full bg-surface-container-lowest"
                    id="timeframe-selector"
                  >
                    <button
                      className="px-space-md py-1 rounded-full font-label-md text-label-md text-text-muted-dark hover:text-on-surface transition-all"
                      type="button"
                    >
                      LIVE
                    </button>
                    <button
                      className="px-space-md py-1 rounded-full font-label-md text-label-md text-text-muted-dark hover:text-on-surface transition-all"
                      type="button"
                    >
                      1H
                    </button>
                    <button
                      className="px-space-md py-1 rounded-full font-label-md text-text-muted-dark hover:text-on-surface transition-all"
                      type="button"
                    >
                      24H
                    </button>
                    <button
                      className="px-space-md py-1 rounded-full font-label-md text-label-md text-text-muted-dark hover:text-on-surface transition-all"
                      type="button"
                    >
                      7D
                    </button>
                    <button
                      className="px-space-md py-1 rounded-full font-label-md text-label-md bg-primary-container text-on-primary-container font-bold shadow-[0_4px_12px_-2px_rgba(254,88,36,0.4)]"
                      type="button"
                    >
                      30D
                    </button>
                  </div>
                  {/* Action Button */}
                  <button
                    className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-full bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_8px_24px_-4px_rgba(254,88,36,0.4)] transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      bolt
                    </span>
                    <span className>Deploy Signal</span>
                  </button>
                </div>
              </header>
              {/* Metric Overview Row (4 KPI Cards) */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Deliverability */}
                <div className="relative p-space-lg rounded-DEFAULT bg-surface-card-dark shadow-md flex flex-col justify-between overflow-hidden group hover:bg-surface-card-hover transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                      DELIVERABILITY
                    </span>
                    <div className="flex items-center gap-1 text-emerald-400 font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[14px]">
                        trending_up
                      </span>
                      <span className>+0.12%</span>
                    </div>
                  </div>
                  <div className="mt-space-md flex items-baseline justify-between">
                    <span className="font-stat-counter text-headline-xl text-on-surface font-extrabold tracking-tight">
                      99.982
                      <span className="text-headline-md text-text-muted-dark">
                        %
                      </span>
                    </span>
                  </div>
                  <div className="mt-space-sm flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark">
                      SLA Baseline: 99.90%
                    </span>
                    <span className="font-label-caps text-label-caps text-primary-container">
                      HIGH CONF
                    </span>
                  </div>
                  {/* Mini Sparkline inline SVG */}
                  <div className="mt-space-sm w-full h-8 flex items-end">
                    <svg
                      className="w-full h-8 overflow-visible"
                      preserveAspectRatio="none"
                      viewBox="0 0 160 32"
                    >
                      <path
                        d="M0 24 L20 22 L40 25 L60 16 L80 18 L100 12 L120 14 L140 8 L160 6"
                        fill="none"
                        stroke="#fe5824"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                      <line
                        stroke="#333536"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        x1={0}
                        x2={160}
                        y1={20}
                        y2={20}
                      />
                    </svg>
                  </div>
                </div>
                {/* Total Volume */}
                <div className="relative p-space-lg rounded-DEFAULT bg-surface-card-dark shadow-md flex flex-col justify-between overflow-hidden group hover:bg-surface-card-hover transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                      TOTAL VOLUME
                    </span>
                    <div className="flex items-center gap-1 text-primary-container font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[14px]">
                        north_east
                      </span>
                      <span className>{volumeTrend}</span>
                    </div>
                  </div>
                  <div className="mt-space-md flex items-baseline justify-between">
                    <span className="font-stat-counter text-headline-xl text-on-surface font-extrabold tracking-tight">
                      {totalVolume}
                    </span>
                  </div>
                  <div className="mt-space-sm flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark">
                      Peak: 4,210 msg/sec
                    </span>
                    <span className="font-label-caps text-label-caps text-text-muted-dark">
                      30-DAY WINDOW
                    </span>
                  </div>
                  <div className="mt-space-sm w-full h-8 flex items-end">
                    <svg
                      className="w-full h-8 overflow-visible"
                      preserveAspectRatio="none"
                      viewBox="0 0 160 32"
                    >
                      <path
                        d="M0 28 L20 26 L40 22 L60 25 L80 18 L100 15 L120 9 L140 12 L160 4"
                        fill="none"
                        stroke="#0891b2"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>
                {/* P95 Transit Latency */}
                <div className="relative p-space-lg rounded-DEFAULT bg-surface-card-dark shadow-md flex flex-col justify-between overflow-hidden group hover:bg-surface-card-hover transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                      P95 TRANSIT LATENCY
                    </span>
                    <div className="flex items-center gap-1 text-emerald-400 font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_downward
                      </span>
                      <span className>-6ms OPT</span>
                    </div>
                  </div>
                  <div className="mt-space-md flex items-baseline justify-between">
                    <span className="font-stat-counter text-headline-xl text-on-surface font-extrabold tracking-tight">
                      38
                      <span className="text-headline-md text-text-muted-dark">
                        ms
                      </span>
                    </span>
                  </div>
                  <div className="mt-space-sm flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark">
                      Edge Ping: {latency}
                    </span>
                    <span className="font-label-caps text-label-caps text-emerald-400">
                      OPTIMAL
                    </span>
                  </div>
                  <div className="mt-space-sm w-full h-8 flex items-end">
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
                <div className="relative p-space-lg rounded-DEFAULT bg-surface-card-dark shadow-md flex flex-col justify-between overflow-hidden group hover:bg-surface-card-hover transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                      ACTIVE ROUTING NODES
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="mt-space-md flex items-baseline justify-between">
                    <span className="font-stat-counter text-headline-xl text-on-surface font-extrabold tracking-tight">
                      48
                      <span className="text-headline-md text-text-muted-dark">
                        /48
                      </span>
                    </span>
                  </div>
                  <div className="mt-space-sm flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-text-muted-dark">
                      Mesh Convergence: 100%
                    </span>
                    <span className="font-label-caps text-label-caps text-emerald-400">
                      ALL HEALTHY
                    </span>
                  </div>
                  {/* Node Grid Graphic */}
                  <div className="mt-space-sm w-full h-8 grid grid-cols-12 gap-1 items-center">
                    <span className="h-2 rounded-sm bg-primary-container" />
                    <span className="h-2 rounded-sm bg-primary-container" />
                    <span className="h-2 rounded-sm bg-primary-container" />
                    <span className="h-2 rounded-sm bg-primary-container" />
                    <span className="h-2 rounded-sm bg-cyan-400" />
                    <span className="h-2 rounded-sm bg-cyan-400" />
                    <span className="h-2 rounded-sm bg-cyan-400" />
                    <span className="h-2 rounded-sm bg-cyan-400" />
                    <span className="h-2 rounded-sm bg-purple-400" />
                    <span className="h-2 rounded-sm bg-purple-400" />
                    <span className="h-2 rounded-sm bg-purple-400" />
                    <span className="h-2 rounded-sm bg-emerald-400" />
                  </div>
                </div>
              </section>
              {/* Primary Visualizer Card */}
              <section className="relative p-space-xl rounded-DEFAULT bg-surface-card-dark shadow-2xl flex flex-col gap-space-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-space-sm">
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                        Dispatched Volume &amp; Throughput by Protocol
                      </h2>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-caps text-label-caps">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
                        LIVE STREAM
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-text-muted-dark">
                      Protocol density mapped dynamically across active
                      distribution clusters
                    </p>
                  </div>
                  {/* Controls & Legend */}
                  <div className="flex flex-wrap items-center gap-space-lg">
                    <div className="flex items-center gap-space-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-primary-container" />
                        <span className="font-label-md text-label-md text-on-surface">
                          Push Notification
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: "#0891b2" }}
                        />
                        <span className="font-label-md text-label-md text-on-surface">
                          Transactional Email
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-purple-400" />
                        <span className="font-label-md text-label-md text-on-surface">
                          Direct SMS
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center p-1 rounded-full bg-surface-container-lowest">
                      <button
                        className="px-space-md py-1 rounded-full font-label-md text-label-md bg-surface-container-high text-on-surface font-semibold shadow-sm"
                        type="button"
                      >
                        Hourly
                      </button>
                      <button
                        className="px-space-md py-1 rounded-full font-label-md text-label-md text-text-muted-dark hover:text-on-surface transition-all"
                        type="button"
                      >
                        Daily
                      </button>
                      <button
                        className="px-space-md py-1 rounded-full font-label-md text-label-md text-text-muted-dark hover:text-on-surface transition-all"
                        type="button"
                      >
                        Weekly
                      </button>
                    </div>
                  </div>
                </div>
                {/* Chart Canvas Container */}
                <div className="relative w-full h-80 rounded-DEFAULT bg-surface-pitch/70 p-space-md overflow-hidden flex flex-col justify-between">
                  {/* Background Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-space-md pointer-events-none opacity-20">
                    <div className="w-full h-px bg-surface-container-highest" />
                    <div className="w-full h-px bg-surface-container-highest" />
                    <div className="w-full h-px bg-surface-container-highest" />
                    <div className="w-full h-px bg-surface-container-highest" />
                    <div className="w-full h-px bg-surface-container-highest" />
                  </div>
                  {/* Main Multi-line SVG chart with smooth curves and gradient fills */}
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
                          x2="0%"
                          y1="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#fe5824"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="100%"
                            stopColor="#fe5824"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="grad-email"
                          x1="0%"
                          x2="0%"
                          y1="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#0891b2"
                            stopOpacity="0.28"
                          />
                          <stop
                            offset="100%"
                            stopColor="#0891b2"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="grad-sms"
                          x1="0%"
                          x2="0%"
                          y1="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a78bfa"
                            stopOpacity="0.12"
                          />
                          <stop
                            offset="100%"
                            stopColor="#a78bfa"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      {/* Push Stream (Vibrant Orange) Area + Line */}
                      <polygon
                        fill="url(#grad-push)"
                        points="0,240 0,140 100,120 200,150 300,90 400,110 500,60 600,40 700,95 800,75 900,110 1000,65 1000,240"
                      />
                      <path
                        d="M0,140 C100,120 150,150 200,150 C250,150 270,90 300,90 C330,90 370,110 400,110 C450,110 470,60 500,60 C530,60 570,40 600,40 C630,40 670,95 700,95 C730,95 770,75 800,75 C830,75 870,110 900,110 C930,110 970,65 1000,65"
                        fill="none"
                        stroke="#fe5824"
                        strokeLinecap="round"
                        strokeWidth={3}
                      />
                      {/* Email Stream (Cyan) Area + Line */}
                      <polygon
                        fill="url(#grad-email)"
                        points="0,240 0,170 100,160 200,180 300,130 400,140 500,115 600,90 700,130 800,120 900,145 1000,110 1000,240"
                      />
                      <path
                        d="M0,170 C100,160 150,180 200,180 C250,180 270,130 300,130 C330,130 370,140 400,140 C450,140 470,115 500,115 C530,115 570,90 600,90 C630,90 670,130 700,130 C730,130 770,120 800,120 C830,120 870,145 900,145 C930,145 970,110 1000,110"
                        fill="none"
                        stroke="#0891b2"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                      {/* Direct SMS (Violet) Area + Line */}
                      <polygon
                        fill="url(#grad-sms)"
                        points="0,240 0,200 100,195 200,210 300,175 400,185 500,160 600,150 700,170 800,165 900,180 1000,155 1000,240"
                      />
                      <path
                        d="M0,200 C100,195 150,210 200,210 C250,210 270,175 300,175 C330,175 370,185 400,185 C450,185 470,160 500,160 C530,160 570,150 600,150 C630,150 670,170 700,170 C730,170 770,165 800,165 C830,165 870,180 900,180 C930,180 970,155 1000,155"
                        fill="none"
                        stroke="#a78bfa"
                        strokeDasharray="4 2"
                        strokeLinecap="round"
                        strokeWidth={2}
                      />
                      {/* Peak Marker Line at X=600 */}
                      <line
                        opacity="0.8"
                        stroke="#fe5824"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                        x1={600}
                        x2={600}
                        y1={20}
                        y2={240}
                      />
                      <circle
                        cx={600}
                        cy={40}
                        fill="#fe5824"
                        r={5}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                      <circle
                        cx={600}
                        cy={90}
                        fill="#0891b2"
                        r={4}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={600}
                        cy={150}
                        fill="#a78bfa"
                        r={4}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </svg>
                    {/* Tooltip Overlay */}
                    <div className="absolute left-[54%] top-4 -translate-x-1/2 p-space-md rounded-DEFAULT bg-surface-container-high/95 backdrop-blur-md shadow-2xl z-20 flex flex-col gap-2 min-w-[210px] pointer-events-none">
                      <div className="flex items-center justify-between border-b border-surface-container-highest pb-1.5">
                        <span className="font-label-caps text-label-caps text-on-surface font-mono">
                          OCT 24 • 18:00 UTC
                        </span>
                        <span className="font-label-caps text-label-caps text-primary-container font-bold">
                          PEAK SURGE
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 font-label-md text-label-md">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="w-2 h-2 rounded-full bg-primary-container" />
                            Push APNs/FCM
                          </span>
                          <span className="font-mono text-on-surface font-bold">
                            142,480/s
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-on-surface-variant">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#0891b2" }}
                            />
                            SES Transact
                          </span>
                          <span className="font-mono text-on-surface font-bold">
                            88,210/s
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                            Carrier SMPP
                          </span>
                          <span className="font-mono text-on-surface font-bold">
                            45,102/s
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* X-Axis Labels */}
                  <div className="flex justify-between items-center px-2 pt-2 text-text-muted-dark font-label-caps text-label-caps font-mono">
                    <span className>12:00 UTC</span>
                    <span className>14:00 UTC</span>
                    <span className>16:00 UTC</span>
                    <span className="text-primary-container font-bold">
                      18:00 UTC (PEAK)
                    </span>
                    <span className>20:00 UTC</span>
                    <span className>22:00 UTC</span>
                    <span className>00:00 UTC</span>
                  </div>
                  <div id="sidebar-state-script" />
                </div>
              </section>
              {/* Lower Grid (Two Panels) */}
              <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
                {/* Left Panel: Live Ledger (7 cols) */}
                <div className="xl:col-span-7 flex flex-col p-space-xl rounded-DEFAULT bg-surface-card-dark shadow-xl overflow-hidden gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary-container text-[22px]">
                        receipt_long
                      </span>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Transmission Feed
                        </h3>
                        <p className="font-label-caps text-label-caps text-text-muted-dark uppercase">
                          REAL-TIME EGRESS DISPATCH AUDIT
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <button
                        className="px-space-md py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-caps text-label-caps transition-colors flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          filter_list
                        </span>{" "}
                        FILTER
                      </button>
                      <button
                        className="w-7 h-7 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          file_download
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* Ledger Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-label-md text-label-md">
                      <thead>
                        <tr className="bg-surface-container-lowest/60 text-text-muted-dark font-label-caps text-label-caps">
                          <th className="py-2.5 px-3 rounded-l-DEFAULT">
                            STATUS
                          </th>
                          <th className="py-2.5 px-3">CHANNEL</th>
                          <th className="py-2.5 px-3">RECIPIENT HASH</th>
                          <th className="py-2.5 px-3">ROUTE LATENCY</th>
                          <th className="py-2.5 px-3 rounded-r-DEFAULT text-right">
                            TIMESTAMP
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-high/40">
                        {/* Row 1 */}
                        <tr className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-label-caps text-label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                              DELIVERED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary-container text-[16px]">
                              notifications_active
                            </span>{" "}
                            APNs HTTP/2
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark">
                            #7f9a2e...c419
                          </td>
                          <td className="py-3 px-3 font-mono text-on-surface">
                            22ms
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark text-right">
                            18:04:12.891
                          </td>
                        </tr>
                        {/* Row 2 */}
                        <tr className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-label-caps text-label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin" />{" "}
                              ROUTING
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-cyan-400 text-[16px]">
                              mail
                            </span>{" "}
                            AWS SES TLS
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark">
                            #02ab41...89ff
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-400">
                            41ms
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark text-right">
                            18:04:12.742
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-label-caps text-label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{" "}
                              QUEUED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-purple-400 text-[16px]">
                              sms
                            </span>{" "}
                            Carrier SMPP
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark">
                            #bc3488...012a
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark">
                            --
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark text-right">
                            18:04:12.605
                          </td>
                        </tr>
                        {/* Row 4 */}
                        <tr className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-label-caps text-label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                              DELIVERED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary-container text-[16px]">
                              android
                            </span>{" "}
                            FCM Google V1
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark">
                            #e9112a...77dd
                          </td>
                          <td className="py-3 px-3 font-mono text-on-surface">
                            19ms
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark text-right">
                            18:04:12.430
                          </td>
                        </tr>
                        {/* Row 5 */}
                        <tr className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-label-caps text-label-caps">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                              DELIVERED
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary-container text-[16px]">
                              notifications_active
                            </span>{" "}
                            APNs HTTP/2
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark">
                            #18ee50...ab29
                          </td>
                          <td className="py-3 px-3 font-mono text-on-surface">
                            26ms
                          </td>
                          <td className="py-3 px-3 font-mono text-text-muted-dark text-right">
                            18:04:12.188
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-label-caps text-label-caps text-text-muted-dark">
                      Displaying 5 of 3,842 buffer items
                    </span>
                    <button
                      className="text-primary hover:text-primary-container font-label-caps text-label-caps flex items-center gap-1"
                      type="button"
                    >
                      OPEN STREAM INSPECTOR{" "}
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                  <div id="sidebar-state-script" />
                </div>
                {/* Right Panel: Carrier & Gateway Health (5 cols) */}
                <div className="xl:col-span-5 flex flex-col p-space-xl rounded-DEFAULT bg-surface-card-dark shadow-xl overflow-hidden gap-space-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary-container text-[22px]">
                        dns
                      </span>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Carrier &amp; Gateway SLA
                        </h3>
                        <p className="font-label-caps text-label-caps text-text-muted-dark uppercase">
                          SYSTEM HEALTH &amp; ROUTE COMPLIANCE
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-emerald-400 font-label-caps text-label-caps">
                      {deliverability} OK
                    </span>
                  </div>
                  {/* Donut SLA Ring + Gateways Stack */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-md items-center">
                    {/* Radial SLA Gauge */}
                    <div className="sm:col-span-5 flex flex-col items-center justify-center p-space-sm">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          {/* Background circle */}
                          <circle
                            cx={50}
                            cy={50}
                            fill="transparent"
                            r={40}
                            stroke="#1e2021"
                            strokeWidth={9}
                          />
                          {/* Progress fill (99.98%) */}
                          <circle
                            cx={50}
                            cy={50}
                            fill="transparent"
                            r={40}
                            stroke="#fe5824"
                            strokeDasharray="251.2"
                            strokeDashoffset="1.2"
                            strokeLinecap="round"
                            strokeWidth={9}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="font-headline-md text-headline-md text-on-surface font-extrabold leading-none">
                            99.9
                            <span className="text-primary-container">%</span>
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark uppercase text-[10px]">
                            UPTIME SLA
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Latency by Carrier Breakdown */}
                    <div className="sm:col-span-7 flex flex-col gap-space-sm">
                      {/* Gateway 1: APNs */}
                      <div className="p-2.5 rounded-DEFAULT bg-surface-container-low flex flex-col gap-1">
                        <div className="flex items-center justify-between font-label-md text-label-md">
                          <span className="text-on-surface font-semibold">
                            Apple APNs
                          </span>
                          <span className="font-mono text-emerald-400">
                            {latency}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: "92%" }}
                          />
                        </div>
                        <div className="flex justify-between font-label-caps text-label-caps text-text-muted-dark text-[9px]">
                          <span className>Throughput: 1.8M/hr</span>
                          <span className>Success: 99.99%</span>
                        </div>
                      </div>
                      {/* Gateway 2: FCM */}
                      <div className="p-2.5 rounded-DEFAULT bg-surface-container-low flex flex-col gap-1">
                        <div className="flex items-center justify-between font-label-md text-label-md">
                          <span className="text-on-surface font-semibold">
                            Google FCM
                          </span>
                          <span className="font-mono text-emerald-400">
                            22ms
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                          <div
                            className="h-full bg-primary-container rounded-full"
                            style={{ width: "88%" }}
                          />
                        </div>
                        <div className="flex justify-between font-label-caps text-label-caps text-text-muted-dark text-[9px]">
                          <span className>Throughput: 2.4M/hr</span>
                          <span className>Success: 99.98%</span>
                        </div>
                      </div>
                      {/* Gateway 3: AWS SES */}
                      <div className="p-2.5 rounded-DEFAULT bg-surface-container-low flex flex-col gap-1">
                        <div className="flex items-center justify-between font-label-md text-label-md">
                          <span className="text-on-surface font-semibold">
                            AWS SES Mail
                          </span>
                          <span
                            className="font-mono"
                            style={{ color: "#0891b2" }}
                          >
                            46ms
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: "78%", backgroundColor: "#0891b2" }}
                          />
                        </div>
                        <div className="flex justify-between font-label-caps text-label-caps text-text-muted-dark text-[9px]">
                          <span className>Throughput: 1.1M/hr</span>
                          <span className>Success: 99.95%</span>
                        </div>
                      </div>
                      {/* Gateway 4: Carrier SMPP */}
                      <div className="p-2.5 rounded-DEFAULT bg-surface-container-low flex flex-col gap-1">
                        <div className="flex items-center justify-between font-label-md text-label-md">
                          <span className="text-on-surface font-semibold">
                            Global SMPP (SMS)
                          </span>
                          <span className="font-mono text-purple-400">
                            82ms
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-full"
                            style={{ width: "65%" }}
                          />
                        </div>
                        <div className="flex justify-between font-label-caps text-label-caps text-text-muted-dark text-[9px]">
                          <span className>Throughput: 620k/hr</span>
                          <span className>Success: 99.89%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
