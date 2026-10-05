"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const ACCESS = "pulse.access";
const REFRESH = "pulse.refresh";

export const tokens = {
  get access() {
    return typeof window === "undefined" ? null : localStorage.getItem(ACCESS);
  },
  get refresh() {
    return typeof window === "undefined" ? null : localStorage.getItem(REFRESH);
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS, access);
    if (refresh) localStorage.setItem(REFRESH, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

/**
 * All requests go to same-origin `/api/*`; Next.js proxies them to Django
 * (see src/app/api/[...path]/route.ts), so there is no CORS to configure.
 */
export const api = axios.create({ baseURL: "/api", timeout: 15_000 });

api.interceptors.request.use((config) => {
  const access = tokens.access;
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccess(): Promise<string | null> {
  const refresh = tokens.refresh;
  if (!refresh) return null;
  try {
    const { data } = await axios.post<{ access: string; refresh?: string }>(
      "/api/auth/refresh/",
      { refresh },
    );
    tokens.set(data.access, data.refresh);
    return data.access;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshing ??= refreshAccess().finally(() => {
        refreshing = null;
      });
      const access = await refreshing;
      if (access) {
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      }
      tokens.clear();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        const next = encodeURIComponent(window.location.pathname);
        window.location.assign(`/login?next=${next}`);
      }
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
