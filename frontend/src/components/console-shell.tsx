"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  HelpCircle,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Menu,
  Plus,
  Search,
  Send,
  Server,
  X,
} from "lucide-react";
import { Logo, PulseMark } from "@/components/logo";
import { endSession } from "@/lib/api";
import { useMe } from "@/lib/queries";
import { cn } from "@/lib/utils";

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "Local";
const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.1.0";
const DOCS_URL = process.env.NEXT_PUBLIC_API_DOCS_URL || "/api/docs/";

interface ConsoleShellProps {
  children: React.ReactNode;
  activePath?: "overview" | "composer" | "logs" | "gateways";
}

const NAV = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    key: "overview",
  },
  { href: "/composer", label: "Composer", icon: Send, key: "composer" },
  { href: "/logs", label: "Deliveries", icon: ListFilter, key: "logs" },
  { href: "/gateways", label: "Gateways", icon: Server, key: "gateways" },
] as const;

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/composer": "Composer",
  "/logs": "Deliveries",
  "/gateways": "Gateways",
};

function initials(value?: string | null) {
  if (!value) return "OP";
  const name = value.split("@")[0].replace(/[^a-zA-Z]/g, " ");
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase() || "OP";
  }
  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "OP"
  );
}

export function ConsoleShell({ children, activePath }: ConsoleShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const me = useMe();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const logout = async () => {
    queryClient.clear();
    await endSession();
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/logs?q=${encodeURIComponent(query.trim())}`);
  };

  const title = TITLES[pathname] ?? "Console";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Logo href="/" />
        <Link
          href="/"
          aria-label="Open public site"
          className="text-faint transition-colors hover:text-ink"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="px-3 py-4">
        <div className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <PulseMark className="size-4 text-accent" />
            <span className="truncate text-[13px] font-medium">
              {ENVIRONMENT}
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.08em] text-faint uppercase">
            v{VERSION}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const active =
            activePath === item.key ||
            (!activePath && pathname === item.href) ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors",
                active
                  ? "bg-ink text-white"
                  : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-white" : "text-faint",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 p-3">
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
          className="flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <HelpCircle className="size-4 text-faint" />
          API reference
          <ArrowUpRight className="ml-auto size-3.5 text-faint" />
        </a>

        <div className="border-t border-line pt-3">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-[10px] font-medium text-muted">
              {initials(me.data?.username)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">
                {me.data?.username ??
                  (me.isError ? "Session unavailable" : "Loading…")}
              </p>
              <p className="truncate font-mono text-[10px] text-faint">
                {me.data?.auth === "api_key"
                  ? "API key"
                  : me.data?.email && me.data.email !== me.data.username
                    ? me.data.email
                    : me.data
                      ? "JWT session"
                      : me.isError
                        ? "Pulse console"
                        : "Loading…"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
              className="rounded-md p-1.5 text-faint transition-colors hover:bg-surface-2 hover:text-err"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[248px] border-r border-line bg-canvas lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-canvas">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute top-3 right-3 z-10 rounded-md p-2 text-muted hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                className="btn btn-ghost size-10 p-0 lg:hidden"
              >
                <Menu className="size-5" />
              </button>
              <Logo href="/" className="lg:hidden" />
              <div className="hidden items-center gap-2 text-[13px] sm:flex">
                <span className="text-faint">Console</span>
                <span className="text-line-strong">/</span>
                <span className="font-medium">{title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <form
                onSubmit={submitSearch}
                className="relative hidden md:block"
                role="search"
              >
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search deliveries"
                  aria-label="Search deliveries"
                  className="input h-9 w-56 rounded-lg pr-12 pl-9 text-[13px] lg:w-64"
                />
                <kbd className="kbd pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
                  /
                </kbd>
              </form>

              {pathname !== "/composer" && (
                <Link
                  href="/composer"
                  className="btn btn-primary btn-sm px-3.5"
                >
                  <Plus className="size-3.5" />
                  <span className="hidden sm:inline">New dispatch</span>
                  <span className="sm:hidden">New</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1320px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
