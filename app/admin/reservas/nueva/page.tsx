import { ArrowLeft, CalendarPlus } from "lucide-react";
import NuevaReservaForm from "./NuevaReservaForm";
import styles from "./nueva.module.css";

export const metadata = { title: "Nueva Reserva — Cruz Blanca Gestor" };

export default function NuevaReservaPage() {
  return (
    <div className={styles.page}>

      {/* ── Back link ─────────────────────────────────────── */}
      <a href="/admin/reservas" className={styles.backLink}>
        <ArrowLeft size={15} strokeWidth={2} />
        Volver a reservas
      </a>

      {/* ── Card contenedor ───────────────────────────────── */}
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.iconWrap}>
            <CalendarPlus size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className={styles.title}>Crear nueva reserva</h1>
            <p className={styles.subtitle}>
              Rellena los datos del cliente y confirma el turno disponible.
            </p>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Formulario */}
        <NuevaReservaForm />

      </div>

    </div>
  );
}
