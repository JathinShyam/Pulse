"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Gauge,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fmtCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DOCS_URL = process.env.NEXT_PUBLIC_API_DOCS_URL || "/api/docs/";

const tiers = [
  {
    name: "Starter",
    description: "For prototypes, side projects and the first production send.",
    monthly: 0,
    annual: 0,
    volume: "10,000 sends / month",
    cta: "Open the console",
    href: "/login",
    features: [
      "Email, SMS and push",
      "10,000 accepted sends (illustrative)",
      "Idempotency and priority queues",
      "Per-message traces",
      "Self-hosted deployment",
    ],
  },
  {
    name: "Scale",
    description: "For teams shipping to real audiences, every day.",
    monthly: 499,
    annual: 399,
    volume: "2,000,000 sends / month",
    cta: "Open the console",
    href: "/login",
    featured: true,
    features: [
      "Everything in Starter",
      "Email, SMS and push",
      "Priority queues",
      "Retries with exponential backoff",
      "Per-message provider traces",
      "Self-hosted deployment",
    ],
  },
  {
    name: "Enterprise",
    description: "For high-volume or self-hosted operations.",
    monthly: null,
    annual: null,
    volume: "Custom volume",
    cta: "Read the API docs",
    href: "/api/docs/",
    features: [
      "Everything in Scale",
      "Self-hosted deployment",
      "Environment-managed providers",
      "Configurable retention",
      "Operator console and API access",
    ],
  },
];

const included = [
  ["One API", "Email, SMS and push behind the same request shape."],
  [
    "Retries included",
    "A retry stays on the same send record; it is not a new accepted send.",
  ],
  [
    "Per-message traces",
    "Every accepted send keeps its latest provider response or error and attempt count.",
  ],
  [
    "No channel premium",
    "The illustrative pricing model is based on accepted sends, not destination.",
  ],
];

