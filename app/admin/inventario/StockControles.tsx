"use client";

import { useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { actualizarStock } from "@/app/actions/stock";
import styles from "./inventario.module.css";

interface Props {
  id:       string;
  cantidad: number;
}

export default function StockControles({ id, cantidad }: Props) {
  const [isPending, startTransition] = useTransition();

  const cambiar = (variacion: number) => {
    startTransition(() => actualizarStock(id, variacion));
  };

  return (
    <div
      className={`${styles.controles} ${isPending ? styles.controlesPending : ""}`}
      aria-label="Ajustar cantidad"
    >
      <button
        className={styles.ctrlBtn}
        onClick={() => cambiar(-1)}
        disabled={isPending || cantidad <= 0}
        aria-label="Restar una unidad"
      >
        <Minus size={13} strokeWidth={2.5} />
      </button>

      <span className={`${styles.ctrlNum} ${isPending ? styles.ctrlNumPending : ""}`}>
        {cantidad}
      </span>

      <button
        className={styles.ctrlBtn}
        onClick={() => cambiar(+1)}
        disabled={isPending}
        aria-label="Sumar una unidad"
      >
        <Plus size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}
