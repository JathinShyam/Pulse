import React from "react";

export default function Screen5() {
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
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md"
                data-path="gateways-carrier-routing-architecture"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  hub
                </span>
                <span>Gateways &amp; Carriers</span>
              </a>
              <a
                aria-current="page"
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT transition-colors bg-primary-container text-on-primary-container font-bold"
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
              <div className="p-space-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">
                {/* Top Meta Strip & Telemetry Controls */}
                <div className="flex flex-col gap-space-md">
                  <div className="flex flex-wrap items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-md">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">
                          // 04 — AUDIT &amp; TELEMETRY STREAM
                        </span>
                        <span className="font-headline-sm text-headline-sm text-surface-light tracking-tight">
                          LIVE PACKET EGRESS &amp; CRYPTOGRAPHIC TRACE
                        </span>
                      </div>
                      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="font-label-caps text-label-caps text-on-surface font-mono tracking-wider">
                          SOCKET CONNECTED (0.4ms RTT)
                        </span>
                      </div>
                    </div>
                    {/* Telemetry Controls & Speed Matrix */}
                    <div className="flex items-center gap-space-sm">
                      <div className="flex items-center bg-surface-container-lowest p-1 rounded-full shadow-inner">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold transition-all shadow-[0_0_12px_rgba(254,88,36,0.35)]"
                          id="stream-toggle"
                          onclick="toggleStream()"
                        >
                          <span
                            className="material-symbols-outlined text-[15px]"
                            id="stream-icon"
                          >
                            pause
                          </span>
                          <span id="stream-text">STREAMING</span>
                        </button>
                        <div className="flex items-center px-1 gap-0.5">
                          <button className="px-2 py-0.5 rounded-full text-text-muted-dark hover:text-on-surface font-label-caps text-label-caps transition-colors">
                            0.5x
                          </button>
                          <button className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps font-mono">
                            1x
                          </button>
                          <button className="px-2 py-0.5 rounded-full text-text-muted-dark hover:text-on-surface font-label-caps text-label-caps transition-colors">
                            5x
                          </button>
                          <button className="px-2.5 py-0.5 rounded-full text-primary-container hover:bg-surface-container-high font-label-caps text-label-caps font-bold transition-colors">
                            REALTIME
                          </button>
                        </div>
                      </div>
                      <button
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors"
                        title="Export Ledger Snapshot"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          file_download
                        </span>
                      </button>
                      <button
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors"
                        title="Telemetry Configuration"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          tune
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* Velocity Metrics Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
                    {/* Velocity Rate */}
                    <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md flex items-center justify-between shadow-sm relative overflow-hidden">
                      <div className="flex flex-col z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined text-primary-container text-[16px]">
                            speed
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark">
                            EGRESS THROUGHPUT
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-md text-headline-md text-surface-light font-mono font-bold tracking-tight">
                            3,842
                          </span>
                          <span className="font-label-md text-label-md text-primary font-mono">
                            pkt/s
                          </span>
                        </div>
                        <span className="font-label-caps text-label-caps text-emerald-400 mt-1 font-mono flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">
                            trending_up
                          </span>{" "}
                          +4.8% spike 40s ago
                        </span>
                      </div>
                      {/* Sparkline SVG */}
                      <div className="w-24 h-12 flex items-end">
                        <svg
                          className="w-full h-full text-primary-container"
                          fill="none"
                          viewBox="0 0 100 40"
                        >
                          <path
                            d="M0 32 L15 28 L30 35 L45 15 L60 22 L75 8 L90 14 L100 4"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                          />
                          <path
                            d="M0 32 L15 28 L30 35 L45 15 L60 22 L75 8 L90 14 L100 4 L100 40 L0 40 Z"
                            fill="currentColor"
                            fillOpacity="0.12"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* Buffer Pool Depth */}
                    <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md flex items-center justify-between shadow-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined text-text-muted-dark text-[16px]">
                            layers
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark">
                            QUEUE BUFFER DEPTH
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-md text-headline-md text-surface-light font-mono font-bold">
                            0.04%
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                            18 / 45,000
                          </span>
                        </div>
                        <div className="w-36 h-1.5 bg-surface-container-high rounded-full mt-2.5 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full w-[4%]" />
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-surface-container-high font-label-caps text-label-caps text-emerald-400 font-mono">
                        HEALTHY
                      </span>
                    </div>
                    {/* Cryptographic Proof State */}
                    <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md flex items-center justify-between shadow-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined text-primary-container text-[16px]">
                            verified_user
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark">
                            HMAC-SHA256 INTEGRITY
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-md text-headline-md text-surface-light font-mono font-bold">
                            100.0%
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark">
                            SEC VERIFIED
                          </span>
                        </div>
                        <span className="font-label-caps text-label-caps text-text-muted-dark mt-1 font-mono">
                          0 nonce collisions
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
                        <span className="material-symbols-outlined text-[20px]">
                          enhanced_encryption
                        </span>
                      </div>
                    </div>
                    {/* Real-time E2E Quantile */}
                    <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md flex items-center justify-between shadow-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined text-text-muted-dark text-[16px]">
                            timer
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark">
                            P99 DISPATCH LATENCY
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-md text-headline-md text-surface-light font-mono font-bold">
                            22.4
                          </span>
                          <span className="font-label-md text-label-md text-primary font-mono">
                            ms
                          </span>
                        </div>
                        <span className="font-label-caps text-label-caps text-text-muted-dark mt-1 font-mono">
                          SLA &lt; 85ms guaranteed
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded bg-surface-container-high font-label-caps text-label-caps text-primary font-mono">
                        SUB-30MS
                      </span>
                    </div>
                  </div>
                  {/* Search & Monolithic Protocol Filter Chips */}
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm bg-surface-container-low p-2 rounded-DEFAULT shadow-sm">
                    <div className="flex items-center gap-space-sm px-space-md py-1.5 bg-surface-container-lowest rounded-full flex-1 max-w-xl">
                      <span className="material-symbols-outlined text-text-muted-dark text-[18px]">
                        terminal
                      </span>
                      <input
                        className="bg-transparent text-on-surface font-body-md text-body-md placeholder:text-text-muted-dark focus:outline-none w-full font-mono text-[13px]"
                        placeholder="Filter by trace_id, recipient hash, event_type, status:failed..."
                        type="text"
                      />
                      <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded bg-surface-container text-text-muted-dark">
                        ESC TO CLEAR
                      </span>
                    </div>
                    {/* Protocol Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
                      <button className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold text-xs">
                        All Protocols
                      </button>
                      <button className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md font-normal text-xs transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                          notifications_active
                        </span>{" "}
                        APNs (Push)
                      </button>
                      <button className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md font-normal text-xs transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                          android
                        </span>{" "}
                        FCM (Android)
                      </button>
                      <button className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md font-normal text-xs transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                          mail
                        </span>{" "}
                        SES (Email)
                      </button>
                      <button className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md font-normal text-xs transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                          sms
                        </span>{" "}
                        Carrier SMPP (SMS)
                      </button>
                      <button className="px-3 py-1 rounded-full bg-surface-container-high text-error font-label-md text-label-md font-bold text-xs hover:bg-error-container/40 transition-colors flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" />{" "}
                        Errors (0.018%)
                      </button>
                    </div>
                  </div>
                </div>
                {/* Asymmetrical Split Inspector Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                  {/* LEFT 60%: High Density Transmission Table (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col bg-surface-container-lowest rounded-DEFAULT shadow-md overflow-hidden">
                    {/* Table Control Toolbar */}
                    <div className="p-space-md bg-surface-container-low flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                          LIVE RECORD STREAM
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-surface-light font-label-caps text-label-caps font-mono">
                          1,429 ITEMS CACHED
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-text-muted-dark hover:text-on-surface text-[12px] font-mono flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">
                            sync
                          </span>{" "}
                          Auto-Scroll [ON]
                        </button>
                      </div>
                    </div>
                    {/* Transmission Table */}
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container text-text-muted-dark font-label-caps text-label-caps uppercase tracking-wider">
                            <th className="py-2.5 px-3">State</th>
                            <th className="py-2.5 px-3">UTC Timestamp</th>
                            <th className="py-2.5 px-3">Event Signature</th>
                            <th className="py-2.5 px-3">Gateway</th>
                            <th className="py-2.5 px-3">Recipient Hash</th>
                            <th className="py-2.5 px-3 text-right">Latency</th>
                            <th className="py-2.5 px-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent font-mono text-[12px]">
                          {/* Row 1: Selected Item (Active Highlight) */}
                          <tr className="bg-surface-container-high/60 cursor-pointer transition-colors shadow-[inset_3px_0_0_0_#fe5824]">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 font-label-caps text-label-caps">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                                DELIVERED
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-on-surface whitespace-nowrap font-mono text-[11px]">
                              19:42:01.892
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-primary">
                                  notifications_active
                                </span>
                                <span className="font-bold text-surface-light">
                                  secops.p0_alert
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              us-east-1a
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #8f92a...c02b
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                              18.4ms
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-primary hover:text-surface-light transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 2 */}
                          <tr className="hover:bg-surface-container-low transition-colors cursor-pointer">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/70 text-blue-400 font-label-caps text-label-caps">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />{" "}
                                IN-TRANSIT
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark whitespace-nowrap font-mono text-[11px]">
                              19:42:01.840
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                                  lock_reset
                                </span>
                                <span className="text-on-surface">
                                  auth.token_revoke
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              eu-central-1
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #d394e...11a9
                            </td>
                            <td className="py-2.5 px-3 text-right text-text-muted-dark">
                              --
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-text-muted-dark hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 3 */}
                          <tr className="hover:bg-surface-container-low transition-colors cursor-pointer">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 font-label-caps text-label-caps">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                                DELIVERED
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark whitespace-nowrap font-mono text-[11px]">
                              19:42:01.710
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                                  local_shipping
                                </span>
                                <span className="text-on-surface">
                                  order.shipped
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              us-west-2b
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #a110c...99ef
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-400">
                              24.1ms
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-text-muted-dark hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 4: Error/Retry */}
                          <tr className="hover:bg-surface-container-low transition-colors cursor-pointer bg-error-container/10">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-error-container text-on-error font-label-caps text-label-caps font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />{" "}
                                RETRYING
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark whitespace-nowrap font-mono text-[11px]">
                              19:42:01.622
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-error">
                                  sms
                                </span>
                                <span className="text-error font-semibold">
                                  carrier.smpp_bind
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              ap-northeast-1
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #03cc2...ea41
                            </td>
                            <td className="py-2.5 px-3 text-right text-error font-mono">
                              812ms (TO)
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-error hover:text-surface-light transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  refresh
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 5 */}
                          <tr className="hover:bg-surface-container-low transition-colors cursor-pointer">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 font-label-caps text-label-caps">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                                DELIVERED
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark whitespace-nowrap font-mono text-[11px]">
                              19:42:01.590
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                                  mail
                                </span>
                                <span className="text-on-surface">
                                  billing.invoice_ready
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              us-east-1b
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #7738b...5e10
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-400">
                              31.0ms
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-text-muted-dark hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 6 */}
                          <tr className="hover:bg-surface-container-low transition-colors cursor-pointer">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-caps text-label-caps">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />{" "}
                                QUEUED
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark whitespace-nowrap font-mono text-[11px]">
                              19:42:01.488
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                                  android
                                </span>
                                <span className="text-on-surface">
                                  growth.referral_earned
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              sa-east-1
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #b29f0...881c
                            </td>
                            <td className="py-2.5 px-3 text-right text-text-muted-dark">
                              1.1ms
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-text-muted-dark hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 7 */}
                          <tr className="hover:bg-surface-container-low transition-colors cursor-pointer">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 font-label-caps text-label-caps">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                                DELIVERED
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark whitespace-nowrap font-mono text-[11px]">
                              19:42:01.320
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                                  notifications_active
                                </span>
                                <span className="text-on-surface">
                                  tenant.quota_warning
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              us-east-1a
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #f418d...009a
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-400">
                              14.8ms
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-text-muted-dark hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                          {/* Row 8 */}
                          <tr className="hover:bg-surface-container-low transition-colors cursor-pointer">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 font-label-caps text-label-caps">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />{" "}
                                BOUNCED
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark whitespace-nowrap font-mono text-[11px]">
                              19:42:01.214
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-text-muted-dark">
                                  mail
                                </span>
                                <span className="text-on-surface">
                                  auth.magic_link
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted-dark">
                              us-west-2a
                            </td>
                            <td className="py-2.5 px-3 text-secondary font-mono">
                              #99201...b844
                            </td>
                            <td className="py-2.5 px-3 text-right text-rose-400">
                              104.2ms
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-text-muted-dark hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Ledger Footer Stats */}
                    <div className="p-space-sm bg-surface-container-low flex flex-wrap items-center justify-between text-text-muted-dark text-[11px] font-mono">
                      <span>STREAM REPLAY BUFFER: 128 MB ALLOCATED</span>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400">
                          99.982% SUCCESS RATE
                        </span>
                        <span className="text-primary-container">
                          0.018% DROP
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* RIGHT 40%: Detailed Packet Trace Inspector Drawer (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-space-md">
                    {/* Main Inspector Card */}
                    <div className="bg-surface-container-lowest rounded-DEFAULT p-space-lg flex flex-col gap-space-md shadow-xl relative overflow-hidden">
                      {/* Top Inspector Meta Header */}
                      <div className="flex items-start justify-between pb-space-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
                            // SELECTED PACKET INSPECTOR
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm text-surface-light font-mono font-bold tracking-tight">
                              evt_948a20bc_sec
                            </span>
                            <button
                              className="text-text-muted-dark hover:text-primary transition-colors"
                              onclick="navigator.clipboard.writeText('evt_948a20bc_sec')"
                              title="Copy Event ID"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                content_copy
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 font-label-caps text-label-caps font-bold">
                            ACK 200 OK
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark font-mono mt-1">
                            HTTP/2 • TLS 1.3
                          </span>
                        </div>
                      </div>
                      {/* Cryptographic Proof Badge Box */}
                      <div className="bg-surface-container-low p-space-sm rounded-DEFAULT flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-primary-container text-[20px]">
                            lock
                          </span>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-surface-light font-bold font-mono">
                              HMAC-SHA256 Validated
                            </span>
                            <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                              Nonce #88921 • Keyset ID #prod_k3
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 font-label-caps text-label-caps font-mono">
                          TAMPER-FREE
                        </span>
                      </div>
                      {/* Chrono Waterfall Latency Timeline */}
                      <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                            EXECUTION WATERFALL
                          </span>
                          <span className="font-label-caps text-label-caps text-primary font-mono">
                            TOTAL: 18.2ms
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 font-mono text-[12px] pt-1">
                          {/* Step 1 */}
                          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-surface-light font-medium">
                                Ingress Received via QUIC API
                              </span>
                            </div>
                            <span className="text-text-muted-dark">00.0ms</span>
                          </div>
                          {/* Step 2 */}
                          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-surface-light font-medium">
                                Audience Filter &amp; Deduplication
                              </span>
                            </div>
                            <span className="text-emerald-400">+01.2ms</span>
                          </div>
                          {/* Step 3 */}
                          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-surface-light font-medium">
                                Template Compiled with Dynamic Vars
                              </span>
                            </div>
                            <span className="text-emerald-400">+02.2ms</span>
                          </div>
                          {/* Step 4 */}
                          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                              <span className="text-surface-light font-medium">
                                Dispatched to APNs HTTP/2 Multiplexer
                              </span>
                            </div>
                            <span className="text-primary-container">
                              +01.7ms
                            </span>
                          </div>
                          {/* Step 5 */}
                          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-surface-light font-medium">
                                Apple APNs ACK 200 OK Received
                              </span>
                            </div>
                            <span className="text-emerald-400">+13.1ms</span>
                          </div>
                        </div>
                      </div>
                      {/* Raw Encrypted Payload Viewer */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-wider">
                            PAYLOAD DECRYPT &amp; HEADERS
                          </span>
                          <button className="font-label-caps text-label-caps text-primary hover:text-surface-light transition-colors font-mono">
                            WRAP LINES
                          </button>
                        </div>
                        <div className="bg-surface-pitch rounded-DEFAULT p-space-md font-mono text-[11px] leading-relaxed text-secondary overflow-x-auto shadow-inner">
                          <pre className="m-0">
                            <span className="text-primary-container">
                              {"{"}
                            </span>
                            {"\n"}
                            {"  "}
                            <span className="text-primary">
                              "trace_id"
                            </span>:{" "}
                            <span className="text-emerald-400">
                              "tr_990141ab_east1"
                            </span>
                            ,{"\n"}
                            {"  "}
                            <span className="text-primary">"event"</span>:{" "}
                            <span className="text-emerald-400">
                              "secops.p0_alert"
                            </span>
                            ,{"\n"}
                            {"  "}
                            <span className="text-primary">
                              "channel"
                            </span>:{" "}
                            <span className="text-emerald-400">
                              "apple_apns"
                            </span>
                            ,{"\n"}
                            {"  "}
                            <span className="text-primary">
                              "device_token_hash"
                            </span>
                            :{" "}
                            <span className="text-text-muted-dark">
                              "sha256:8f92a00c...c02b"
                            </span>
                            ,{"\n"}
                            {"  "}
                            <span className="text-primary">"claims"</span>:{" "}
                            {"{"}
                            {"\n"}
                            {"    "}
                            <span className="text-primary">
                              "priority"
                            </span>:{" "}
                            <span className="text-primary-container">10</span>,
                            {"\n"}
                            {"    "}
                            <span className="text-primary">"sound"</span>:{" "}
                            <span className="text-emerald-400">
                              "critical_siren.aiff"
                            </span>
                            ,{"\n"}
                            {"    "}
                            <span className="text-primary">"incident_ref"</span>
                            :{" "}
                            <span className="text-emerald-400">"INC-8092"</span>
                            {"\n"}
                            {"  "}
                            {"}"},{"\n"}
                            {"  "}
                            <span className="text-primary">
                              "signature"
                            </span>:{" "}
                            <span className="text-text-muted-dark">
                              "c9f4...28b1_ecdsa_p256"
                            </span>
                            {"\n"}
                            <span className="text-primary-container">
                              {"}"}
                            </span>
                          </pre>
                        </div>
                      </div>
                      {/* Action Hub */}
                      <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-2">
                        <button className="w-full sm:flex-1 flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_8px_24px_-4px_rgba(254,88,36,0.35)] hover:bg-tertiary-container hover:text-on-tertiary-container transition-all">
                          <span className="material-symbols-outlined text-[16px]">
                            replay
                          </span>
                          <span>Re-Dispatch Packet</span>
                        </button>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-high text-surface-light font-label-md text-label-md hover:bg-surface-container transition-colors">
                          <span className="material-symbols-outlined text-[16px]">
                            verified
                          </span>
                          <span>Audit Certificate</span>
                        </button>
                      </div>
                    </div>
                    {/* Node Telemetry Health Card */}
                    <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">
                            dns
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-surface-light font-bold">
                            Node egress-us-east-1a
                          </span>
                          <span className="font-label-caps text-label-caps text-text-muted-dark font-mono">
                            BGP PEER: AS13335 • 0 PACKET RETRANSMITS
                          </span>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
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
