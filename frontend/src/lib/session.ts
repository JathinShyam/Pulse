export const ACCESS_COOKIE = "pulse_access";
export const REFRESH_COOKIE = "pulse_refresh";

export const ACCESS_MAX_AGE = 60 * 60;
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/composer",
  "/logs",
  "/gateways",
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Only allow same-origin, absolute-path redirects after login. */
export function safeNextPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  // Login must not redirect back to itself, and API responses are not pages.
  const path = value.split(/[?#]/, 1)[0];
  if (path === "/login" || path.startsWith("/login/")) {
    return fallback;
  }
  if (path === "/api" || path.startsWith("/api/")) {
    return fallback;
  }
  return value;
}
