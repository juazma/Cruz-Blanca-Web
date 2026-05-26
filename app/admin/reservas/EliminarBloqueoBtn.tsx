"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { eliminarBloqueo } from "@/app/actions/reservas";
import styles from "./reservas.module.css";

export default function EliminarBloqueoBtn({ id, label }: { id: string; label: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`¿Eliminar el bloqueo "${label}"?`)) return;
    startTransition(() => eliminarBloqueo(id));
  };

  return (
    <button
      className={styles.bloqueoDeleteBtn}
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Eliminar bloqueo ${label}`}
      title="Eliminar bloqueo"
    >
      {isPending
        ? <Loader2 size={13} className={styles.spin} />
        : <Trash2   size={13} strokeWidth={2} />
      }
    </button>
  );
}
