"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { Logo, PulseMark } from "@/components/logo";
import { safeNextPath } from "@/lib/session";

const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.1.0";

function LoginFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas">
      <div className="h-64 w-full max-w-sm animate-pulse rounded-2xl border border-line bg-surface/60" />
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const nextUrl = safeNextPath(rawNext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        "/api/auth/login/",
        { username: email, password },
        { timeout: 12_000 },
      );
      router.replace(nextUrl);
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Email or password is incorrect.");
      } else if (
        axios.isAxiosError(err) &&
        (!err.response || [502, 503, 504].includes(err.response.status))
      ) {
        setError(
          "The authentication service is unreachable. Check that the API is running and try again.",
        );
      } else {
        setError("Sign-in failed. Try again or contact your administrator.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="flex items-center justify-between">
          <Logo inverted />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-white/65 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back to site
          </Link>
        </div>

        <div className="relative">
          <p className="font-mono text-[10px] tracking-[0.12em] text-white/55 uppercase">
            Pulse console
          </p>
          <h2 className="mt-4 max-w-[10ch] font-display text-[clamp(3rem,5vw,4.5rem)] leading-[0.94] font-semibold tracking-[-0.055em] text-white">
            Every message, accounted for.
          </h2>
          <p className="mt-5 max-w-[38ch] text-[13px] leading-relaxed text-white/65">
            Sign in to inspect delivery traces, route a message and keep the
            queue moving.
          </p>

          <div className="mt-12 max-w-md">
            <svg
              viewBox="0 0 440 64"
              className="h-16 w-full text-white/15"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 40h48l8-22 11 40 9-30 6 12h66l9-26 12 46 10-36 7 16h68l9-24 11 42 9-32 6 14h62l9-20 11 36 8-28 6 12h50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="418" cy="23" r="3" fill="var(--color-accent)" />
            </svg>
            <div className="mt-3 flex justify-between font-mono text-[9px] tracking-[0.08em] text-white/55 uppercase">
              <span>Accepted</span>
              <span>Routed</span>
              <span>Acknowledged</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[9px] tracking-[0.08em] text-white/55 uppercase">
          <span className="flex items-center gap-2">
            <PulseMark className="size-3.5 text-accent" />
            API v{VERSION}
          </span>
          <span>Email · SMS · Push</span>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col">
        <div className="flex items-center justify-between px-5 py-5 lg:hidden">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="reveal w-full max-w-[360px]">
            <p className="eyebrow">Console</p>
            <h1 className="mt-3 font-display text-4xl leading-none font-semibold tracking-[-0.05em]">
              Sign in
            </h1>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Use your workspace credentials to continue.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2.5 rounded-lg border border-err/25 bg-err/[0.04] p-3"
              >
                <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-err" />
                <p className="text-[11px] leading-relaxed text-muted">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-[12px] font-medium"
                >
                  Email or username
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    autoComplete="username"
                    required
                    className="input pl-9"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-[12px] font-medium"
                  >
                    Password
                  </label>
                  <span className="text-[10px] text-faint">
                    Ask an administrator
                  </span>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="input pr-10 pl-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1.5 text-faint hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary mt-2 w-full"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                {loading ? "Signing in…" : "Sign in to console"}
              </button>
            </form>

            <p className="mt-6 border-t border-line pt-5 text-[11px] leading-relaxed text-faint">
              Need access? Ask your workspace administrator.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-5 text-[10px] text-faint sm:px-8">
          <span>© {new Date().getFullYear()} Pulse</span>
          <span className="font-mono tracking-[0.06em] uppercase">
            Application · API · Delivery
          </span>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
