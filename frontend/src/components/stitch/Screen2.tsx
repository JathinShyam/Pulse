"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Screen2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // For demo we assume the user might not exist, so we register them first
      try {
        await axios.post("http://localhost:8000/api/auth/register/", {
          username: email,
          email,
          password,
        });
      } catch (e) {
        // Ignore if user exists
      }

      const { data } = await axios.post(
        "http://localhost:8000/api/auth/login/",
        {
          username: email,
          password,
        },
      );
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      router.push("/");
    } catch (err: any) {
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <header className="fixed top-0 w-full z-50 bg-surface-pitch/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-20 max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
            <a
              className="flex items-center gap-space-sm group"
              data-path="overview"
              href="#"
            >
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_12px_rgba(254,88,36,0.6)]" />
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight uppercase">
                PULSE
              </span>
              <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase">
                CORE
              </span>
            </a>
            <nav
              className="flex items-center gap-space-md"
              data-active-classes="text-on-surface font-semibold"
            >
              <a
                aria-current="page"
                className="transition-colors text-on-surface font-semibold"
                data-path="login"
                href="#"
              >
                Operator Access
              </a>
            </nav>
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container">
                <span className="material-symbols-outlined text-primary-container text-[16px]">
                  verified_user
                </span>
                <span className="font-label-caps text-label-caps text-on-surface uppercase">
                  EAL6+ ISOLATED
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="w-full pt-20 bg-surface-pitch min-h-screen flex flex-col justify-between">
          <div className="flex flex-col w-full relative overflow-hidden py-space-xl items-center justify-center">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[720px] h-[720px] rounded-full bg-gradient-to-tr from-primary-container/10 via-tertiary-container/5 to-transparent blur-[140px] opacity-70" />
              <div className="absolute -top-32 right-1/4 w-[380px] h-[380px] rounded-full bg-primary/10 blur-[100px] opacity-40" />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
              <svg
                className="w-full h-full stroke-on-surface/20"
                height="100%"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    height={48}
                    id="pulse-grid"
                    patternUnits="userSpaceOnUse"
                    width={48}
                  >
                    <path
                      d="M 48 0 L 0 0 0 48"
                      fill="none"
                      strokeWidth="0.75"
                    />
                    <circle
                      className="text-primary-container/40"
                      cx={48}
                      cy={0}
                      fill="currentColor"
                      r="1.5"
                    />
                  </pattern>
                </defs>
                <rect fill="url(#pulse-grid)" height="100%" width="100%" />
              </svg>
            </div>
            <div className="w-full max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col items-center relative z-10">
              <div className="w-full max-w-[560px] bg-surface-card-dark/95 backdrop-blur-2xl rounded-lg p-space-lg md:p-space-xl shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_1px_1px_rgba(254,88,36,0.15)] flex flex-col gap-space-lg">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-lowest">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
                      <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
                        // AUTH GATEWAY 01
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted-dark">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-label-caps text-label-caps uppercase text-on-surface">
                        SYS.ONLINE
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm pt-space-xs">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container-lowest shadow-[0_0_24px_rgba(254,88,36,0.25)]">
                      <div className="w-5 h-5 rounded-full bg-primary-container shadow-[0_0_16px_rgba(254,88,36,0.85)] flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-surface-pitch" />
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-container/20 to-transparent pointer-events-none" />
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-primary-container tracking-wider">
                        CLUSTER ORCHESTRATION
                      </span>
                      <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                        Sign In to Pulse Console
                      </h1>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-text-muted-dark">
                    Authenticate access to mission-critical telemetry clusters,
                    real-time node dispatch pipelines, and high-throughput edge
                    routers.
                  </p>
                </div>
                <div className="flex flex-col gap-space-sm">
                  <button
                    className="group relative flex items-center justify-between w-full px-space-md py-3.5 rounded bg-surface-container-low hover:bg-surface-card-hover transition-all duration-200"
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm">
                      <div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          verified
                        </span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface group-hover:text-primary-fixed transition-colors">
                        Sign in with Okta / SAML 2.0
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-text-muted-dark text-[18px] group-hover:translate-x-0.5 group-hover:text-on-surface transition-all">
                      arrow_forward
                    </span>
                  </button>
                  <button
                    className="group relative flex items-center justify-between w-full px-space-md py-3.5 rounded bg-surface-container-low hover:bg-surface-card-hover transition-all duration-200"
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm">
                      <div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface text-[18px]">
                          terminal
                        </span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface group-hover:text-primary-fixed transition-colors">
                        Sign in with GitHub Enterprise
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-text-muted-dark text-[18px] group-hover:translate-x-0.5 group-hover:text-on-surface transition-all">
                      arrow_forward
                    </span>
                  </button>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-surface-container-high" />
                  </div>
                  <div className="relative px-space-md bg-surface-card-dark">
                    <span className="font-label-caps text-label-caps text-text-muted-dark tracking-widest uppercase">
                      // OR ENTERPRISE CREDENTIALS
                    </span>
                  </div>
                </div>
                <form
                  className="flex flex-col gap-space-md"
                  onSubmit={handleLogin}
                >
                  {error && (
                    <div className="text-red-500 text-sm font-semibold p-2 bg-red-500/10 rounded">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label
                        className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider"
                        htmlFor="work-email"
                      >
                        Corporate Identity / Work Email
                      </label>
                      <span
                        className="font-label-caps text-label-caps text-emerald-400 opacity-0 transition-opacity flex items-center gap-1"
                        id="email-badge"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          check_circle
                        </span>{" "}
                        VALIDATED DOMAIN
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        className="w-full h-12 bg-surface-container-lowest rounded px-space-md pl-11 text-on-surface placeholder:text-text-muted-dark font-body-md text-body-md focus:bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
                        id="work-email"
                        oninput="document.getElementById('email-badge').style.opacity = this.value.includes('@') ? '1' : '0'"
                        placeholder="operator@pulse.infrastructure.corp"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-text-muted-dark text-[18px]">
                        alternate_email
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label
                        className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider"
                        htmlFor="passkey-token"
                      >
                        Passkey / Credential Token
                      </label>
                      <a
                        className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors uppercase tracking-wider"
                        href="#"
                      >
                        Forgot passkey?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        className="w-full h-12 bg-surface-container-lowest rounded px-space-md pl-11 pr-11 text-on-surface placeholder:text-text-muted-dark font-body-md text-body-md focus:bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary-container transition-all tracking-widest"
                        id="passkey-token"
                        placeholder="••••••••••••••••••••••••••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-text-muted-dark text-[18px]">
                        key
                      </span>
                      <button
                        className="absolute right-3.5 top-3 text-text-muted-dark hover:text-on-surface transition-colors p-1"
                        id="toggle-visibility-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          id="vis-icon"
                        >
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-space-sm cursor-pointer select-none group">
                      <input
                        defaultChecked
                        className="peer sr-only"
                        id="remember-device"
                        type="checkbox"
                      />
                      <div className="w-5 h-5 rounded bg-surface-container-lowest peer-checked:bg-primary-container flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-white text-[14px] opacity-0 peer-checked:opacity-100 transition-opacity">
                          check
                        </span>
                      </div>
                      <span className="font-label-md text-label-md text-text-muted-dark group-hover:text-on-surface transition-colors">
                        Remember hardware session (30 days)
                      </span>
                    </label>
                    <div
                      className="flex items-center gap-1 text-text-muted-dark"
                      title="Hardware Bound Security Key Active"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        detector
                      </span>
                      <span className="font-label-caps text-label-caps">
                        FIDO2
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="group relative w-full h-14 rounded-full bg-primary-container text-white font-label-md text-label-md flex items-center justify-center gap-space-sm shadow-[0_8px_32px_-4px_rgba(254,88,36,0.65)] hover:shadow-[0_12px_40px_-2px_rgba(254,88,36,0.85)] hover:bg-[#ff6938] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 mt-space-xs"
                    type="submit"
                  >
                    <span className="tracking-wide">
                      {loading ? "Authenticating..." : "Sign In to Console"}
                    </span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </form>
                <div className="pt-space-xs flex flex-col gap-space-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center p-2 rounded bg-surface-container-lowest text-center">
                      <span className="material-symbols-outlined text-primary text-[16px] mb-0.5">
                        lock
                      </span>
                      <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-tight">
                        HMAC-SHA256
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded bg-surface-container-lowest text-center">
                      <span className="material-symbols-outlined text-primary text-[16px] mb-0.5">
                        policy
                      </span>
                      <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-tight">
                        SOC2 Type II
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded bg-surface-container-lowest text-center">
                      <span className="material-symbols-outlined text-primary text-[16px] mb-0.5">
                        security
                      </span>
                      <span className="font-label-caps text-label-caps text-text-muted-dark uppercase tracking-tight">
                        Hardware FIDO2
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-space-sm py-2 rounded bg-surface-container-lowest/80 text-text-muted-dark font-label-caps text-label-caps">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-on-surface uppercase">
                        us-east-1a (PRIMARY REGION)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        speed
                      </span>
                      <span className="text-on-surface font-mono">
                        LATENCY: 41.8ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-lg text-text-muted-dark">
                <a
                  className="font-label-caps text-label-caps hover:text-on-surface transition-colors uppercase tracking-wider"
                  href="#"
                >
                  Zero Trust Access Protocol
                </a>
                <span className="text-surface-container-high">•</span>
                <a
                  className="font-label-caps text-label-caps hover:text-on-surface transition-colors uppercase tracking-wider"
                  href="#"
                >
                  Cluster Telemetry Docs
                </a>
                <span className="text-surface-container-high">•</span>
                <a
                  className="font-label-caps text-label-caps hover:text-on-surface transition-colors uppercase tracking-wider"
                  href="#"
                >
                  Root Incident Desk
                </a>
              </div>
            </div>
          </div>
        </main>
        <footer className="w-full bg-surface-container-lowest py-space-xl">
          <div className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-2 h-2 rounded-full bg-primary-container" />
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                PULSE HIGH-VELOCITY DISPATCH ENGINE • VERSION 4.19
              </span>
            </div>
            <div className="flex items-center gap-space-lg">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                ZERO LOSS TELEMETRY
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                © 2025 CORP INFRASTRUCTURE
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
