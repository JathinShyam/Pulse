"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Cpu,
  Globe,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Network,
  Plus,
  Radio,
  RefreshCw,
  Server,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import { ConsoleShell } from "@/components/console-shell";

export default function GatewaysPage() {
  const [activeTab, setActiveTab] = useState<"topology" | "rules">("topology");

  const gatewayTrunks = [
    {
      name: "Apple APNs Edge Gateway",
      provider: "apns-direct.push.apple.com",
      status: "PRIMARY LIVE",
      latency: "18ms",
      failover: "Cascade to FCM v1 on timeout > 1.2s",
      success: "99.99%",
      velocity: "1.8M/hr",
      type: "push",
    },
    {
      name: "Google FCM Direct Driver",
      provider: "fcm.googleapis.com/v1",
      status: "PRIMARY LIVE",
      latency: "22ms",
      failover: "Cascade to APNs or direct SMS",
      success: "99.98%",
      velocity: "2.4M/hr",
      type: "push",
    },
    {
      name: "AWS SES TLS FastPool",
      provider: "email-smtp.us-east-1.amazonaws.com",
      status: "PRIMARY LIVE",
      latency: "46ms",
      failover: "Cascade to SparkPost on reputation dip",
      success: "99.95%",
      velocity: "1.1M/hr",
      type: "email",
    },
    {
      name: "Twilio Super Network",
      provider: "api.twilio.com/2010-04-01",
      status: "PRIMARY LIVE",
      latency: "82ms",
      failover: "Instant failover to Sinch SMPP 10.4",
      success: "99.92%",
      velocity: "620k/hr",
      type: "sms",
    },
    {
      name: "Sinch Global SMPP Pipe",
      provider: "smpp.sinch.com:2775",
      status: "HOT STANDBY",
      latency: "94ms",
      failover: "Failover for APAC / LATAM routes",
      success: "99.88%",
      velocity: "240k/hr",
      type: "sms",
    },
    {
      name: "SparkPost Enterprise Pool",
      provider: "smtp.sparkpostmail.com:587",
      status: "COLD BACKUP",
      latency: "110ms",
      failover: "Circuit breaker activated if AWS dropped",
      success: "99.90%",
      velocity: "Standby",
      type: "email",
    },
  ];

  return (
    <ConsoleShell activePath="gateways">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="label-caps text-subtle">
              <span>05 // INFRASTRUCTURE TOPOLOGY // CARRIER MESH MATRIX</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-1">
              Routing Topology &amp; Protocols
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-surface border border-line text-brand">
              INGESTION: 2.4M msg/sec
            </span>
            <button
              onClick={() => alert("Gateway configuration modal.")}
              className="btn-glow flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Gateway Endpoint</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-line">
            <div className="flex items-center justify-between text-subtle label-caps">
              <span>01 // ACTIVE NODES</span>
              <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
            </div>
            <div className="mt-2 font-display font-bold text-2xl text-white">
              194 <span className="text-muted text-sm font-normal">/ 194</span>
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted">
              <span>BGP Mesh: 100%</span>
              <span className="text-ok font-semibold">12 REGIONS</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-line">
            <div className="flex items-center justify-between text-subtle label-caps">
              <span>02 // PROPAGATION</span>
              <span className="text-ok font-bold">P99: 48ms</span>
            </div>
            <div className="mt-2 font-display font-bold text-2xl text-white">
              34.2{" "}
              <span className="font-mono text-xs text-muted font-normal">
                ms
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted">
              <span>Edge Round-Trip</span>
              <span className="text-brand font-semibold">TCP OPT ACTIVE</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-line">
            <div className="flex items-center justify-between text-subtle label-caps">
              <span>03 // REDUNDANT PATHS</span>
              <span className="text-brand font-bold">HOT STANDBY</span>
            </div>
            <div className="mt-2 font-display font-bold text-2xl text-white">
              14 <span className="text-muted text-sm font-normal">Paths</span>
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted">
              <span>Auto-Failover Circuit</span>
              <span className="text-ok font-semibold">ZERO DROP</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-line">
            <div className="flex items-center justify-between text-subtle label-caps">
              <span>04 // BANDWIDTH</span>
              <span className="text-ok font-bold">NOMINAL</span>
            </div>
            <div className="mt-2 font-display font-bold text-2xl text-white">
              41.8{" "}
              <span className="font-mono text-xs text-muted font-normal">
                %
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted">
              <span>Capacity: 8.1M/s</span>
              <span className="text-muted">BURSTABLE</span>
            </div>
          </div>
        </section>

        {/* Visual Topology Diagram Card */}
        <section className="p-6 rounded-2xl bg-card border border-line flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="label-caps text-subtle">
              ACTIVE EDGE TRANSIT MESH &amp; CORE SWITCHING
            </span>
            <span className="label-caps text-ok font-mono">
              LINK SATURATION: OPTIMAL
            </span>
          </div>

          <div className="py-6 flex flex-col md:flex-row items-center justify-around gap-6 text-center font-mono">
            {/* Ingress */}
            <div className="p-4 rounded-xl bg-surface border border-line w-48 flex flex-col items-center">
              <Radio className="w-6 h-6 text-brand mb-2" />
              <span className="text-white font-bold text-xs">
                Ingress Gateway
              </span>
              <span className="text-subtle text-[10px] mt-0.5">
                TLS 1.3 / QUIC 0-RTT
              </span>
              <span className="mt-2 px-2 py-0.5 rounded bg-brand/10 text-brand text-[9px] font-bold">
                142.1M PKT/S
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-brand hidden md:block" />

            {/* Core Router */}
            <div className="p-5 rounded-2xl bg-pitch border border-brand/50 w-56 flex flex-col items-center shadow-[0_0_24px_rgba(254,88,36,0.25)]">
              <Zap className="w-8 h-8 text-brand animate-pulse mb-1.5" />
              <span className="font-display font-bold text-sm text-white">
                PULSE MATRIX CORE
              </span>
              <span className="text-subtle text-[10px]">
                Zero Loss Dispatch Buffer
              </span>
              <span className="mt-2 text-ok text-[11px] font-bold">
                48 ACTIVE WORKERS
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-brand hidden md:block" />

            {/* Egress Gateways */}
            <div className="flex flex-col gap-2 w-48 text-left text-xs">
              <div className="p-2 rounded-lg bg-surface border border-line flex items-center justify-between">
                <span className="text-white">APNs HTTP/2</span>
                <span className="text-ok font-bold text-[10px]">18ms</span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-line flex items-center justify-between">
                <span className="text-white">Google FCM</span>
                <span className="text-ok font-bold text-[10px]">22ms</span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-line flex items-center justify-between">
                <span className="text-white">AWS SES Mail</span>
                <span className="text-cyan-400 font-bold text-[10px]">
                  46ms
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-line flex items-center justify-between">
                <span className="text-white">Twilio SMPP</span>
                <span className="text-purple-400 font-bold text-[10px]">
                  82ms
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Carrier Gateways Table */}
        <section className="p-5 rounded-2xl bg-card border border-line flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="label-caps text-subtle">
              CARRIER GATEWAY &amp; REDUNDANCY TOPOLOGY
            </span>
            <span className="font-mono text-xs text-brand font-semibold">
              12 CHANNELS ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-subtle label-caps border-b border-line">
                  <th className="py-2.5 px-3">GATEWAY / PROVIDER TRUNK</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">P95 LATENCY</th>
                  <th className="py-2.5 px-3">FAILOVER CASCADE PATH</th>
                  <th className="py-2.5 px-3 text-right">SUCCESS RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {gatewayTrunks.map((gw, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-surface/60 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-sans font-bold text-white text-xs">
                        {gw.name}
                      </div>
                      <div className="text-subtle text-[11px]">
                        {gw.provider}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 label-caps px-2 py-0.5 rounded-full ${
                          gw.status.includes("PRIMARY")
                            ? "bg-ok/10 text-ok border border-ok/30"
                            : "bg-surface text-muted border border-line"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            gw.status.includes("PRIMARY")
                              ? "bg-ok animate-pulse"
                              : "bg-muted"
                          }`}
                        />
                        {gw.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-white font-bold">
                      {gw.latency}
                    </td>
                    <td className="py-3 px-3 text-muted text-[11px]">
                      {gw.failover}
                    </td>
                    <td className="py-3 px-3 text-ok font-bold text-right">
                      {gw.success}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Multi-Tier Cascade & Fallback Rules */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-line">
            <span className="label-caps text-brand">
              RULE #01 — CRITICAL P0
            </span>
            <h3 className="font-display font-bold text-base text-white mt-1">
              Security &amp; Core Alert Cascade
            </h3>
            <p className="text-muted text-xs mt-2 leading-relaxed">
              APNs Multi-Pipe &rarr; FCM v1 Direct Handshake &rarr; Immediate
              Tier-1 SMS dispatch if carrier remains unacknowledged after 1.2
              seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-line">
            <span className="label-caps text-cyan-400">
              RULE #02 — AUTH OTP
            </span>
            <h3 className="font-display font-bold text-base text-white mt-1">
              Transactional OTP Fallback
            </h3>
            <p className="text-muted text-xs mt-2 leading-relaxed">
              SMS direct carrier bind &rarr; Instant Voice Call OTP fallback
              &rarr; Encrypted Push Token dispatch if mobile carrier
              unreachable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-line">
            <span className="label-caps text-purple-400">
              RULE #03 — BATCH DIGEST
            </span>
            <h3 className="font-display font-bold text-base text-white mt-1">
              Enterprise Digested Egress
            </h3>
            <p className="text-muted text-xs mt-2 leading-relaxed">
              Bulk email batching through AWS SES High-Throughput &rarr;
              Immediate automated failover to SparkPost Enterprise pool.
            </p>
          </div>
        </section>
      </div>
    </ConsoleShell>
  );
}
