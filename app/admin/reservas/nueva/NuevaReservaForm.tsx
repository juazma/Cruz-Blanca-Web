"use client";

import { useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Users, Calendar, Clock, StickyNote, User, Loader2 } from "lucide-react";
import { crearReserva } from "@/app/actions/reservas";
import styles from "./nueva.module.css";

export default function NuevaReservaForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  /* ── Valores por defecto ─────────────────────────────────── */
  const hoy = new Date();
  const fechaDefault = hoy.toISOString().split("T")[0]; // YYYY-MM-DD
  const horaDefault  = "13:30";

  /* ── Submit ──────────────────────────────────────────────── */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const nombreCliente = (fd.get("nombreCliente") as string).trim();
    const comensales    = parseInt(fd.get("comensales") as string, 10);
    const fecha         = fd.get("fecha") as string;   // YYYY-MM-DD
    const hora          = fd.get("hora")  as string;   // HH:MM
    const notas         = (fd.get("notas") as string).trim() || undefined;

    /* Combinar fecha + hora en un único Date local */
    const [y, m, d] = fecha.split("-").map(Number);
    const [hh, mm]  = hora.split(":").map(Number);
    const fechaHora = new Date(y, m - 1, d, hh, mm, 0);

    startTransition(async () => {
      await crearReserva({ nombreCliente, comensales, fechaHora, notas });
      router.push("/admin/reservas");
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
    >

      {/* ── Nombre del cliente ─────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="nombreCliente" className={styles.label}>
          <User size={13} strokeWidth={2} />
          Nombre del cliente
        </label>
        <input
          id="nombreCliente"
          name="nombreCliente"
          type="text"
          required
          placeholder="Ej: Familia García"
          className={styles.input}
          disabled={isPending}
          autoComplete="off"
        />
      </div>

      {/* ── Comensales ─────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="comensales" className={styles.label}>
          <Users size={13} strokeWidth={2} />
          Número de comensales
        </label>
        <input
          id="comensales"
          name="comensales"
          type="number"
          required
          min={1}
          max={50}
          defaultValue={2}
          className={styles.input}
          disabled={isPending}
        />
      </div>

      {/* ── Fecha + Hora (misma fila) ───────────────────────── */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="fecha" className={styles.label}>
            <Calendar size={13} strokeWidth={2} />
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={fechaDefault}
            className={styles.input}
            disabled={isPending}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="hora" className={styles.label}>
            <Clock size={13} strokeWidth={2} />
            Hora
          </label>
          <input
            id="hora"
            name="hora"
            type="time"
            required
            defaultValue={horaDefault}
            className={styles.input}
            disabled={isPending}
          />
        </div>
      </div>

      {/* ── Notas ──────────────────────────────────────────── */}
      <div className={styles.field}>
        <label htmlFor="notas" className={styles.label}>
          <StickyNote size={13} strokeWidth={2} />
          Notas <span className={styles.optional}>(opcional)</span>
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          placeholder="Alergias, preferencia de mesa, ocasión especial…"
          className={`${styles.input} ${styles.textarea}`}
          disabled={isPending}
        />
      </div>

      {/* ── Acciones ───────────────────────────────────────── */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <Loader2 size={15} className={styles.spin} />
              Guardando…
            </>
          ) : (
            "Guardar reserva"
          )}
        </button>
      </div>

    </form>
  );
}
