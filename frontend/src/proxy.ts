import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  isProtectedPath,
  safeNextPath,
} from "@/lib/session";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession =
    request.cookies.has(ACCESS_COOKIE) || request.cookies.has(REFRESH_COOKIE);

  if (isProtectedPath(pathname) && !hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (pathname === "/login" && request.cookies.has(ACCESS_COOKIE)) {
    return NextResponse.redirect(
      new URL(
        safeNextPath(request.nextUrl.searchParams.get("next")),
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/composer/:path*",
    "/logs/:path*",
    "/gateways/:path*",
    "/login",
  ],
};
