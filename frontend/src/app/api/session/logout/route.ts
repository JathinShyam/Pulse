import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";

function clearOptions(request: NextRequest) {
  const forwarded = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: forwarded === "https" || request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 0,
  };
}

export async function POST(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(ACCESS_COOKIE, "", clearOptions(request));
  response.cookies.set(REFRESH_COOKIE, "", clearOptions(request));
  return response;
}
