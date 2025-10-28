// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register", "/api/auth/refresh"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths and static assets
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Read cookie and extract access_token
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(cookieHeader.split(";").map(s => {
    const [k, ...v] = s.split("=");
    return [k?.trim(), decodeURIComponent(v?.join("="))];
  }));
  const access = cookies["access_token"];
  if (!access) {
    // Redirect to login page
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    verifyAccessToken(access);
    return NextResponse.next();
  } catch (err) {
    // token invalid or expired -> redirect to login (client can call refresh flow if you implement it)
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/api/content/dashboard"]
};