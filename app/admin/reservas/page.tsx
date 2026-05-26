import { CalendarCheck, Sun, Moon, PlusCircle, Ban, CalendarX } from "lucide-react";
import { getReservasHoy, getBloqueos, crearBloqueo } from "@/app/actions/reservas";
import ReservaCard       from "./ReservaCard";
import EliminarBloqueoBtn from "./EliminarBloqueoBtn";
import styles from "./reservas.module.css";

const HORA_CORTE = 17;

const SLOTS = [
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00",
  "20:00","20:30","21:00","21:30","22:00","22:30","23:00",
];

export const metadata = { title: "Reservas — Cruz Blanca Gestor" };

export default async function ReservasPage() {
  const [reservas, bloqueos] = await Promise.all([
    getReservasHoy(),
    getBloqueos(),
  ]);

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
        {comida.length === 0
          ? <EmptyState turno="comida" />
          : <div className={styles.cards}>{comida.map(r => <ReservaCard key={r.id} reserva={r} />)}</div>
        }
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
        {cena.length === 0
          ? <EmptyState turno="cena" />
          : <div className={styles.cards}>{cena.map(r => <ReservaCard key={r.id} reserva={r} />)}</div>
        }
      </section>

      {/* ══════════════════════════════════════════════════════
          SECCIÓN BLOQUEOS / VACACIONES
      ══════════════════════════════════════════════════════ */}
      <section className={styles.bloqueoSection} aria-labelledby="bloqueos-title">

        {/* Cabecera */}
        <div className={styles.turnoHeader}>
          <div className={`${styles.turnoBadge} ${styles.turnoBadgeBloqueo}`}>
            <Ban size={14} strokeWidth={2} />
          </div>
          <h2 id="bloqueos-title" className={styles.turnoTitle}>
            Días Bloqueados · Vacaciones
            {bloqueos.length > 0 && (
              <span className={styles.turnoCount}>{bloqueos.length}</span>
            )}
          </h2>
          <div className={styles.turnoLine} />
        </div>

        {/* Formulario para crear bloqueo */}
        <div className={styles.bloqueoFormCard}>
          <p className={styles.bloqueoFormHint}>
            Un bloqueo de <strong>Todo el día</strong> oculta el formulario de reservas ese día.
            Un bloqueo de <strong>hora específica</strong> deshabilita ese slot.
          </p>
          <form action={crearBloqueo} className={styles.bloqueoForm}>
            <div className={styles.bloqueoFormRow}>

              <div className={styles.bloqueoField}>
                <label htmlFor="blq-fecha" className={styles.bloqueoLabel}>Fecha</label>
                <input
                  id="blq-fecha" name="fecha" type="date"
                  required className={styles.bloqueoInput}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className={styles.bloqueoField}>
                <label htmlFor="blq-hora" className={styles.bloqueoLabel}>Hora</label>
                <select id="blq-hora" name="hora" className={styles.bloqueoSelect}>
                  <option value="todo">Todo el día</option>
                  <optgroup label="Comida">
                    {SLOTS.slice(0, 7).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Cena">
                    {SLOTS.slice(7).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className={styles.bloqueoField} style={{ flex: "2 1 220px" }}>
                <label htmlFor="blq-mensaje" className={styles.bloqueoLabel}>Mensaje para el cliente</label>
                <input
                  id="blq-mensaje" name="mensaje" type="text"
                  placeholder="Ej: Cerrado por vacaciones"
                  required className={styles.bloqueoInput}
                />
              </div>

              <div className={styles.bloqueoFieldBtn}>
                <button type="submit" className={styles.bloqueoSubmitBtn}>
                  Añadir bloqueo
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Lista de bloqueos activos */}
        {bloqueos.length === 0 ? (
          <div className={styles.empty}>
            <CalendarX size={26} strokeWidth={1.25} />
            <p>No hay días bloqueados. El restaurante está disponible en todas las fechas.</p>
          </div>
        ) : (
          <div className={styles.bloqueoList}>
            {bloqueos.map((b) => (
              <div
                key={b.id}
                className={`${styles.bloqueoItem} ${b.hora === null ? styles.bloqueoItemDia : styles.bloqueoItemHora}`}
              >
                <div className={styles.bloqueoItemIcon}>
                  {b.hora === null
                    ? <CalendarX size={15} strokeWidth={2} />
                    : <Ban        size={15} strokeWidth={2} />
                  }
                </div>
                <div className={styles.bloqueoItemInfo}>
                  <span className={styles.bloqueoItemFecha}>
                    {b.fecha}
                    {b.hora && <span className={styles.bloqueoItemHoraTag}>{b.hora}</span>}
                    {b.hora === null && <span className={styles.bloqueoItemDiaTag}>Todo el día</span>}
                  </span>
                  <span className={styles.bloqueoItemMensaje}>{b.mensaje}</span>
                </div>
                <EliminarBloqueoBtn id={b.id} label={`${b.fecha}${b.hora ? ` ${b.hora}` : ""}`} />
              </div>
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
