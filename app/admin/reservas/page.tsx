import { CalendarCheck, Sun, Moon, PlusCircle } from "lucide-react";
import { getReservasHoy } from "@/app/actions/reservas";
import ReservaCard from "./ReservaCard";
import styles from "./reservas.module.css";

const HORA_CORTE = 17; // < 17:00 → comida | >= 17:00 → cena

export const metadata = { title: "Reservas — Cruz Blanca Gestor" };

export default async function ReservasPage() {
  const reservas = await getReservasHoy();

  const comida = reservas.filter(r => new Date(r.fechaHora).getHours() < HORA_CORTE);
  const cena   = reservas.filter(r => new Date(r.fechaHora).getHours() >= HORA_CORTE);

  const hoyStr = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className={styles.page}>

      {/* ── Header ────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reservas de Hoy</h1>
          <p className={styles.pageSubtitle}>
            {hoyStr.charAt(0).toUpperCase() + hoyStr.slice(1)} · {reservas.length} reserva{reservas.length !== 1 ? "s" : ""}
          </p>
        </div>

        <a href="/admin/reservas/nueva" className={styles.newBtn}>
          <PlusCircle size={16} strokeWidth={2} />
          Nueva reserva
        </a>
      </div>

      {/* ── Turno Comida ──────────────────────────────────── */}
      <section className={styles.turno} aria-labelledby="turno-comida">
        <div className={styles.turnoHeader}>
          <div className={`${styles.turnoBadge} ${styles.turnoBadgeComida}`}>
            <Sun size={14} strokeWidth={2} />
          </div>
          <h2 id="turno-comida" className={styles.turnoTitle}>
            Turno de Comida
            <span className={styles.turnoCount}>{comida.length}</span>
          </h2>
          <div className={styles.turnoLine} />
        </div>

        {comida.length === 0 ? (
          <EmptyState turno="comida" />
        ) : (
          <div className={styles.cards}>
            {comida.map(r => (
              <ReservaCard key={r.id} reserva={r} />
            ))}
          </div>
        )}
      </section>

      {/* ── Turno Cena ────────────────────────────────────── */}
      <section className={styles.turno} aria-labelledby="turno-cena">
        <div className={styles.turnoHeader}>
          <div className={`${styles.turnoBadge} ${styles.turnoBadgeCena}`}>
            <Moon size={14} strokeWidth={2} />
          </div>
          <h2 id="turno-cena" className={styles.turnoTitle}>
            Turno de Cena
            <span className={styles.turnoCount}>{cena.length}</span>
          </h2>
          <div className={styles.turnoLine} />
        </div>

        {cena.length === 0 ? (
          <EmptyState turno="cena" />
        ) : (
          <div className={styles.cards}>
            {cena.map(r => (
              <ReservaCard key={r.id} reserva={r} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────── */
function EmptyState({ turno }: { turno: string }) {
  return (
    <div className={styles.empty}>
      <CalendarCheck size={28} strokeWidth={1.25} />
      <p>Sin reservas en el turno de {turno}</p>
    </div>
  );
}
