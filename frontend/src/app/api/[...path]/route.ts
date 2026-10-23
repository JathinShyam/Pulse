import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from "@/lib/session";

const BACKEND_URL = (
  process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

interface TokenPair {
  access?: string;
  refresh?: string;
}

function forwardedProto(request: NextRequest): string {
  const forwarded = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  return forwarded || request.nextUrl.protocol.replace(":", "");
}

function isSecureRequest(request: NextRequest): boolean {
  return forwardedProto(request) === "https";
}

function cookieOptions(request: NextRequest, maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecureRequest(request),
    path: "/",
    maxAge,
  };
}

function setSessionCookies(
  response: NextResponse,
  request: NextRequest,
  tokens: TokenPair,
): void {
  if (tokens.access) {
    response.cookies.set(
      ACCESS_COOKIE,
      tokens.access,
      cookieOptions(request, ACCESS_MAX_AGE),
    );
  }
  if (tokens.refresh) {
    response.cookies.set(
      REFRESH_COOKIE,
      tokens.refresh,
      cookieOptions(request, REFRESH_MAX_AGE),
    );
  }
}

function clearSessionCookies(
  response: NextResponse,
  request: NextRequest,
): void {
  response.cookies.set(ACCESS_COOKIE, "", cookieOptions(request, 0));
  response.cookies.set(REFRESH_COOKIE, "", cookieOptions(request, 0));
}

function backendPath(pathname: string): string | null {
  const raw = pathname.replace(/^\/api\/?/, "");
  // Reject encoded separators/dot segments so the proxy cannot escape /api/.
  if (
    !raw ||
    raw.includes("%") ||
    raw.includes("\\") ||
    raw.split("/").some((segment) => segment === "." || segment === "..")
  ) {
    return null;
  }
  // Django expects a trailing slash on every API route except /api/metrics.
  return !raw.endsWith("/") && raw !== "metrics" ? `${raw}/` : raw;
}

async function refreshSession(request: NextRequest): Promise<TokenPair | null> {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;
  try {
    const proto = forwardedProto(request);
    const response = await fetch(`${BACKEND_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // The Django service may force HTTPS in production even though this
        // internal hop is plain HTTP; mirror the browser-facing protocol.
        "x-forwarded-proto": proto,
      },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as TokenPair;
    return data.access ? data : null;
  } catch {
    return null;
  }
}

async function proxy(request: NextRequest) {
  const rawPath = backendPath(request.nextUrl.pathname);
  if (!rawPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const targetUrl = `${BACKEND_URL}/api/${rawPath}${request.nextUrl.search}`;
  const incomingAuth =
    request.headers.has("authorization") || request.headers.has("x-api-key");
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (
      ![
        "host",
        "cookie",
        "content-length",
        "connection",
        "content-encoding",
        "transfer-encoding",
      ].includes(key.toLowerCase())
    ) {
      headers.set(key, value);
    }
  });
  headers.set("x-forwarded-proto", forwardedProto(request));
  const host = request.headers.get("host");
  if (host) headers.set("x-forwarded-host", host);

  // The proxy forwards the caller's own credential. It never injects a shared
  // API key: browser sessions are JWTs held in httpOnly cookies.
  if (
    !incomingAuth &&
    rawPath !== "auth/login/" &&
    rawPath !== "auth/refresh/"
  ) {
    if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  }

  const method = request.method;
  let body: BodyInit | null = null;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    console.error(`[API Proxy Error] ${method} ${targetUrl}:`, error);
    return NextResponse.json(
      { error: "Pulse backend unavailable" },
      { status: 502 },
    );
  }

  let refreshed: TokenPair | null = null;
  if (
    upstream.status === 401 &&
    !incomingAuth &&
    rawPath !== "auth/login/" &&
    rawPath !== "auth/refresh/"
  ) {
    refreshed = await refreshSession(request);
    if (refreshed?.access) {
      headers.set("authorization", `Bearer ${refreshed.access}`);
      try {
        upstream = await fetch(targetUrl, {
          method,
          headers,
          body,
          cache: "no-store",
          redirect: "manual",
        });
      } catch (error) {
        console.error(`[API Proxy Error] ${method} ${targetUrl}:`, error);
        return NextResponse.json(
          { error: "Pulse backend unavailable" },
          { status: 502 },
        );
      }
    }
  }

  // Login/refresh responses contain tokens. Move them into httpOnly cookies
  // and return only a success flag so browser JavaScript cannot read them.
  if (rawPath === "auth/login/" || rawPath === "auth/refresh/") {
    if (upstream.ok) {
      try {
        const tokens = (await upstream.json()) as TokenPair;
        const response = NextResponse.json(
          { ok: true },
          { status: upstream.status },
        );
        setSessionCookies(response, request, tokens);
        return response;
      } catch {
        return NextResponse.json(
          { error: "Invalid authentication response" },
          { status: 502 },
        );
      }
    }
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (
      ![
        "set-cookie",
        "content-length",
        "content-encoding",
        "transfer-encoding",
        "connection",
      ].includes(key.toLowerCase())
    ) {
      responseHeaders.set(key, value);
    }
  });
  responseHeaders.set("cache-control", "no-store");

  const data = await upstream.arrayBuffer();
  const response = new NextResponse(data, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });

  if (refreshed) {
    setSessionCookies(response, request, refreshed);
  } else if (upstream.status === 401 && !incomingAuth) {
    clearSessionCookies(response, request);
  }

  return response;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
