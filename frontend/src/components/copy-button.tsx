"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void copy();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[10px] tracking-[0.04em] transition-colors",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3 text-ok" />
      ) : (
        <Copy className="size-3" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}
