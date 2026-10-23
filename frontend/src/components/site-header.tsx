"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#delivery", label: "Delivery" },
  { href: "/pricing", label: "Pricing" },
];

const docsUrl = process.env.NEXT_PUBLIC_API_DOCS_URL || "/api/docs/";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 text-[13px] text-muted md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-ink",
                pathname === link.href && "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={docsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-ink"
          >
            API
            <ArrowUpRight className="size-3.5" />
          </a>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link href="/dashboard" className="btn btn-primary btn-sm px-3.5">
            Open console
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="btn btn-ghost -mr-2 size-10 p-0 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-canvas px-5 py-5 md:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center border-b border-line text-sm text-ink"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center gap-1 border-b border-line text-sm text-ink"
            >
              API reference
              <ArrowUpRight className="size-3.5 text-faint" />
            </a>
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="btn btn-secondary"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="btn btn-primary"
            >
              Open console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