const faqs = [
  {
    question: "What counts as a send?",
    answer:
      "A send is counted when the API accepts a valid request and puts it on the queue. Retries and failed provider attempts do not create another accepted send.",
  },
  {
    question: "What happens when I pass the included volume?",
    answer:
      "The illustrative estimate adds $0.06 per 1,000 additional accepted sends. This deployment does not include billing, enforce a hard cap or generate invoices; final terms would be agreed in a contract.",
  },
  {
    question: "Can I bring my own provider?",
    answer:
      "This deployment reads SMTP, Twilio and FCM credentials from operator-managed environment variables. Per-tenant provider attachment is not implemented.",
  },
  {
    question: "Is there a free sandbox?",
    answer:
      "There is no billing or metering in this deployment. Sending is limited by the configured API rate limits and by the provider credentials you supply.",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [volume, setVolume] = useState(5_000_000);

  const includedVolume = 2_000_000;
  const isStarter = volume <= 10_000;
  const base = isStarter ? 0 : billing === "annual" ? 399 : 499;
  const overage = isStarter ? 0 : Math.max(0, volume - includedVolume);
  const overageCost = Math.round((overage / 1_000) * 0.06);
  const estimate = base + overageCost;
  const breakdown: [string, string][] = [
    ["Base plan", money.format(base)],
    ["Included volume", isStarter ? "10,000" : "2,000,000"],
    ["Additional sends", overage > 0 ? fmtCompact(overage) : "None"],
    ["Overage", overageCost > 0 ? money.format(overageCost) : "None"],
    ["Retries", "Included"],
  ];
  const sliderPercent = ((volume - 10_000) / (20_000_000 - 10_000)) * 100;

  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-line">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow">Pricing</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
                <span className="dot bg-warn" />
                Illustrative plans
              </div>
              <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
                Pay for what you send.
              </h1>
              <p className="mt-6 max-w-[50ch] text-[16px] leading-relaxed text-muted">
                The proposed model has no per-channel premiums and no charge for
                retries. This deployment has no billing integration, so every
                price and estimate below is illustrative.
              </p>
            </div>

            <div className="lg:col-span-5 lg:pt-8">
              <div className="border-t border-line pt-5">
                <p className="label">All plans include</p>
                <ul className="mt-4 space-y-3">
                  {[
                    "A single API for email, SMS and push",
                    "Idempotency and automatic retries",
                    "A trace for every accepted send",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13px] text-muted"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Choose a plan
                </h2>
                <p className="mt-2 text-[13px] text-muted">
                  Plans are illustrative; no checkout or billing is connected.
                </p>
              </div>

              <div className="inline-flex self-start rounded-lg border border-line bg-surface p-0.5 sm:self-auto">
                {(["monthly", "annual"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={billing === option}
                    onClick={() => setBilling(option)}
                    className={cn(
                      "h-9 rounded-md px-3.5 text-[12px] font-medium capitalize transition-colors",
                      billing === option
                        ? "bg-ink text-white"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {option}
                    {option === "annual" && (
                      <span
                        className={cn(
                          "ml-1.5 font-mono text-[9px]",
                          billing === option
                            ? "text-white/60"
                            : "text-accent-ink",
                        )}
                      >
                        −20%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-warn/25 bg-warn/[0.04] px-4 py-3 text-[11px] leading-relaxed text-muted">
              These are illustrative plans, not an offer. This deployment does
              not include billing, metering or a checkout flow.
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {tiers.map((tier) => {
                const price =
                  tier.monthly === null
                    ? null
                    : billing === "annual"
                      ? tier.annual
                      : tier.monthly;
                return (
                  <div
                    key={tier.name}
                    className={cn(
                      "relative flex flex-col rounded-2xl border p-6 sm:p-7",
                      tier.featured
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-surface",
                    )}
                  >
                    {tier.featured && (
                      <span className="absolute -top-2.5 left-6 rounded-full border border-accent-ink bg-accent-ink px-2.5 py-0.5 font-mono text-[9px] tracking-[0.08em] text-white uppercase">
                        Recommended
                      </span>
                    )}

                    <div className="flex items-baseline justify-between gap-3">
                      <h3
                        className={cn(
                          "font-display text-xl font-semibold tracking-[-0.03em]",
                          tier.featured ? "text-white" : "text-ink",
                        )}
                      >
                        {tier.name}
                      </h3>
                      <span
                        className={cn(
                          "font-mono text-[9px] tracking-[0.08em] uppercase",
                          tier.featured ? "text-white/60" : "text-faint",
                        )}
                      >
                        {tier.volume}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "mt-2 min-h-10 max-w-[32ch] text-[12px] leading-relaxed",
                        tier.featured ? "text-white/70" : "text-muted",
                      )}
                    >
                      {tier.description}
                    </p>

                    <div className="mt-7 flex items-end gap-1.5">
                      {price === null ? (
                        <span className="font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em]">
                          Custom
                        </span>
                      ) : (
                        <>
                          <span className="font-display text-[2.8rem] leading-none font-semibold tracking-[-0.055em]">
                            {money.format(price)}
                          </span>
                          <span
                            className={cn(
                              "pb-1 text-[11px]",
                              tier.featured ? "text-white/65" : "text-faint",
                            )}
                          >
                            / month
                          </span>
                        </>
                      )}
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-[10px]",
                        tier.featured ? "text-white/55" : "text-faint",
                      )}
                    >
                      {price === null
                        ? "Illustrative · volume based"
                        : price === 0
                          ? "Illustrative free tier · no billing connected"
                          : billing === "annual"
                            ? "Illustrative monthly rate with annual billing · no invoice generated"
                            : "Illustrative monthly rate · no invoice generated"}
                    </p>

                    <Link
                      href={tier.href}
                      className={cn(
                        "btn mt-6 w-full",
                        tier.featured
                          ? "bg-white text-ink hover:bg-white/90"
                          : "btn-secondary",
                      )}
                    >
                      {tier.cta}
                      <ArrowRight className="size-3.5" />
                    </Link>

                    <ul
                      className={cn(
                        "mt-7 space-y-2.5 border-t pt-6",
                        tier.featured ? "border-white/10" : "border-line",
                      )}
                    >
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className={cn(
                            "flex items-start gap-2.5 text-[12px] leading-relaxed",
                            tier.featured ? "text-white/75" : "text-muted",
                          )}
                        >
                          <Check
                            className={cn(
                              "mt-0.5 size-3.5 shrink-0",
                              tier.featured ? "text-accent" : "text-accent",
                            )}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Volume calculator */}
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="eyebrow">Estimate</p>
                <h2 className="mt-4 max-w-[12ch] font-display text-3xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-4xl">
                  Price at your volume.
                </h2>
                <p className="mt-4 max-w-[42ch] text-[13px] leading-relaxed text-muted">
                  Move the slider to see the illustrative Scale pricing at your
                  monthly accepted-send volume. Retries stay on the same record.
                </p>
                <div className="mt-8 flex items-center gap-2 font-mono text-[10px] text-faint">
                  <Gauge className="size-3.5" />
                  Estimate based on accepted sends
                </div>
              </div>

              <div className="panel p-5 sm:p-7 lg:col-span-7">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="label">Monthly volume</p>
                    <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">
                      {fmtCompact(volume)}
                      <span className="ml-1 text-[13px] font-medium tracking-normal text-faint">
                        sends
                      </span>
                    </p>
                  </div>
                  <p className="font-mono text-[10px] text-faint">
                    {billing === "annual"
                      ? "Annual billing · monthly estimate"
                      : "Monthly estimate"}
                  </p>
                </div>

                <input
                  type="range"
                  min={10_000}
                  max={20_000_000}
                  step={10_000}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  aria-label="Monthly send volume"
                  className="range mt-6"
                  style={{
                    background: `linear-gradient(to right, var(--color-ink) ${sliderPercent}%, var(--color-line) ${sliderPercent}%)`,
                  }}
                />
                <div className="mt-2 flex justify-between font-mono text-[9px] text-faint">
                  <span>10K</span>
                  <span>20M</span>
                </div>

                <div className="mt-7 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                  <div>
                    <p className="label">Estimated monthly</p>
                    <p className="mt-2 font-display text-[2.6rem] leading-none font-semibold tracking-[-0.05em]">
                      {money.format(estimate)}
                    </p>
                    <p className="mt-2 text-[11px] text-muted">
                      {billing === "annual"
                        ? "Illustrative monthly rate with annual billing. No invoice is generated."
                        : "Illustrative monthly rate. No invoice is generated."}
                    </p>
                    <p className="mt-1 text-[10px] text-faint">
                      Illustrative Starter cap: 10,000 sends.
                    </p>
                  </div>
                  <div className="space-y-2.5 sm:border-l sm:border-line sm:pl-6">
                    {breakdown.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 text-[11px]"
                      >
                        <span className="text-muted">{label}</span>
                        <span className="font-mono text-ink">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[38ch] text-[10px] leading-relaxed text-faint">
                    Estimate only. This deployment generates no quote, invoice
                    or contract; rate limits are the real constraint.
                  </p>
                  <a
                    href={DOCS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm shrink-0"
                  >
                    Read API limits
                    <ArrowUpRight className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Included */}
        <section className="border-b border-line bg-surface/45">
          <div className="mx-auto grid w-full max-w-[1280px] divide-y divide-line px-5 sm:px-8 md:grid-cols-4 md:divide-x md:divide-y-0">
            {included.map(([title, copy]) => (
              <div
                key={title}
                className="py-6 md:px-6 md:py-7 md:first:pl-0 md:last:pr-0"
              >
                <div className="flex items-center gap-2">
                  <Check className="size-3.5 text-accent" />
                  <p className="text-[12px] font-medium">{title}</p>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-line">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow">Questions</p>
              <h2 className="mt-4 max-w-[10ch] font-display text-3xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-4xl">
                Before you choose.
              </h2>
              <p className="mt-4 max-w-[34ch] text-[13px] leading-relaxed text-muted">
                A few things worth knowing before you evaluate the plans.
              </p>
            </div>

            <div className="divide-y divide-line border-t border-line lg:col-span-8">
              {faqs.map((faq) => (
                <details key={faq.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5">
                    <span className="text-[13px] font-medium">
                      {faq.question}
                    </span>
                    <ChevronDown className="size-4 shrink-0 text-faint transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="max-w-[64ch] pb-5 text-[12px] leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="ink-panel relative overflow-hidden px-6 py-12 sm:px-12 sm:py-14">
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.12em] text-white/60 uppercase">
                  Actual limits
                </p>
                <h2 className="mt-3 max-w-[18ch] font-display text-3xl leading-[0.98] font-semibold tracking-[-0.045em] text-white sm:text-4xl">
                  No billing. No hard cap.
                </h2>
                <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-white/70">
                  This repository has no checkout, metering or quota system. API
                  rate limits and your provider quotas are the real constraints.
                </p>
              </div>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noreferrer"
                className="btn h-11 shrink-0 bg-white px-5 text-ink hover:bg-white/90"
              >
                Read API limits
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
