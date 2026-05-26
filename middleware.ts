import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

async function verifyJwt(token: string): Promise<{ role?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ── Public login pages ──────────────────────────────────────── */
  if (
    pathname === "/admin/login" ||
    pathname === "/camareros/login" ||
    pathname === "/cocina/login"
  ) {
    return NextResponse.next();
  }

  /* ── /admin/* ────────────────────────────────────────────────── */
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value;
    if (token) {
      const payload = await verifyJwt(token);
      if (payload?.role === "admin") return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  /* ── /camareros/* ────────────────────────────────────────────── */
  if (pathname.startsWith("/camareros")) {
    const token = request.cookies.get("staff_session")?.value;
    if (token) {
      const payload = await verifyJwt(token);
      if (payload?.role === "camarero") return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/camareros/login", request.url));
  }

  /* ── /cocina/* ───────────────────────────────────────────────── */
  if (pathname.startsWith("/cocina")) {
    const token = request.cookies.get("staff_session")?.value;
    if (token) {
      const payload = await verifyJwt(token);
      if (payload?.role === "cocina") return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/camareros/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/camareros/:path*", "/cocina/:path*"],
};
