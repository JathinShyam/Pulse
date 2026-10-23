import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";

const docsUrl = process.env.NEXT_PUBLIC_API_DOCS_URL || "/api/docs/";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Overview" },
      { href: "/composer", label: "Composer" },
      { href: "/logs", label: "Deliveries" },
      { href: "/gateways", label: "Gateways" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: docsUrl, label: "API reference", external: true },
      { href: "/#delivery", label: "Delivery model" },
      { href: "/#product", label: "How it works" },
    ],
  },
  {
    title: "Access",
    links: [{ href: "/login", label: "Sign in" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-[32ch] text-sm leading-relaxed text-muted">
              Delivery infrastructure for teams that can&apos;t afford to miss.
              Email, SMS and push behind one careful API.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-faint uppercase">
              <span className="dot bg-accent" />
              Three channels · one API
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="md:col-span-2">
              <h3 className="label">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3 text-faint" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pulse. All rights reserved.</p>
          <p className="font-mono text-[10px] tracking-[0.08em] uppercase">
            Application · API · Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
