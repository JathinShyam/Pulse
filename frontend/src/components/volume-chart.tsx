"use client";

import { useMemo, useState } from "react";
import type { SeriesPoint } from "@/lib/types";
import { fmtCompact } from "@/lib/format";
import { CHANNELS } from "@/lib/channels";

const WIDTH = 800;
const HEIGHT = 236;

function linePath(
  series: SeriesPoint[],
  pick: (point: SeriesPoint) => number,
  max: number,
) {
  return series
    .map((point, index) => {
      const x = (index / Math.max(series.length - 1, 1)) * WIDTH;
      const y = HEIGHT - (pick(point) / max) * (HEIGHT - 12) - 6;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function timeLabel(bucket: string) {
  const date = new Date(bucket);
  return `${String(date.getUTCHours()).padStart(2, "0")}:00`;
}

export function VolumeChart({ series }: { series: SeriesPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const max = useMemo(
    () => Math.max(...series.map((point) => point.total), 1),
    [series],
  );

  const paths = useMemo(
    () => ({
      total: linePath(series, (point) => point.total, max),
      push: linePath(series, (point) => point.push, max),
      email: linePath(series, (point) => point.email, max),
      sms: linePath(series, (point) => point.sms, max),
      area: `${linePath(
        series,
        (point) => point.total,
        max,
      )} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`,
    }),
    [series, max],
  );

  if (!series.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-line text-sm text-faint">
        No volume in this window.
      </div>
    );
  }

  const active = hover === null ? null : series[hover];

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {(["push", "email", "sms"] as const).map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-[11px] text-muted"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: CHANNELS[key].color }}
              />
              {CHANNELS[key].label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span className="size-1.5 rounded-full bg-ink/35" />
            Total
          </span>
        </div>
        <span className="font-mono text-[10px] text-faint">UTC</span>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full sm:h-64"
          preserveAspectRatio="none"
          role="img"
          aria-label="Notification volume by channel"
        >
          <defs>
            <linearGradient id="volume-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-ink)"
                stopOpacity="0.06"
              />
              <stop
                offset="100%"
                stopColor="var(--color-ink)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              x2={WIDTH}
              y1={HEIGHT * fraction}
              y2={HEIGHT * fraction}
              stroke="var(--color-line)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}

          <path d={paths.area} fill="url(#volume-fill)" />
          <line
            x1="0"
            x2={WIDTH}
            y1={HEIGHT}
            y2={HEIGHT}
            stroke="var(--color-line)"
            strokeWidth="1"
          />
          <path
            d={paths.email}
            fill="none"
            stroke={CHANNELS.email.color}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <path
            d={paths.sms}
            fill="none"
            stroke={CHANNELS.sms.color}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <path
            d={paths.push}
            fill="none"
            stroke={CHANNELS.push.color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={paths.total}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />

          {hover !== null && active && (
            <>
              <line
                x1={(hover / Math.max(series.length - 1, 1)) * WIDTH}
                x2={(hover / Math.max(series.length - 1, 1)) * WIDTH}
                y1="0"
                y2={HEIGHT}
                stroke="var(--color-line-strong)"
                strokeWidth="1"
              />
              <circle
                cx={(hover / Math.max(series.length - 1, 1)) * WIDTH}
                cy={HEIGHT - (active.total / max) * (HEIGHT - 12) - 6}
                r="3.5"
                fill="var(--color-accent)"
                stroke="var(--color-surface)"
                strokeWidth="2"
              />
            </>
          )}

          {series.map((point, index) => (
            <rect
              key={point.bucket}
              x={(index / Math.max(series.length, 1)) * WIDTH}
              y="0"
              width={WIDTH / Math.max(series.length, 1)}
              height={HEIGHT}
              fill="transparent"
              onPointerEnter={() => setHover(index)}
              onPointerLeave={() => setHover(null)}
            />
          ))}
        </svg>

        {active && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 min-w-36 -translate-x-1/2 rounded-lg border border-line bg-surface p-3 shadow-[0_12px_30px_-16px_rgba(23,24,22,0.35)]"
            style={{
              left: `${Math.min(
                88,
                Math.max(12, (hover / Math.max(series.length - 1, 1)) * 100),
              )}%`,
            }}
          >
            <p className="font-mono text-[10px] text-faint">
              {timeLabel(active.bucket)} UTC
            </p>
            <div className="mt-2 space-y-1.5">
              {(
                [
                  ["Total", active.total, "var(--color-ink)"],
                  ["Push", active.push, CHANNELS.push.color],
                  ["Email", active.email, CHANNELS.email.color],
                  ["SMS", active.sms, CHANNELS.sms.color],
                ] as const
              ).map(([label, value, color]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-6 text-[11px]"
                >
                  <span className="flex items-center gap-1.5 text-muted">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: color }}
                    />
                    {label}
                  </span>
                  <span className="font-mono text-ink">
                    {fmtCompact(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-1 flex justify-between font-mono text-[9px] text-faint">
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const index = Math.round((series.length - 1) * fraction);
            return (
              <span key={fraction}>{timeLabel(series[index].bucket)}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
