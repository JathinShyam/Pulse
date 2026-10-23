"use client";

import axios, { AxiosError } from "axios";

/**
 * All requests go to same-origin `/api/*`; the Next.js route handler proxies
 * them to Django (see src/app/api/[...path]/route.ts). The browser never holds
 * an API key or JWT: the proxy reads the httpOnly session cookie, forwards the
 * JWT as a Bearer token, and refreshes it once if Django returns 401.
 */
export const api = axios.create({ baseURL: "/api", timeout: 15_000 });

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      const next = encodeURIComponent(
        `${window.location.pathname}${window.location.search}`,
      );
      // This interceptor runs outside React, so a router is not available.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/login?next=${next}`);
    }
    return Promise.reject(error);
  },
);

/** Turn DRF / axios errors into one human-readable line. */
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as unknown;
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      if (typeof obj.error === "string") return obj.error;
      if (typeof obj.detail === "string") return obj.detail;
      const first = Object.entries(obj)[0];
      if (first) {
        const [field, value] = first;
        const msg = Array.isArray(value) ? value[0] : value;
        if (typeof msg === "string")
          return field === "non_field_errors" ? msg : `${field}: ${msg}`;
      }
    }
    if (err.code === "ECONNABORTED") return "Request timed out.";
    if (!err.response) return "Can't reach the Pulse API.";
    return `Request failed (${err.response.status}).`;
  }
  return err instanceof Error ? err.message : "Something went wrong.";
}

/** HTTP status from an axios error, when one exists. */
export function errorStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined;
}

/** Clear the httpOnly session cookies, then send the browser to login. */
export async function endSession(): Promise<void> {
  try {
    await fetch("/api/session/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } finally {
    // The session cookies are already cleared; a full document load ensures
    // the proxy guard sees the new cookie state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  }
}
