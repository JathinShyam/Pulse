"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Screen1() {
  const [templateName, setTemplateName] = useState("welcome_email");
  const [userId, setUserId] = useState("user_123");
  const [to, setTo] = useState("");
  const [context, setContext] = useState('{"name": "John Doe"}');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      const parsedContext = JSON.parse(context);
      const res = await axios.post(
        "http://localhost:8000/api/notifications/send/",
        {
          template_name: templateName,
          user_id: userId,
          to: to,
          context: parsedContext,
          idempotency_key: crypto.randomUUID(),
        },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : { "X-API-Key": "dummy-key-for-now" },
        },
      );
      setStatusMsg(
        `Success: ${res.data.status} (ID: ${res.data.notification_id})`,
      );
    } catch (err: any) {
      setStatusMsg(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
                aria-current="page"
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-DEFAULT transition-colors bg-primary-container text-on-primary-container font-bold"
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
            <div className="flex flex-col w-full max-w-4xl mx-auto py-space-xl px-space-lg">
              <div className="flex flex-col gap-space-sm mb-space-xl">
                <h1 className="font-headline-xl text-headline-xl text-surface-light tracking-tight">
                  Deploy Signal
                </h1>
                <p className="text-text-muted-dark font-body-lg text-body-lg">
                  Manually trigger a notification payload across the routing
                  mesh.
                </p>
              </div>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSend}
                className="flex flex-col gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
              >
                {statusMsg && (
                  <div
                    className={`p-space-md rounded font-mono text-sm ${statusMsg.startsWith("Success") ? "bg-emerald-400/10 text-emerald-400" : "bg-red-500/10 text-red-500"}`}
                  >
                    {statusMsg}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-space-lg">
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                      Template Name
                    </label>
                    <input
                      required
                      className="h-12 bg-surface-pitch text-on-surface px-space-md rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-container font-mono text-[13px]"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                      Target User ID
                    </label>
                    <input
                      required
                      className="h-12 bg-surface-pitch text-on-surface px-space-md rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-container font-mono text-[13px]"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                    Recipient (Email / SMS / Token)
                  </label>
                  <input
                    required
                    className="h-12 bg-surface-pitch text-on-surface px-space-md rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-container font-mono text-[13px]"
                    placeholder="e.g. +14155550123 or user@example.com"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                    Payload Context (JSON)
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="bg-surface-pitch text-on-surface p-space-md rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-container font-mono text-[13px] resize-none"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="mt-space-md h-12 w-48 rounded-full bg-primary-container text-white font-label-md text-label-md font-bold shadow-[0_8px_24px_-4px_rgba(254,88,36,0.35)] hover:bg-[#ff6938] disabled:opacity-50 transition-all flex items-center justify-center gap-space-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    electric_bolt
                  </span>
                  {loading ? "DISPATCHING..." : "DISPATCH SIGNAL"}
                </button>
              </motion.form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
