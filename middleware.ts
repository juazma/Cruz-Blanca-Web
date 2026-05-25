import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Allow the login page through unconditionally */
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value;

  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next(); // valid token → pass through
    } catch {
      /* token present but invalid / expired → redirect */
    }
  }

  /* No token or invalid → redirect to login */
  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
