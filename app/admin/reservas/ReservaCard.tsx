"use client";

import { useTransition } from "react";
import { Users, Clock, StickyNote, Loader2 } from "lucide-react";
import { cambiarEstadoReserva, type EstadoReserva } from "@/app/actions/reservas";
import styles from "./reservas.module.css";

/* ── Types ──────────────────────────────────────────────────── */
interface Reserva {
  id:            string;
  nombreCliente: string;
  comensales:    number;
  fechaHora:     Date;
  estado:        string;
  notas?:        string | null;
}

/* ── Estado badge config ─────────────────────────────────────── */
const ESTADO_CONFIG: Record<string, { label: string; badge: string }> = {
  PENDIENTE:  { label: "Pendiente",  badge: styles.badgeAmbar    },
  CONFIRMADA: { label: "Confirmada", badge: styles.badgeAzul     },
  COMPLETADA: { label: "Completada", badge: styles.badgeVerde    },
  CANCELADA:  { label: "Cancelada",  badge: styles.badgeRojo     },
};

/* ── Siguientes estados posibles desde cada uno ─────────────── */
const SIGUIENTE_ESTADO: Partial<Record<string, EstadoReserva[]>> = {
  PENDIENTE:  ["CONFIRMADA", "CANCELADA"],
  CONFIRMADA: ["COMPLETADA", "CANCELADA"],
  COMPLETADA: [],
  CANCELADA:  ["PENDIENTE"],
};

/* ── Hora formateada ─────────────────────────────────────────── */
function formatHora(date: Date) {
  return new Date(date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

/* ── Component ──────────────────────────────────────────────── */
export default function ReservaCard({ reserva }: { reserva: Reserva }) {
  const [isPending, startTransition] = useTransition();

  const config       = ESTADO_CONFIG[reserva.estado] ?? ESTADO_CONFIG.PENDIENTE;
  const siguientes   = SIGUIENTE_ESTADO[reserva.estado] ?? [];

  const handleCambio = (nuevoEstado: EstadoReserva) => {
    startTransition(() => {
      cambiarEstadoReserva(reserva.id, nuevoEstado);
    });
  };

  return (
    <article
      className={`${styles.card} ${isPending ? styles.cardPending : ""}`}
      aria-label={`Reserva de ${reserva.nombreCliente}`}
    >
      {/* ── Header: nombre + hora ──────────────────────────── */}
      <div className={styles.cardTop}>
        <div className={styles.cardInfo}>
          <span className={styles.clientName}>{reserva.nombreCliente}</span>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <Clock size={12} />
              {formatHora(reserva.fechaHora)}
            </span>
            <span className={styles.metaItem}>
              <Users size={12} />
              {reserva.comensales} {reserva.comensales === 1 ? "comensal" : "comensales"}
            </span>
          </div>
        </div>

        {/* Estado badge */}
        <span className={`${styles.badge} ${config.badge}`}>
          {isPending
            ? <><Loader2 size={10} className={styles.spin} /> Actualizando…</>
            : config.label
          }
        </span>
      </div>

      {/* ── Notas ─────────────────────────────────────────── */}
      {reserva.notas && (
        <p className={styles.notas}>
          <StickyNote size={11} />
          {reserva.notas}
        </p>
      )}

      {/* ── Botones de acción ─────────────────────────────── */}
      {siguientes.length > 0 && (
        <div className={styles.actions}>
          {siguientes.map((estado) => (
            <button
              key={estado}
              className={`${styles.actionBtn} ${styles[`actionBtn${estado.charAt(0) + estado.slice(1).toLowerCase()}`] ?? ""}`}
              onClick={() => handleCambio(estado)}
              disabled={isPending}
            >
              {ESTADO_CONFIG[estado]?.label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
