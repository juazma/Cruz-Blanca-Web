"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { eliminarTurno } from "@/app/actions/horarios";
import styles from "./horarios.module.css";

interface Props {
  id:         string;
  empleado:   string;
  horaInicio: string;
  horaFin:    string;
}

export default function TurnoCard({ id, empleado, horaInicio, horaFin }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`¿Eliminar el turno de ${empleado}?`)) return;
    startTransition(() => eliminarTurno(id));
  };

  return (
    <article
      className={`${styles.turnoCard} ${isPending ? styles.turnoCardPending : ""}`}
      aria-label={`Turno de ${empleado}`}
    >
      <div className={styles.turnoInfo}>
        <span className={styles.turnoEmpleado}>{empleado}</span>
        <span className={styles.turnoHora}>
          {horaInicio} – {horaFin}
        </span>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={handleDelete}
        disabled={isPending}
        aria-label={`Eliminar turno de ${empleado}`}
        title="Eliminar turno"
      >
        {isPending
          ? <Loader2 size={12} className={styles.spin} />
          : <Trash2   size={12} strokeWidth={2} />
        }
      </button>
    </article>
  );
}
