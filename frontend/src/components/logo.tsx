import Link from "next/link";
import { cn } from "@/lib/utils";

export function PulseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      <path
        d="M1.75 12h4.1l2.15-5.7 3.9 11.4 2.3-6.3 1.55 1.35h6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  href = "/",
  inverted = false,
  className,
}: {
  href?: string;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Pulse home"
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-70",
        className,
      )}
    >
      <PulseMark
        className={cn("size-[22px]", inverted ? "text-white" : "text-accent")}
      />
      <span
        className={cn(
          "font-display text-[19px] leading-none font-semibold tracking-[-0.035em]",
          inverted ? "text-white" : "text-ink",
        )}
      >
        Pulse
      </span>
    </Link>
  );
}
