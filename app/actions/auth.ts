"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/* ── Types ──────────────────────────────────────────────────── */
export type AuthState = {
  error?: string;
} | null;

/* ── Helpers ────────────────────────────────────────────────── */
function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

/* ── login ──────────────────────────────────────────────────── */
export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASS;

  if (!username || !password || username !== validUser || password !== validPass) {
    return { error: "Credenciales incorrectas. Inténtalo de nuevo." };
  }

  /* Build a JWT valid for 8 hours */
  const token = await new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 h in seconds
  });

  redirect("/admin");
}

/* ── logout ─────────────────────────────────────────────────── */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
