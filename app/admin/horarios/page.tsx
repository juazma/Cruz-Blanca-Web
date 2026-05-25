import { getTurnos } from "@/app/actions/horarios";
import { crearTurno } from "@/app/actions/horarios";
import TurnoCard from "./TurnoCard";
import styles from "./horarios.module.css";

/* ── Helpers ─────────────────────────────────────────────────── */

function getLunesSemanaActual(): Date {
  const hoy = new Date();
  const diff = hoy.getDay() === 0 ? -6 : 1 - hoy.getDay();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diff);
  lunes.setHours(0, 0, 0, 0);
  return lunes;
}

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function formatFecha(date: Date): string {
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

/* ── Page ────────────────────────────────────────────────────── */

export default async function HorariosPage() {
  const turnos = await getTurnos();

  const lunes = getLunesSemanaActual();
  const semana: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return d;
  });

  // Group turnos by day index 0=Mon…6=Sun
  const porDia: Record<number, typeof turnos> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  for (const t of turnos) {
    const idx = (new Date(t.dia).getDay() + 6) % 7; // 0=Mon…6=Sun
    if (porDia[idx]) porDia[idx].push(t);
  }

  const hoyIdx = (new Date().getDay() + 6) % 7;

  return (
    <div className={styles.page}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Horarios</h1>
          <p className={styles.pageSubtitle}>Semana del {formatFecha(semana[0])} al {formatFecha(semana[6])}</p>
        </div>
      </div>

      {/* ── Add turno form ───────────────────────────────────── */}
      <section className={styles.formCard}>
        <h2 className={styles.formTitle}>Añadir turno</h2>
        <form action={crearTurno} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="empleado" className={styles.label}>Empleado</label>
              <input
                id="empleado"
                name="empleado"
                type="text"
                placeholder="Nombre del empleado"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="dia" className={styles.label}>Día</label>
              <select id="dia" name="dia" required className={styles.select}>
                {DIAS.map((nombre, i) => (
                  <option key={i} value={i}>{nombre}</option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label htmlFor="horaInicio" className={styles.label}>Hora inicio</label>
              <input
                id="horaInicio"
                name="horaInicio"
                type="time"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="horaFin" className={styles.label}>Hora fin</label>
              <input
                id="horaFin"
                name="horaFin"
                type="time"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formField} style={{ justifyContent: "flex-end" }}>
              <button type="submit" className={styles.submitBtn}>
                + Añadir turno
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ── Weekly Kanban grid ───────────────────────────────── */}
      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {semana.map((fecha, idx) => {
            const esHoy = idx === hoyIdx;
            const turnos = porDia[idx] ?? [];

            return (
              <div
                key={idx}
                className={`${styles.column} ${esHoy ? styles.columnToday : ""}`}
              >
                {/* Column header */}
                <div className={styles.columnHeader}>
                  <span className={styles.diaNombre}>{DIAS[idx]}</span>
                  <span className={`${styles.diaFecha} ${esHoy ? styles.diaFechaToday : ""}`}>
                    {formatFecha(fecha)}
                  </span>
                </div>

                {/* Turno cards */}
                <div className={styles.turnoList}>
                  {turnos.length === 0 ? (
                    <p className={styles.empty}>Sin turnos</p>
                  ) : (
                    turnos.map((t) => (
                      <TurnoCard
                        key={t.id}
                        id={t.id}
                        empleado={t.empleado}
                        horaInicio={t.horaInicio}
                        horaFin={t.horaFin}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
