"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/app/actions/auth";
import styles from "./login.module.css";

const initialState: AuthState = null;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <main className={styles.main}>
      <div className={styles.card}>

        {/* ── Logo / heading ──────────────────────────────── */}
        <div className={styles.header}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Cruz Blanca"
            className={styles.logo}
          />
          <p className={styles.subtitle}>Acceso al gestor interno</p>
        </div>

        {/* ── Form ────────────────────────────────────────── */}
        <form action={formAction} className={styles.form} noValidate>

          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              required
              className={styles.input}
              placeholder="admin"
              disabled={isPending}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
              placeholder="••••••••••"
              disabled={isPending}
            />
          </div>

          {/* Error message */}
          {state?.error && (
            <p className={styles.error} role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submit}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Verificando…" : "Entrar"}
          </button>

        </form>

        <p className={styles.footer}>
          Cruz Blanca · Lucena, Córdoba
        </p>

      </div>
    </main>
  );
}
