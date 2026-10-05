import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
const DEFAULT_API_KEY = process.env.PULSE_API_KEY || "my-real-secret-api-key";

async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let rawPath = pathname.replace(/^\/api\/?/, "");

  // Django expects trailing slash for all notifications and auth routes, except /api/metrics
  if (!rawPath.endsWith("/") && rawPath !== "metrics") {
    rawPath += "/";
  }

  const searchParams = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/api/${rawPath}${searchParams}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!["host", "content-length"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  if (!headers.has("authorization") && !headers.has("x-api-key")) {
    headers.set("X-API-Key", DEFAULT_API_KEY);
  }

  const method = request.method;
  let body: BodyInit | null = null;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    const data = await response.arrayBuffer();
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[API Proxy Error] ${method} ${targetUrl}:`, error);
    return NextResponse.json(
      {
        error: "Pulse backend unavailable or connection refused",
        detail: String(error),
      },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
