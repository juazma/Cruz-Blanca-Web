"use client";

import { useTransition } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { actualizarStock, eliminarProducto } from "@/app/actions/stock";
import styles from "./inventario.module.css";

interface Props {
  id:       string;
  nombre:   string;
  cantidad: number;
}

export default function StockControles({ id, nombre, cantidad }: Props) {
  const [pendingStock,  startStock]  = useTransition();
  const [pendingDelete, startDelete] = useTransition();

  const isPending = pendingStock || pendingDelete;

  const cambiar = (variacion: number) =>
    startStock(() => actualizarStock(id, variacion));

  const handleDelete = () => {
    if (!confirm(`¿Eliminar "${nombre}" del inventario?`)) return;
    startDelete(() => eliminarProducto(id));
  };

  return (
    <div className={styles.controlesRow}>
      {/* +/− stepper */}
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

      {/* Eliminar */}
      <button
        className={styles.deleteProductoBtn}
        onClick={handleDelete}
        disabled={isPending}
        aria-label={`Eliminar ${nombre}`}
        title="Eliminar producto"
      >
        {pendingDelete
          ? <Loader2 size={12} className={styles.spin} />
          : <Trash2   size={12} strokeWidth={2} />
        }
      </button>
    </div>
  );
}
