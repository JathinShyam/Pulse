import React from "react";

export default function Screen4() {
  return (
    <>
      <div>
        <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest flex flex-col justify-between z-50 p-space-md">
          <div className="flex flex-col gap-space-lg">
            <div className="flex items-center justify-between px-space-xs">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-DEFAULT bg-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(254,88,36,0.35)]">
                  <span className="material-symbols-outlined text-surface-pitch text-[20px] font-bold">
                    bolt
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm tracking-tight text-surface-light">
                    PULSE
                  </span>
                  <span className="font-label-caps text-label-caps tracking-widest text-primary-container">
                    ENGINE v4.2
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-container-high">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                <span className="font-label-caps text-label-caps text-on-surface-variant font-mono">
                  PROD
                </span>
              </div>
            </div>
            <div className="p-space-sm rounded-DEFAULT bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  dns
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-mono">
                    edge-us-east-1
                  </span>
                  <span className="font-label-caps text-label-caps text-text-muted-dark">
                    42 nodes active
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-[16px]">
                unfold_more
              </span>
            </div>
            <nav
              className="flex flex-col gap-1"
              data-active-classes="bg-primary-container text-on-primary-container font-bold"
            >
              <a
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md"
                data-path="overview"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  grid_view
                </span>
                <span>Overview</span>
              </a>
              <a
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md"
                data-path="analytics"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  insights
                </span>
                <span>Analytics</span>
              </a>
              <a
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md"
                data-path="send-notification-dispatch-composer"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
                <span>Dispatch Composer</span>
              </a>
              <a
                aria-current="page"
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT transition-colors bg-primary-container text-on-primary-container font-bold"
                data-path="gateways-carrier-routing-architecture"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  hub
                </span>
                <span>Gateways &amp; Carriers</span>
              </a>
              <a
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md"
                data-path="logs-telemetry-stream"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  terminal
                </span>
                <span>Logs &amp; Telemetry</span>
              </a>
              <a
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md"
                data-path="settings"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  tune
                </span>
                <span>Engine Settings</span>
              </a>
            </nav>
          </div>
          <div className="p-space-sm rounded-DEFAULT bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-surface-light font-bold">
                  Alex Vance
                </span>
                <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                  SR. SRE LEAD
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[18px]">
              lock_open
            </span>
          </div>
        </aside>
        <div className="pl-72">
          <header className="fixed top-0 left-72 right-0 h-16 bg-surface-pitch/90 backdrop-blur-xl z-40 px-space-lg flex items-center justify-between">
            <div className="flex items-center gap-space-md w-96">
              <div className="flex items-center gap-space-sm w-full bg-surface-container-lowest px-space-md py-space-xs rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <span className="material-symbols-outlined text-text-muted-dark text-[18px]">
                  search
                </span>
                <input
                  className="bg-transparent text-on-surface font-body-md text-body-md placeholder:text-text-muted-dark focus:outline-none w-full"
                  placeholder="Filter stream by payload ID or carrier..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-lowest">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="font-label-caps text-label-caps text-on-surface font-mono">
                  CLUSTER LATENCY: 1.4ms
                </span>
              </div>
              <button className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_8px_24px_-4px_rgba(254,88,36,0.35)] hover:bg-tertiary-container hover:text-on-tertiary-container transition-all">
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
          </header>
          <main className="w-full pt-16 bg-surface-pitch min-h-screen">
            <div className="flex flex-col w-full">
              {/* Dynamic Atmospheric Glow */}
              <div className="relative w-full px-margin-desktop py-space-xl overflow-hidden flex flex-col gap-space-2xl">
                <div className="absolute -top-40 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute top-1/2 -left-20 w-80 h-80 bg-surface-container-high/40 rounded-full blur-[100px] pointer-events-none" />
                {/* 01. SECTION HEADER BAR */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg relative z-10">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-caps text-label-caps tracking-widest text-primary-container font-mono">
                        // 03 — INFRASTRUCTURE TOPOLOGY
                      </span>
                      <span className="text-text-muted-dark text-[10px] font-mono">
                        /
                      </span>
                      <span className="font-label-caps text-label-caps tracking-widest text-secondary font-mono">
                        GATEWAY MESH SYSTEM
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-space-md">
                      <h1 className="font-headline-xl text-headline-xl text-surface-light tracking-tight">
                        Routing Topology &amp; Protocols
                      </h1>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                        <span className="font-label-caps text-label-caps text-on-surface tracking-wider font-mono">
                          ALL 194 CARRIER NODES SYNCHRONIZED
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md">
                    <div className="flex flex-col text-right pr-space-md hidden sm:flex">
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono uppercase">
                        Mesh Ingress Volume
                      </span>
                      <span className="font-headline-sm text-headline-sm text-surface-light font-bold font-mono">
                        2.4M{" "}
                        <span className="text-primary-container text-body-md font-normal">
                          msg/sec
                        </span>
                      </span>
                    </div>
                    <button
                      className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_8px_24px_-4px_rgba(254,88,36,0.35)] hover:bg-tertiary-container hover:text-on-tertiary-container transition-all cursor-pointer"
                      id="addGatewayModalBtn"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        add_circle
                      </span>
                      <span>Add Gateway Endpoint</span>
                    </button>
                  </div>
                </header>
                {/* 02. GLOBAL GATEWAY OVERVIEW KPIS */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter relative z-10">
                  {/* KPI 1 */}
                  <div className="bg-surface-card-dark p-space-lg rounded-DEFAULT flex flex-col justify-between hover:bg-surface-card-hover transition-colors shadow-sm group">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        01 // GLOBAL FLEET
                      </span>
                      <span className="material-symbols-outlined text-primary-container text-[20px] group-hover:scale-110 transition-transform">
                        cell_tower
                      </span>
                    </div>
                    <div className="my-space-md flex flex-col">
                      <div className="flex items-baseline gap-space-xs">
                        <span className="font-stat-counter text-stat-counter text-surface-light tracking-tight">
                          194
                        </span>
                        <span className="font-headline-sm text-headline-sm text-text-muted-dark">
                          / 194
                        </span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Active Global Carriers
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-space-xs">
                      <span className="font-label-caps text-label-caps text-primary-container font-mono">
                        100% ROUTING HEALTH
                      </span>
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        0 PACKET LOSS
                      </span>
                    </div>
                  </div>
                  {/* KPI 2 */}
                  <div className="bg-surface-card-dark p-space-lg rounded-DEFAULT flex flex-col justify-between hover:bg-surface-card-hover transition-colors shadow-sm group">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        02 // PROPAGATION
                      </span>
                      <span className="material-symbols-outlined text-secondary text-[20px] group-hover:rotate-45 transition-transform">
                        timeline
                      </span>
                    </div>
                    <div className="my-space-md flex flex-col">
                      <div className="flex items-baseline gap-space-xs">
                        <span className="font-stat-counter text-stat-counter text-surface-light tracking-tight">
                          34.2
                        </span>
                        <span className="font-headline-sm text-headline-sm text-primary-container font-mono">
                          ms
                        </span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Edge Multi-Hop Latency
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-space-xs">
                      <span className="font-label-caps text-label-caps text-surface-light font-mono bg-surface-container-high px-2 py-0.5 rounded-full">
                        -8ms VS BENCHMARK
                      </span>
                      <span className="font-label-caps text-label-caps text-primary font-mono">
                        OPTIMAL
                      </span>
                    </div>
                  </div>
                  {/* KPI 3 */}
                  <div className="bg-surface-card-dark p-space-lg rounded-DEFAULT flex flex-col justify-between hover:bg-surface-card-hover transition-colors shadow-sm group">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        03 // STABILITY METRIC
                      </span>
                      <span className="material-symbols-outlined text-primary-container text-[20px] group-hover:scale-110 transition-transform">
                        health_and_safety
                      </span>
                    </div>
                    <div className="my-space-md flex flex-col">
                      <div className="flex items-baseline gap-space-xs">
                        <span className="font-stat-counter text-stat-counter text-surface-light tracking-tight">
                          14
                        </span>
                        <span className="font-headline-sm text-headline-sm text-text-muted-dark font-mono">
                          EVT
                        </span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Auto-Failover Events (24h)
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-space-xs">
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        0 DROPPED PAYLOADS
                      </span>
                      <span className="font-label-caps text-label-caps text-primary-container font-mono">
                        100% HEALED
                      </span>
                    </div>
                  </div>
                  {/* KPI 4 */}
                  <div className="bg-surface-card-dark p-space-lg rounded-DEFAULT flex flex-col justify-between hover:bg-surface-card-hover transition-colors shadow-sm group">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        04 // BANDWIDTH
                      </span>
                      <span className="material-symbols-outlined text-secondary text-[20px] group-hover:scale-110 transition-transform">
                        speed
                      </span>
                    </div>
                    <div className="my-space-md flex flex-col">
                      <div className="flex items-baseline gap-space-xs">
                        <span className="font-stat-counter text-stat-counter text-surface-light tracking-tight">
                          41.8
                        </span>
                        <span className="font-headline-sm text-headline-sm text-primary-container font-mono">
                          %
                        </span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Protocol Saturation
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-space-xs">
                      <span className="font-label-caps text-label-caps text-primary font-mono">
                        5.8x SURGE HEADROOM
                      </span>
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        NOMINAL
                      </span>
                    </div>
                  </div>
                </section>
                {/* 03. INTERACTIVE TOPOLOGY PIPELINE CARD */}
                <section className="bg-surface-card-dark p-space-xl rounded-DEFAULT shadow-lg flex flex-col gap-space-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm relative z-10">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-primary-container font-mono">
                        DYNAMIC SIGNAL BUS
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-surface-light">
                        Active Edge Transit Mesh &amp; Core Switching
                      </h2>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                        LOAD BALANCING:
                      </span>
                      <span className="font-label-caps text-label-caps px-2.5 py-1 rounded-full bg-surface-container text-surface-light font-mono">
                        WEIGHTED P95 ADAPTIVE
                      </span>
                    </div>
                  </div>
                  {/* Diagram Graphic Architecture */}
                  <div className="relative w-full bg-surface-pitch/60 rounded-DEFAULT p-space-lg overflow-x-auto">
                    <div className="min-w-[800px] flex items-center justify-between relative py-space-md">
                      {/* Ingress Node */}
                      <div className="flex flex-col items-center z-10 w-44">
                        <div className="w-14 h-14 rounded-DEFAULT bg-surface-container flex items-center justify-center text-primary shadow-[0_0_24px_rgba(254,88,36,0.25)]">
                          <span className="material-symbols-outlined text-[28px]">
                            input
                          </span>
                        </div>
                        <span className="font-headline-sm text-[16px] text-surface-light mt-space-sm font-mono">
                          Ingress Gateway
                        </span>
                        <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                          42 EDGE ANYCAST NODES
                        </span>
                        <span className="mt-1 font-label-caps text-[10px] text-primary-container font-mono bg-surface-container-high px-2 py-0.5 rounded-full">
                          2.4M REQ/S
                        </span>
                      </div>
                      {/* Connecting Bus SVG Line 1 */}
                      <div className="flex-1 flex items-center justify-center px-2 relative">
                        <svg
                          className="w-full h-8"
                          preserveAspectRatio="none"
                          viewBox="0 0 100 24"
                        >
                          <line
                            className="text-surface-container-highest"
                            stroke="currentColor"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                            x1={0}
                            x2={100}
                            y1={12}
                            y2={12}
                          />
                          <circle
                            className="text-primary-container"
                            cx={50}
                            cy={12}
                            fill="currentColor"
                            r={3}
                          >
                            <animate
                              attributeName="cx"
                              dur="2s"
                              repeatCount="indefinite"
                              values="0;100"
                            />
                          </circle>
                        </svg>
                      </div>
                      {/* Intelligent Router / Brain Node */}
                      <div className="flex flex-col items-center z-10 w-52 bg-surface-container p-space-md rounded-DEFAULT shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-[0_0_20px_rgba(254,88,36,0.4)]">
                          <span className="material-symbols-outlined text-[24px]">
                            hub
                          </span>
                        </div>
                        <span className="font-headline-sm text-[16px] text-surface-light mt-2 font-mono">
                          Pulse Matrix Engine
                        </span>
                        <span className="font-label-caps text-label-caps text-primary-container font-mono">
                          HEURISTIC ARBITER
                        </span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                          <span className="font-label-caps text-[10px] text-on-surface font-mono">
                            P95 REROUTE: &lt;2ms
                          </span>
                        </div>
                      </div>
                      {/* Connecting Bus SVG Line 2 */}
                      <div className="flex-1 flex items-center justify-center px-2 relative">
                        <svg
                          className="w-full h-8"
                          preserveAspectRatio="none"
                          viewBox="0 0 100 24"
                        >
                          <line
                            className="text-surface-container-highest"
                            stroke="currentColor"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                            x1={0}
                            x2={100}
                            y1={12}
                            y2={12}
                          />
                          <circle
                            className="text-primary-container"
                            cx={30}
                            cy={12}
                            fill="currentColor"
                            r={3}
                          >
                            <animate
                              attributeName="cx"
                              dur="1.4s"
                              repeatCount="indefinite"
                              values="0;100"
                            />
                          </circle>
                        </svg>
                      </div>
                      {/* Egress Cluster Multi-Card */}
                      <div className="flex flex-col gap-2 z-10 w-64">
                        {/* Egress Node 1 */}
                        <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-DEFAULT hover:bg-surface-container transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              notifications_active
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-surface-light font-mono">
                                APNs Cluster
                              </span>
                              <span className="font-label-caps text-[10px] text-text-muted-dark">
                                HTTP/2 Direct Multiplex
                              </span>
                            </div>
                          </div>
                          <span className="font-label-caps text-[11px] text-primary-container font-mono font-bold">
                            18ms
                          </span>
                        </div>
                        {/* Egress Node 2 */}
                        <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-DEFAULT hover:bg-surface-container transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[18px]">
                              send_to_mobile
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-surface-light font-mono">
                                FCM v1 Engine
                              </span>
                              <span className="font-label-caps text-[10px] text-text-muted-dark">
                                OAuth2 Token Stream
                              </span>
                            </div>
                          </div>
                          <span className="font-label-caps text-[11px] text-primary-container font-mono font-bold">
                            22ms
                          </span>
                        </div>
                        {/* Egress Node 3 */}
                        <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-DEFAULT hover:bg-surface-container transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-text-muted-dark text-[18px]">
                              mail
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-surface-light font-mono">
                                SES Dual Mesh
                              </span>
                              <span className="font-label-caps text-[10px] text-text-muted-dark">
                                US-East / EU-West
                              </span>
                            </div>
                          </div>
                          <span className="font-label-caps text-[11px] text-secondary font-mono font-bold">
                            45ms
                          </span>
                        </div>
                        {/* Egress Node 4 */}
                        <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-DEFAULT hover:bg-surface-container transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary-container text-[18px]">
                              sms
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-surface-light font-mono">
                                Twilio SuperNet
                              </span>
                              <span className="font-label-caps text-[10px] text-text-muted-dark">
                                Tier-1 Direct Carrier
                              </span>
                            </div>
                          </div>
                          <span className="font-label-caps text-[11px] text-surface-light font-mono font-bold">
                            820ms
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {/* 04. CARRIER ROUTING & PROTOCOL TABLE */}
                <section className="flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-headline-sm text-headline-sm text-surface-light">
                        Carrier Gateways &amp; Redundancy Topology
                      </span>
                      <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-primary font-mono">
                        6 CORE REGISTRIES
                      </span>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <button className="px-space-md py-space-xs rounded-full bg-surface-card-dark text-on-surface font-label-md text-label-md hover:bg-surface-card-hover transition-colors flex items-center gap-1 font-mono">
                        <span className="material-symbols-outlined text-[16px]">
                          tune
                        </span>
                        <span>Channel: All</span>
                      </button>
                      <button className="px-space-md py-space-xs rounded-full bg-surface-card-dark text-on-surface font-label-md text-label-md hover:bg-surface-card-hover transition-colors flex items-center gap-1 font-mono">
                        <span className="material-symbols-outlined text-[16px]">
                          public
                        </span>
                        <span>Region: Global</span>
                      </button>
                    </div>
                  </div>
                  {/* Table Container */}
                  <div className="bg-surface-card-dark rounded-DEFAULT shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low text-text-muted-dark font-label-caps text-label-caps tracking-wider font-mono">
                            <th className="py-space-md px-space-lg">
                              Carrier / Gateway Name
                            </th>
                            <th className="py-space-md px-space-md">Channel</th>
                            <th className="py-space-md px-space-md">
                              Datacenter Anchor
                            </th>
                            <th className="py-space-md px-space-md">
                              Failover / Cascade Policy
                            </th>
                            <th className="py-space-md px-space-md">
                              P95 Latency
                            </th>
                            <th className="py-space-md px-space-md">
                              Deliverability
                            </th>
                            <th className="py-space-md px-space-md">
                              Health State
                            </th>
                            <th className="py-space-md px-space-md text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-0 text-body-md font-body-md">
                          {/* Row 1: Apple APNs */}
                          <tr className="hover:bg-surface-card-hover transition-colors group">
                            <td className="py-space-md px-space-lg">
                              <div className="flex items-center gap-space-sm">
                                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-light group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">
                                    phone_iphone
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-label-md text-label-md text-surface-light font-bold">
                                    Apple APNs Edge Primary
                                  </span>
                                  <span className="font-label-caps text-[10px] text-text-muted-dark font-mono">
                                    apns-direct.push.apple.com
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-primary-container font-mono">
                                PUSH APN
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col font-mono text-[12px]">
                                <span className="text-surface-light">
                                  US-East (N. Virginia)
                                </span>
                                <span className="text-text-muted-dark text-[10px]">
                                  Dual-homed to EU-Central
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-body-md text-body-md text-on-surface-variant font-mono text-[13px]">
                                Cascade to SMS on timeout &gt; 15s
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-surface-light font-bold">
                                  18ms
                                </span>
                                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-container rounded-full"
                                    style={{ width: "25%" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md font-mono text-surface-light font-bold">
                              99.994%
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-pitch">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                                <span className="font-label-caps text-label-caps text-primary-container font-mono font-bold">
                                  OPTIMAL
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md text-right">
                              <button className="p-1 rounded-DEFAULT text-text-muted-dark hover:text-surface-light hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 2: Google FCM v1 */}
                          <tr className="hover:bg-surface-card-hover transition-colors group">
                            <td className="py-space-md px-space-lg">
                              <div className="flex items-center gap-space-sm">
                                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-light group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">
                                    android
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-label-md text-label-md text-surface-light font-bold">
                                    Google FCM v1 Direct
                                  </span>
                                  <span className="font-label-caps text-[10px] text-text-muted-dark font-mono">
                                    fcm.googleapis.com:443
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-primary-container font-mono">
                                PUSH FCM
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col font-mono text-[12px]">
                                <span className="text-surface-light">
                                  Global Anycast
                                </span>
                                <span className="text-text-muted-dark text-[10px]">
                                  Google Edge Points
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-body-md text-body-md text-on-surface-variant font-mono text-[13px]">
                                Auto-failover to FCM High-Prio stream
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-surface-light font-bold">
                                  22ms
                                </span>
                                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-container rounded-full"
                                    style={{ width: "30%" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md font-mono text-surface-light font-bold">
                              99.988%
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-pitch">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                                <span className="font-label-caps text-label-caps text-primary-container font-mono font-bold">
                                  OPTIMAL
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md text-right">
                              <button className="p-1 rounded-DEFAULT text-text-muted-dark hover:text-surface-light hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 3: AWS SES West Cluster */}
                          <tr className="hover:bg-surface-card-hover transition-colors group">
                            <td className="py-space-md px-space-lg">
                              <div className="flex items-center gap-space-sm">
                                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-light group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">
                                    mark_email_read
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-label-md text-label-md text-surface-light font-bold">
                                    AWS SES US-West Pool
                                  </span>
                                  <span className="font-label-caps text-[10px] text-text-muted-dark font-mono">
                                    email-smtp.us-west-2.amazonaws.com
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-mono">
                                EMAIL SMTP
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col font-mono text-[12px]">
                                <span className="text-surface-light">
                                  US-West (Oregon)
                                </span>
                                <span className="text-text-muted-dark text-[10px]">
                                  Warm IP dedicated block
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-body-md text-body-md text-on-surface-variant font-mono text-[13px]">
                                Cascade to SparkPost on throttle 454
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-surface-light font-bold">
                                  45ms
                                </span>
                                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-secondary rounded-full"
                                    style={{ width: "48%" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md font-mono text-surface-light font-bold">
                              99.980%
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-pitch">
                                <span className="w-1.5 h-1.5 rounded-full bg-surface-bright" />
                                <span className="font-label-caps text-label-caps text-secondary font-mono font-bold">
                                  ROUTING
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md text-right">
                              <button className="p-1 rounded-DEFAULT text-text-muted-dark hover:text-surface-light hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 4: Twilio Super Network SMS */}
                          <tr className="hover:bg-surface-card-hover transition-colors group">
                            <td className="py-space-md px-space-lg">
                              <div className="flex items-center gap-space-sm">
                                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-light group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">
                                    chat
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-label-md text-label-md text-surface-light font-bold">
                                    Twilio Super Network
                                  </span>
                                  <span className="font-label-caps text-[10px] text-text-muted-dark font-mono">
                                    api.twilio.com/v1/Messages
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono">
                                TELCO SMS
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col font-mono text-[12px]">
                                <span className="text-surface-light">
                                  Global Carrier Multiplex
                                </span>
                                <span className="text-text-muted-dark text-[10px]">
                                  Shortcode 49200 Bind
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-body-md text-body-md text-on-surface-variant font-mono text-[13px]">
                                Instant failover to Sinch SMPP v3.4
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-surface-light font-bold">
                                  820ms
                                </span>
                                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-container rounded-full"
                                    style={{ width: "82%" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md font-mono text-surface-light font-bold">
                              99.952%
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-pitch">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                                <span className="font-label-caps text-label-caps text-primary-container font-mono font-bold">
                                  OPTIMAL
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md text-right">
                              <button className="p-1 rounded-DEFAULT text-text-muted-dark hover:text-surface-light hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 5: Sinch Global SMPP */}
                          <tr className="hover:bg-surface-card-hover transition-colors group">
                            <td className="py-space-md px-space-lg">
                              <div className="flex items-center gap-space-sm">
                                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-light group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">
                                    settings_ethernet
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-label-md text-label-md text-surface-light font-bold">
                                    Sinch Global SMPP Pipe
                                  </span>
                                  <span className="font-label-caps text-[10px] text-text-muted-dark font-mono">
                                    smpp.us-east.sinch.com:2775
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono">
                                SMPP v3.4
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col font-mono text-[12px]">
                                <span className="text-surface-light">
                                  AP-East (Tokyo)
                                </span>
                                <span className="text-text-muted-dark text-[10px]">
                                  Direct Tier-1 peering
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-body-md text-body-md text-on-surface-variant font-mono text-[13px]">
                                Fallback to Carrier Voice TTS
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-surface-light font-bold">
                                  640ms
                                </span>
                                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-container rounded-full"
                                    style={{ width: "65%" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md font-mono text-surface-light font-bold">
                              99.965%
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-pitch">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                <span className="font-label-caps text-label-caps text-secondary font-mono font-bold">
                                  STANDBY
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md text-right">
                              <button className="p-1 rounded-DEFAULT text-text-muted-dark hover:text-surface-light hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 6: SparkPost Pool */}
                          <tr className="hover:bg-surface-card-hover transition-colors group">
                            <td className="py-space-md px-space-lg">
                              <div className="flex items-center gap-space-sm">
                                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-light group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">
                                    send
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-label-md text-label-md text-surface-light font-bold">
                                    SparkPost Enterprise Pool
                                  </span>
                                  <span className="font-label-caps text-[10px] text-text-muted-dark font-mono">
                                    api.sparkpost.com/api/v1
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-mono">
                                REST JSON
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col font-mono text-[12px]">
                                <span className="text-surface-light">
                                  EU-Central (Frankfurt)
                                </span>
                                <span className="text-text-muted-dark text-[10px]">
                                  GDPR Enclave Shard
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className="font-body-md text-body-md text-on-surface-variant font-mono text-[13px]">
                                Circuit breaker active: 0 dropped
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-surface-light font-bold">
                                  52ms
                                </span>
                                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-secondary rounded-full"
                                    style={{ width: "55%" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md font-mono text-surface-light font-bold">
                              99.989%
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-pitch">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                                <span className="font-label-caps text-label-caps text-primary-container font-mono font-bold">
                                  OPTIMAL
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md text-right">
                              <button className="p-1 rounded-DEFAULT text-text-muted-dark hover:text-surface-light hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
                {/* 05. AUTOMATED FAILOVER & CASCADE RULES ENGINE */}
                <section className="flex flex-col gap-space-lg mb-space-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
                    <div>
                      <span className="font-label-caps text-label-caps text-primary-container font-mono">
                        // 04 — AUTONOMOUS RESILIENCE
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-surface-light mt-1">
                        Multi-Tier Cascade &amp; Fallback Rules
                      </h3>
                    </div>
                    <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                      ACTIVE PROTOCOL: 0-PACKET-LOSS ZERO DOWNTIME
                    </span>
                  </div>
                  {/* Rules Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    {/* Cascade Card 1 */}
                    <div className="bg-surface-card-dark p-space-lg rounded-DEFAULT flex flex-col justify-between hover:bg-surface-card-hover transition-colors shadow-md relative group">
                      <div className="flex items-center justify-between pb-space-sm">
                        <span className="font-label-caps text-label-caps text-primary-container font-mono font-bold">
                          RULE #01 — CRITICAL P0
                        </span>
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                      </div>
                      <div className="my-space-md flex flex-col gap-2">
                        <h4 className="font-headline-sm text-[18px] text-surface-light">
                          Security &amp; Core Alert Cascade
                        </h4>
                        <p className="font-body-md text-body-md text-text-muted-dark">
                          APNs High-Priority → FCM v1 Direct fallback →
                          Immediate Tier-1 SMS dispatch if message remains
                          unacknowledged past 15 seconds.
                        </p>
                      </div>
                      <div className="bg-surface-pitch p-space-sm rounded-DEFAULT flex flex-col gap-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            PRIMARY TARGET:
                          </span>
                          <span className="text-surface-light font-bold">
                            APNs Direct (P95: 18ms)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            TIMEOUT TRIGGER:
                          </span>
                          <span className="text-primary-container font-bold">
                            &gt; 15,000 ms
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            ESCAPE ESCALATION:
                          </span>
                          <span className="text-surface-light font-bold">
                            Twilio SMS Tier-1 Direct
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Cascade Card 2 */}
                    <div className="bg-surface-card-dark p-space-lg rounded-DEFAULT flex flex-col justify-between hover:bg-surface-card-hover transition-colors shadow-md relative group">
                      <div className="flex items-center justify-between pb-space-sm">
                        <span className="font-label-caps text-label-caps text-secondary font-mono font-bold">
                          RULE #02 — AUTH OTP
                        </span>
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="my-space-md flex flex-col gap-2">
                        <h4 className="font-headline-sm text-[18px] text-surface-light">
                          Transactional OTP Fallback
                        </h4>
                        <p className="font-body-md text-body-md text-text-muted-dark">
                          SMS Tier-1 Direct bypass via Twilio Super Network →
                          Instant fallback to high-deliverability Carrier Voice
                          TTS on handset carrier route congestion.
                        </p>
                      </div>
                      <div className="bg-surface-pitch p-space-sm rounded-DEFAULT flex flex-col gap-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            PRIMARY TARGET:
                          </span>
                          <span className="text-surface-light font-bold">
                            Direct SMS Carrier Route
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            TIMEOUT TRIGGER:
                          </span>
                          <span className="text-primary-container font-bold">
                            &gt; 8,000 ms
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            ESCAPE ESCALATION:
                          </span>
                          <span className="text-surface-light font-bold">
                            Voice Callout Matrix
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Cascade Card 3 */}
                    <div className="bg-surface-card-dark p-space-lg rounded-DEFAULT flex flex-col justify-between hover:bg-surface-card-hover transition-colors shadow-md relative group">
                      <div className="flex items-center justify-between pb-space-sm">
                        <span className="font-label-caps text-label-caps text-secondary font-mono font-bold">
                          RULE #03 — BATCH EMAIL
                        </span>
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                      </div>
                      <div className="my-space-md flex flex-col gap-2">
                        <h4 className="font-headline-sm text-[18px] text-surface-light">
                          Enterprise Digest &amp; Reports
                        </h4>
                        <p className="font-body-md text-body-md text-text-muted-dark">
                          Distributed batch SMTP through AWS SES US-West pool →
                          Immediate automated failover to SparkPost pool on
                          throttling code 454 or socket freeze.
                        </p>
                      </div>
                      <div className="bg-surface-pitch p-space-sm rounded-DEFAULT flex flex-col gap-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            PRIMARY TARGET:
                          </span>
                          <span className="text-surface-light font-bold">
                            AWS SES Dedicated Pool
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            TIMEOUT TRIGGER:
                          </span>
                          <span className="text-primary-container font-bold">
                            Socket Reset / Error 454
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted-dark">
                            ESCAPE ESCALATION:
                          </span>
                          <span className="text-surface-light font-bold">
                            SparkPost Global Shard
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {/* 06. MODAL: ADD GATEWAY ENDPOINT (HIDDEN BY DEFAULT) */}
                <div
                  className="fixed inset-0 bg-surface-pitch/80 backdrop-blur-md z-50 flex items-center justify-center p-space-md hidden"
                  id="addGatewayModal"
                >
                  <div className="bg-surface-card-dark w-full max-w-xl p-space-xl rounded-DEFAULT shadow-2xl flex flex-col gap-space-lg relative">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-primary-container font-mono">
                          TOPOLOGY REGISTRATION
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-surface-light">
                          Attach Gateway Endpoint
                        </h3>
                      </div>
                      <button
                        className="text-text-muted-dark hover:text-surface-light p-1 rounded-DEFAULT transition-colors"
                        id="closeGatewayModalBtn"
                      >
                        <span className="material-symbols-outlined text-[24px]">
                          close
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-space-md font-body-md text-body-md">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-label-caps text-text-muted-dark font-mono uppercase">
                          Gateway Protocol Type
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            className="py-2 rounded-DEFAULT bg-primary-container text-on-primary-container font-label-md text-label-md font-bold text-center"
                            type="button"
                          >
                            Apple APNs
                          </button>
                          <button
                            className="py-2 rounded-DEFAULT bg-surface-container text-on-surface font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors"
                            type="button"
                          >
                            Google FCM
                          </button>
                          <button
                            className="py-2 rounded-DEFAULT bg-surface-container text-on-surface font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors"
                            type="button"
                          >
                            SMPP SMS
                          </button>
                          <button
                            className="py-2 rounded-DEFAULT bg-surface-container text-on-surface font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors"
                            type="button"
                          >
                            SMTP Email
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-label-caps text-text-muted-dark font-mono uppercase">
                          Endpoint FQDN / Host URI
                        </label>
                        <input
                          className="bg-surface-pitch text-on-surface px-space-md py-space-sm rounded-DEFAULT focus:outline-none focus:ring-1 focus:ring-primary-container font-mono text-[13px]"
                          placeholder="e.g. gateway.internal.carrier-node.io:8443"
                          type="text"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-space-md">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-text-muted-dark font-mono uppercase">
                            Datacenter Region
                          </label>
                          <select className="bg-surface-pitch text-on-surface px-space-md py-space-sm rounded-DEFAULT focus:outline-none focus:ring-1 focus:ring-primary-container font-mono text-[13px]">
                            <option>US-East (N. Virginia)</option>
                            <option>EU-Central (Frankfurt)</option>
                            <option>AP-East (Tokyo)</option>
                            <option>US-West (Oregon)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-text-muted-dark font-mono uppercase">
                            Redundancy Weight
                          </label>
                          <input
                            className="bg-surface-pitch text-on-surface px-space-md py-space-sm rounded-DEFAULT focus:outline-none focus:ring-1 focus:ring-primary-container font-mono text-[13px]"
                            type="number"
                            defaultValue={100}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-space-sm pt-space-sm">
                      <button
                        className="px-space-md py-space-xs rounded-full text-text-muted-dark hover:text-surface-light font-label-md text-label-md font-bold"
                        id="cancelGatewayBtn"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-space-lg py-space-xs rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_8px_24px_-4px_rgba(254,88,36,0.35)] hover:bg-tertiary-container hover:text-on-tertiary-container transition-all"
                        id="commitGatewayBtn"
                      >
                        Provision Endpoint
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
