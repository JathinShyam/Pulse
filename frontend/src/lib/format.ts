const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const full = new Intl.NumberFormat("en-US");

/** 1234 -> "1.2K" */
export const fmtCompact = (n: number | null | undefined) =>
  n == null ? "—" : compact.format(n);

/** 1234 -> "1,234" */
export const fmtInt = (n: number | null | undefined) =>
  n == null ? "—" : full.format(Math.round(n));

/** 99.123 -> "99.12" */
export const fmtPct = (n: number | null | undefined, digits = 2) =>
  n == null ? "—" : n.toFixed(digits);

/** 1840 -> "1.84s", 38 -> "38ms" */
export function fmtMs(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms >= 60_000) return `${(ms / 60_000).toFixed(1)}m`;
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

/** Split a value into number + unit for the large stat style (e.g. "38" + "ms"). */
export function splitMs(ms: number | null | undefined): [string, string] {
  if (ms == null) return ["—", ""];
  if (ms >= 60_000) return [(ms / 60_000).toFixed(1), "m"];
  if (ms >= 1000) return [(ms / 1000).toFixed(2), "s"];
  return [String(Math.round(ms)), "ms"];
}

export function splitCompact(n: number | null | undefined): [string, string] {
  if (n == null) return ["—", ""];
  const s = compact.format(n);
  const m = s.match(/^([\d.,]+)(\D*)$/);
  return m ? [m[1], m[2]] : [s, ""];
}

/** "18:04:12.891" */
export function fmtClock(iso: string | null | undefined, ms = true): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const t = d.toLocaleTimeString("en-GB", { hour12: false });
  return ms ? `${t}.${String(d.getMilliseconds()).padStart(3, "0")}` : t;
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/** Latency between created and sent, in ms. */
export function deliveryMs(
  created: string,
  sent: string | null,
): number | null {
  if (!sent) return null;
  return new Date(sent).getTime() - new Date(created).getTime();
}

/** "#7f9a2e…c419" style short id. */
export function shortId(id: string, head = 6, tail = 4): string {
  const clean = id.replace(/-/g, "");
  return clean.length <= head + tail
    ? clean
    : `${clean.slice(0, head)}…${clean.slice(-tail)}`;
}

/** Mask an address for display: "al***@corp.com", "+1415•••0123". */
export function maskRecipient(to: string): string {
  if (to.includes("@")) {
    const [user, domain] = to.split("@");
    return `${user.slice(0, 2)}${"•".repeat(
      Math.max(1, Math.min(4, user.length - 2)),
    )}@${domain}`;
  }
  if (to.startsWith("+") && to.length > 8)
    return `${to.slice(0, 5)}•••${to.slice(-4)}`;
  return to.length > 14 ? `${to.slice(0, 6)}…${to.slice(-4)}` : to;
}
