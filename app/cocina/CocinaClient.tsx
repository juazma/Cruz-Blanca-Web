"use client";

import { useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  actualizarEstadoItem,
  type ItemEstado,
} from "@/app/actions/comandasActions";
import { logoutStaff } from "@/app/actions/authCamarero";
import styles from "./cocina.module.css";

type Plato = { id: string; nombre: string };

type ComandaItem = {
  id: string;
  cantidad: number;
  notas: string | null;
  estado: string;
  plato: Plato;
};

type Comanda = {
  id: string;
  mesa: string;
  createdAt: Date | string;
  items: ComandaItem[];
};

interface Props {
  comandas: Comanda[];
}

const NEXT_ESTADO: Record<string, ItemEstado | null> = {
  PENDIENTE: "PREPARANDO",
  PREPARANDO: "LISTO",
  LISTO: null,
  ENTREGADO: null,
};

const BTN_LABEL: Record<string, string> = {
  PENDIENTE: "Iniciar",
  PREPARANDO: "Listo ✓",
  LISTO: "✓ Listo",
  ENTREGADO: "Entregado",
};

function formatTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export default function CocinaClient({ comandas }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  /* Auto-refresh every 5 s */
  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  function handleEstado(itemId: string, estado: string) {
    const next = NEXT_ESTADO[estado];
    if (!next) return;
    startTransition(() => actualizarEstadoItem(itemId, next));
  }

  function handleLogout() {
    startTransition(() => logoutStaff());
  }

  /* Filter out fully-entregado comandas */
  const activeComandas = comandas.filter((c) =>
    c.items.some((i) => i.estado !== "ENTREGADO"),
  );

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <img src="/logo.svg" alt="Cruz Blanca" className={styles.topbarLogo} style={{ height: '20px' }} />
          <span className={styles.topbarRole}>🍳 Panel de Cocina</span>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.refreshLabel}>↻ auto 5 s</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <div className={styles.board}>
        {activeComandas.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>✅</span>
            <span className={styles.emptyText}>
              Todo al día — sin comandas pendientes
            </span>
          </div>
        ) : (
          activeComandas.map((comanda) => (
            <div key={comanda.id} className={styles.ticket}>
              <div className={styles.ticketHeader}>
                <span className={styles.ticketMesa}>Mesa {comanda.mesa}</span>
                <span className={styles.ticketTime}>
                  {formatTime(comanda.createdAt)}
                </span>
              </div>

              <div className={styles.ticketItems}>
                {comanda.items
                  .filter((i) => i.estado !== "ENTREGADO")
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.ticketItem} ${
                        item.estado === "PREPARANDO"
                          ? styles.preparando
                          : item.estado === "LISTO"
                            ? styles.listo
                            : item.estado === "ENTREGADO"
                              ? styles.entregado
                              : ""
                      }`}
                    >
                      <span className={styles.ticketCant}>×{item.cantidad}</span>
                      <div style={{ flex: 1 }}>
                        <div className={styles.ticketNombre}>
                          {item.plato.nombre}
                        </div>
                        {item.notas && (
                          <div className={styles.ticketNotas}>{item.notas}</div>
                        )}
                      </div>
                      <button
                        className={`${styles.estadoBtn} ${styles[`btn${item.estado}` as keyof typeof styles]}`}
                        onClick={() => handleEstado(item.id, item.estado)}
                        disabled={
                          pending ||
                          item.estado === "LISTO" ||
                          item.estado === "ENTREGADO"
                        }
                      >
                        {BTN_LABEL[item.estado] ?? item.estado}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
