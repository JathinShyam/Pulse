import { describe, expect, it } from "vitest";

import {
  ACCESS_MAX_AGE,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  isProtectedPath,
  safeNextPath,
} from "./session";

describe("session constants", () => {
  it("keeps access and refresh cookies distinct", () => {
    expect(ACCESS_COOKIE).not.toBe(REFRESH_COOKIE);
    expect(ACCESS_MAX_AGE).toBeLessThan(REFRESH_MAX_AGE);
  });
});

describe("isProtectedPath", () => {
  it.each([
    "/dashboard",
    "/dashboard/",
    "/composer",
    "/logs",
    "/gateways",
    "/gateways/",
  ])("guards %s", (path) => {
    expect(isProtectedPath(path)).toBe(true);
  });

  it.each(["/", "/login", "/pricing", "/dashboard-preview", "/api/docs"])(
    "leaves %s public",
    (path) => {
      expect(isProtectedPath(path)).toBe(false);
    },
  );
});

describe("safeNextPath", () => {
  it("accepts same-origin absolute paths", () => {
    expect(safeNextPath("/logs?q=abc")).toBe("/logs?q=abc");
    expect(safeNextPath("/dashboard")).toBe("/dashboard");
  });

  it("rejects protocol-relative and absolute redirects", () => {
    expect(safeNextPath("//evil.example")).toBe("/dashboard");
    expect(safeNextPath("https://evil.example")).toBe("/dashboard");
    expect(safeNextPath("javascript:alert(1)")).toBe("/dashboard");
    expect(safeNextPath("/\\evil.example")).toBe("/dashboard");
    expect(safeNextPath("/logs\r\nLocation: https://evil.example")).toBe(
      "/dashboard",
    );
    expect(safeNextPath("/logs\u0000")).toBe("/dashboard");
  });

  it("rejects the login page and API routes", () => {
    expect(safeNextPath("/login")).toBe("/dashboard");
    expect(safeNextPath("/login?next=/dashboard")).toBe("/dashboard");
    expect(safeNextPath("/login/")).toBe("/dashboard");
    expect(safeNextPath("/api")).toBe("/dashboard");
    expect(safeNextPath("/api/notifications/list")).toBe("/dashboard");
    expect(safeNextPath("/api?window=24h")).toBe("/dashboard");
  });

  it("uses the fallback for empty values", () => {
    expect(safeNextPath(null)).toBe("/dashboard");
    expect(safeNextPath(undefined, "/logs")).toBe("/logs");
    expect(safeNextPath("/login", "/logs")).toBe("/logs");
  });
});
