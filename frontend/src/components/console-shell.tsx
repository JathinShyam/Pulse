"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  Globe,
  Grid,
  Layers,
  Lock,
  LogOut,
  Menu,
  Radio,
  Rocket,
  Search,
  Server,
  Shield,
  Terminal,
  User,
  Zap,
  X,
} from "lucide-react";
import { tokens } from "@/lib/api";

interface ConsoleShellProps {
  children: React.ReactNode;
  activePath?: "overview" | "composer" | "logs" | "gateways" | "pricing";
}

export function ConsoleShell({ children, activePath }: ConsoleShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    {
      label: "Analytics & KPI",
      href: "/dashboard",
      icon: Activity,
      key: "overview",
      badge: "LIVE",
    },
    {
      label: "Dispatch Composer",
      href: "/composer",
      icon: Rocket,
      key: "composer",
      badge: "P0",
    },
    {
      label: "Logs & Telemetry",
      href: "/logs",
      icon: Terminal,
      key: "logs",
      badge: "0-RTT",
    },
    {
      label: "Gateways & Mesh",
      href: "/gateways",
      icon: Server,
      key: "gateways",
      badge: "48/48",
    },
    {
      label: "Pricing & SLA",
      href: "/pricing",
      icon: Layers,
      key: "pricing",
      badge: "SLA",
    },
  ];

  const handleLogout = () => {
    tokens.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-pitch text-fg antialiased font-sans selection:bg-brand selection:text-white">
      {/* Ambient background glow orbs */}
      <div className="fixed top-0 left-1/3 -translate-x-1/2 w-[700px] h-[350px] bg-brand/5 blur-[160px] pointer-events-none -z-10 rounded-full" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-brand/[0.03] blur-[180px] pointer-events-none -z-10 rounded-full" />

      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-16 bg-surface/90 backdrop-blur-xl border-b border-line">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-card border border-white/10 flex items-center justify-center text-brand shadow-[0_0_12px_rgba(254,88,36,0.3)]">
            <Radio className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            PULSE<span className="text-brand">.</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-card border border-line text-muted hover:text-white"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Desktop / Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-surface/95 lg:bg-surface border-r border-line z-50 flex flex-col justify-between p-5 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo & Version */}
          <div className="flex items-center justify-between pt-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-card border border-white/10 flex items-center justify-center text-brand group-hover:scale-105 group-hover:border-brand/40 transition-all shadow-[0_0_16px_rgba(254,88,36,0.25)]">
                <Radio className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  PULSE
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                </span>
                <span className="font-mono text-[9px] tracking-widest text-subtle uppercase">
                  ENGINE V4.19
                </span>
              </div>
            </Link>
            <Link
              href="/"
              title="Return to Public Landing Page"
              className="text-subtle hover:text-brand transition-colors p-1"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Active Cluster Pill */}
          <div className="px-3.5 py-2.5 rounded-xl bg-card border border-line flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_#fe5824]" />
              <span className="font-mono text-xs font-semibold text-fg truncate">
                cluster-us-east-1
              </span>
            </div>
            <span className="label-caps text-[9px] px-1.5 py-0.5 rounded bg-surface border border-line text-brand">
              ACTIVE
            </span>
          </div>

          {/* Monitoring Status Badge */}
          <div className="px-1 flex items-center justify-between">
            <span className="label-caps text-subtle">MONITORING</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ok animate-ping" />
              <span className="font-mono text-[10px] font-semibold text-ok">
                38MS PING
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                activePath === item.key ||
                (pathname === item.href && !activePath) ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand text-pitch font-bold shadow-[0_4px_20px_-4px_rgba(254,88,36,0.5)]"
                      : "text-muted hover:bg-card hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-pitch" : "text-muted"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-black/20 text-pitch font-bold"
                        : "bg-card text-subtle"
                    }`}
                  >
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: Fast Dispatch CTA & Operator Info */}
        <div className="flex flex-col gap-3 pt-4 border-t border-line">
          <Link
            href="/composer"
            className="btn-glow w-full flex items-center justify-center gap-2 py-2.5 bg-brand hover:bg-brand-bright text-pitch font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
          >
            <Zap className="w-4 h-4 fill-pitch" />
            <span>Fast Dispatch</span>
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-line">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-surface border border-brand/30 flex items-center justify-center text-brand shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs text-white truncate font-medium">
                  alex.rivera@corp
                </span>
                <span className="font-mono text-[9px] text-subtle uppercase">
                  OPERATOR SRE
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-subtle hover:text-err transition-colors p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 h-16 bg-pitch/80 backdrop-blur-xl border-b border-line flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-line text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
              <span className="text-white font-medium text-[11px]">
                ALL GATEWAYS OPERATIONAL
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-subtle font-mono text-[11px]">
              <Radio className="w-3.5 h-3.5 text-brand" />
              <span>SYNCED VIA QUIC 0-RTT</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden sm:block w-64 lg:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search payloads, events, keys..."
                className="w-full h-9 pl-9 pr-3 rounded-full bg-card border border-line text-xs text-fg placeholder:text-subtle focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            <Link
              href="/composer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card hover:bg-card-hover border border-line text-white text-xs font-mono transition-colors"
            >
              <Rocket className="w-3.5 h-3.5 text-brand" />
              <span>Deploy Signal</span>
            </Link>

            <button
              title="Notifications"
              className="w-9 h-9 rounded-full bg-card border border-line flex items-center justify-center text-muted hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>

            <Link
              href="/login"
              title="Authentication Status"
              className="w-9 h-9 rounded-full bg-card border border-brand/40 flex items-center justify-center text-brand hover:scale-105 transition-all"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
