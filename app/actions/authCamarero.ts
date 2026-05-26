"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type StaffAuthState = { error?: string } | null;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

/* ── loginCamarero ───────────────────────────────────────────── */
export async function loginCamarero(
  _prevState: StaffAuthState,
  formData: FormData,
): Promise<StaffAuthState> {
  const username = (formData.get("username") as string).trim();
  const password = (formData.get("password") as string).trim();

  let role: "camarero" | "cocina" | null = null;

  if (username === process.env.CAMARERO_USER && password === process.env.CAMARERO_PASS) {
    role = "camarero";
  } else if (username === process.env.COCINA_USER && password === process.env.COCINA_PASS) {
    role = "cocina";
  }

  if (!role) {
    return { error: "Credenciales incorrectas. Inténtalo de nuevo." };
  }

  const token = await new SignJWT({ sub: username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set("staff_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 h
  });

  redirect(role === "camarero" ? "/camareros" : "/cocina");
}

/* ── logoutStaff ─────────────────────────────────────────────── */
export async function logoutStaff() {
  const cookieStore = await cookies();
  cookieStore.delete("staff_session");
  redirect("/camareros/login");
}
