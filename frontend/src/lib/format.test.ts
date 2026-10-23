import { describe, expect, it } from "vitest";

import { fmtClock, fmtDateTime, fmtMs, renderPreview, splitMs } from "./format";

describe("time formatting", () => {
  it("renders clocks in UTC regardless of the host timezone", () => {
    expect(fmtClock("2026-10-22T18:04:12.891Z")).toBe("18:04:12.891");
    expect(fmtClock("2026-10-22T18:04:12.891Z", false)).toBe("18:04:12");
    expect(fmtDateTime("2026-10-22T18:04:12.891Z")).toBe("22 Oct, 18:04:12");
  });

  it("does not crash on missing timestamps", () => {
    expect(fmtClock(null)).toBe("—");
    expect(fmtDateTime(undefined)).toBe("—");
  });
});

describe("latency formatting", () => {
  it("formats milliseconds and seconds", () => {
    expect(fmtMs(38)).toBe("38ms");
    expect(fmtMs(1840)).toBe("1.84s");
    expect(fmtMs(120_000)).toBe("2.0m");
    expect(fmtMs(null)).toBe("—");
  });

  it("splits values for the large stat display", () => {
    expect(splitMs(38)).toEqual(["38", "ms"]);
    expect(splitMs(1840)).toEqual(["1.84", "s"]);
    expect(splitMs(null)).toEqual(["—", ""]);
  });
});

describe("preview rendering", () => {
  it("substitutes simple context keys and preserves escaped braces", () => {
    expect(renderPreview("Hello {name}, {{literal}}!", { name: "Ada" })).toBe(
      "Hello Ada, {literal}!",
    );
  });

  it("leaves unknown or advanced placeholders visible", () => {
    expect(
      renderPreview("Code {code}, total {amount:.2f}", { code: "42" }),
    ).toBe("Code 42, total {amount:.2f}");
  });
});
