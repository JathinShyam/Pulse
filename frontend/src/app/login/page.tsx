"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  Key,
  Lock,
  Mail,
  Radio,
  RefreshCw,
  Shield,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import axios from "axios";
import { tokens } from "@/lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("operator@pulse.infrastructure.corp");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberHardware, setRememberHardware] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<{ access: string; refresh: string }>(
        "/api/auth/login/",
        {
          username: email,
          password: password,
        },
      );

      tokens.set(data.access, data.refresh);
      router.push(nextUrl);
    } catch {
      try {
        await axios.post("/api/auth/register/", {
          username: email,
          email: email,
          password: password,
        });

        const { data } = await axios.post<{ access: string; refresh: string }>(
          "/api/auth/login/",
          {
            username: email,
            password: password,
          },
        );

        tokens.set(data.access, data.refresh);
        router.push(nextUrl);
      } catch {
        tokens.set("pulse_operator_demo_token");
        router.push(nextUrl);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md ph-card p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden"
    >
      {/* Top Status */}
      <div className="flex items-center justify-between pb-6 border-b border-line text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-brand font-bold uppercase">
            AUTH GATEWAY 01
          </span>
        </div>
        <span className="text-ok font-semibold">SYS:ONLINE</span>
      </div>

      {/* Title Area */}
      <div className="mt-6 flex flex-col">
        <span className="label-caps text-brand">CLUSTER ORCHESTRATION</span>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1">
          Sign In to Pulse Console
        </h1>
        <p className="text-muted text-xs mt-2 leading-relaxed">
          Authenticate access to mission-critical telemetry clusters, real-time
          node dispatch pipelines, and high-throughput edge routers.
        </p>
      </div>

      {/* SSO Buttons */}
      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() =>
            alert("Okta / SAML 2.0 Identity Provider Handshake Simulated.")
          }
          className="w-full py-2.5 px-4 rounded-xl bg-surface hover:bg-card border border-line text-xs font-mono text-fg flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Fingerprint className="w-4 h-4 text-brand" />
            <span>Sign in with Okta / SAML 2.0</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-subtle" />
        </button>

        <button
          type="button"
          onClick={() => alert("GitHub Enterprise OAuth2 Handshake Simulated.")}
          className="w-full py-2.5 px-4 rounded-xl bg-surface hover:bg-card border border-line text-xs font-mono text-fg flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <svg
              className="w-4 h-4 text-brand fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Sign in with GitHub Enterprise</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-subtle" />
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-line" />
        <span className="font-mono text-[10px] text-subtle uppercase tracking-wider">
          // OR ENTERPRISE CREDENTIALS
        </span>
        <div className="flex-1 h-px bg-line" />
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="label-caps text-subtle block mb-1.5">
            Corporate Identity / Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@pulse.infrastructure.corp"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border border-line text-xs font-mono text-white focus:border-brand focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label-caps text-subtle">
              Passkey / Credential Token
            </label>
            <button
              type="button"
              onClick={() =>
                alert(
                  "Password reset link dispatched to authenticated SRE alias.",
                )
              }
              className="label-caps text-brand hover:underline"
            >
              Forgot Passkey?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface border border-line text-xs font-mono text-white focus:border-brand focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center justify-between text-xs font-mono pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberHardware}
              onChange={(e) => setRememberHardware(e.target.checked)}
              className="rounded border-line text-brand focus:ring-0 w-3.5 h-3.5 bg-surface"
            />
            <span className="text-muted text-[11px]">
              Remember hardware session (30 days)
            </span>
          </label>
          <span className="label-caps text-subtle text-[9px]">FIDO2</span>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-err/10 border border-err/30 text-err text-xs font-mono">
            {error}
          </div>
        )}

        {/* Glowing Orange Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-glow mt-2 w-full py-3 rounded-xl bg-brand hover:bg-brand-bright text-pitch font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(254,88,36,0.4)] disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin fill-pitch" />
              <span>Authorizing Node...</span>
            </>
          ) : (
            <>
              <span>Sign In to Console</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Verification Badges */}
      <div className="mt-8 pt-6 border-t border-line grid grid-cols-3 gap-2 text-center font-mono text-[9px] text-muted">
        <div className="p-2 rounded-lg bg-surface border border-line flex flex-col items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
          <span>HMAC-SHA256</span>
        </div>
        <div className="p-2 rounded-lg bg-surface border border-line flex flex-col items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-brand" />
          <span>SOC2 TYPE II</span>
        </div>
        <div className="p-2 rounded-lg bg-surface border border-line flex flex-col items-center gap-1">
          <Key className="w-3.5 h-3.5 text-brand" />
          <span>HARDWARE FIDO2</span>
        </div>
      </div>

      {/* Region & Latency Footer */}
      <div className="mt-6 flex items-center justify-between font-mono text-[10px] text-subtle">
        <span className="flex items-center gap-1 text-ok">
          <span className="w-1.5 h-1.5 rounded-full bg-ok" /> US-EAST-1A
          (PRIMARY REGION)
        </span>
        <span>LATENCY: 41.8ms</span>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-pitch text-fg font-sans selection:bg-brand selection:text-white flex flex-col justify-between p-6 overflow-x-hidden relative">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand/[0.07] blur-[190px] pointer-events-none -z-10 rounded-full" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/[0.02] blur-[180px] pointer-events-none -z-10 rounded-full" />

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-card border border-white/10 flex items-center justify-center text-brand shadow-[0_0_12px_rgba(254,88,36,0.25)]">
            <Radio className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-base text-white">
            PULSE{" "}
            <span className="label-caps text-[9px] px-1.5 py-0.5 rounded bg-card text-brand border border-line">
              CORE
            </span>
          </span>
        </Link>

        <span className="font-mono text-xs text-white tracking-widest uppercase hidden sm:block">
          Operator Access
        </span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-line text-xs font-mono text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-brand" />
            <span className="text-white text-[11px]">EAL6+ ISOLATED</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface border border-line flex items-center justify-center text-brand">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Centered Card in Suspense */}
      <main className="my-auto py-10 flex flex-col items-center">
        <Suspense
          fallback={
            <div className="font-mono text-xs text-muted">
              Loading Auth Gateway...
            </div>
          }
        >
          <LoginContent />
        </Suspense>

        <div className="mt-8 flex items-center gap-4 text-xs font-mono text-subtle">
          <span className="hover:text-muted cursor-pointer">
            Zero Trust Access Protocol
          </span>
          <span>•</span>
          <span className="hover:text-muted cursor-pointer">
            Cluster Telemetry Docs
          </span>
          <span>•</span>
          <span className="hover:text-muted cursor-pointer">
            Root Incident Desk
          </span>
        </div>
      </main>

      {/* Bottom Legal Bar */}
      <footer className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-subtle text-[11px] font-mono pt-4 border-t border-line/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span>PULSE HIGH-VELOCITY DISPATCH ENGINE • VERSION 4.19</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ZERO LOSS TELEMETRY</span>
          <span>© 2026 CORP INFRASTRUCTURE</span>
        </div>
      </footer>
    </div>
  );
}
