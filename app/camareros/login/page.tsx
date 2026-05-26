"use client";

import { useActionState, useTransition } from "react";
import { loginCamarero, type StaffAuthState } from "@/app/actions/authCamarero";
import styles from "./login.module.css";

export default function StaffLoginPage() {
  const [state, formAction] = useActionState<StaffAuthState, FormData>(
    loginCamarero,
    null,
  );
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  }

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
          <p className={styles.subtitle}>Acceso de personal</p>
        </div>

        {/* ── Form ────────────────────────────────────────── */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={styles.input}
              placeholder="camarero / cocina"
              autoComplete="username"
              autoCapitalize="none"
              required
              disabled={pending}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="••••••••••"
              autoComplete="current-password"
              required
              disabled={pending}
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
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? "Verificando…" : "Entrar"}
          </button>

        </form>

        <p className={styles.footer}>
          Cruz Blanca · Lucena, Córdoba
        </p>

      </div>
    </main>
  );
}
