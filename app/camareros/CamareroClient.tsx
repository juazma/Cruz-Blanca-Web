"use client";

import { useTransition, useState } from "react";
import {
  crearOActualizarComanda,
  actualizarEstadoItem,
  finalizarComanda,
  eliminarItem,
  type ItemEstado,
} from "@/app/actions/comandasActions";
import { logoutStaff } from "@/app/actions/authCamarero";
import styles from "./camareros.module.css";

/* ── Types (inferred from Prisma include) ──────────────────────── */
type Plato = {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
};

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
  estado: string;
  items: ComandaItem[];
};

/* ── Constants ─────────────────────────────────────────────────── */
const MESAS = Array.from({ length: 12 }, (_, i) => String(i + 1));

interface Props {
  comandas: Comanda[];
  platos: Plato[];
  camarero: string;
}

export default function CamareroClient({ comandas, platos, camarero }: Props) {
  const [selectedMesa, setSelectedMesa] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [platoId, setPlatoId] = useState(platos[0]?.id ?? "");
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState("");

  const [pending, startTransition] = useTransition();

  /* Find comanda for selected mesa */
  const comanda = selectedMesa
    ? comandas.find((c) => c.mesa === selectedMesa) ?? null
    : null;

  const totalComanda = comanda
    ? comanda.items.reduce(
        (acc, item) => acc + item.plato.precio * item.cantidad,
        0,
      )
    : 0;

  function openMesa(mesa: string) {
    setSelectedMesa(mesa);
    setDetailOpen(true);
  }

  function handleBack() {
    setDetailOpen(false);
    setTimeout(() => setSelectedMesa(null), 300);
  }

  function handleAddItem() {
    if (!selectedMesa || !platoId) return;
    const fd = new FormData();
    fd.set("mesa", selectedMesa);
    fd.set("platoId", platoId);
    fd.set("cantidad", String(cantidad));
    fd.set("notas", notas);
    fd.set("camarero", camarero);
    startTransition(async () => {
      await crearOActualizarComanda(fd);
      setNotas("");
      setCantidad(1);
    });
  }

  function handleEstado(itemId: string, estado: ItemEstado) {
    startTransition(() => actualizarEstadoItem(itemId, estado));
  }

  function handleEliminar(itemId: string) {
    startTransition(() => eliminarItem(itemId));
  }

  function handleFinalizar() {
    if (!comanda) return;
    if (!confirm("¿Marcar esta comanda como pagada?")) return;
    startTransition(async () => {
      await finalizarComanda(comanda.id);
      handleBack();
    });
  }

  function handleLogout() {
    startTransition(() => logoutStaff());
  }

  /* ── Grouped platos for select ─────────────────────────────────── */
  const grupos = platos.reduce<Record<string, Plato[]>>((acc, p) => {
    if (!acc[p.categoria]) acc[p.categoria] = [];
    acc[p.categoria].push(p);
    return acc;
  }, {});

  return (
    <div className={styles.root}>
      {/* Top bar */}
      <header className={styles.topbar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Cruz Blanca" className={styles.topbarLogo} />
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Salir
        </button>
      </header>

      <div className={styles.body}>
        {/* Mesa grid */}
        <aside
          className={`${styles.mesaPanel} ${detailOpen ? styles.hidden : ""}`}
        >
          <div className={styles.mesaGrid}>
            {MESAS.map((mesa) => {
              const c = comandas.find((x) => x.mesa === mesa);
              const isActive = selectedMesa === mesa;
              return (
                <button
                  key={mesa}
                  className={`${styles.mesaCard} ${c ? styles.ocupada : ""} ${isActive ? styles.active : ""}`}
                  onClick={() => openMesa(mesa)}
                >
                  <span className={styles.mesaNum}>Mesa {mesa}</span>
                  <span className={styles.mesaLabel}>
                    {c ? "ocupada" : "libre"}
                  </span>
                  {c && (
                    <span className={styles.mesaBadge}>
                      {c.items.length} plato{c.items.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Comanda detail */}
        <main
          className={`${styles.detailPanel} ${detailOpen ? styles.open : ""}`}
        >
          {!selectedMesa ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🪑</span>
              <span className={styles.emptyText}>
                Selecciona una mesa para gestionar su comanda
              </span>
            </div>
          ) : (
            <>
              <div className={styles.detailHeader}>
                <button className={styles.backBtn} onClick={handleBack}>
                  ‹
                </button>
                <span className={styles.detailTitle}>
                  Mesa {selectedMesa}
                </span>
                {comanda && (
                  <button
                    className={styles.finalizarBtn}
                    onClick={handleFinalizar}
                    disabled={pending}
                  >
                    Cobrar
                  </button>
                )}
              </div>

              <div className={styles.detailBody}>
                {/* Item list */}
                {comanda && comanda.items.length > 0 ? (
                  <div className={styles.itemList}>
                    {comanda.items.map((item) => (
                      <div
                        key={item.id}
                        className={`${styles.itemRow} ${item.estado === "LISTO" ? styles.listo : ""} ${item.estado === "ENTREGADO" ? styles.entregado : ""}`}
                      >
                        <span className={styles.itemCant}>×{item.cantidad}</span>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemNombre}>
                            {item.plato.nombre}
                          </div>
                          {item.notas && (
                            <div className={styles.itemNotas}>{item.notas}</div>
                          )}
                        </div>
                        <span
                          className={`${styles.itemEstadoBadge} ${styles[`estado${item.estado}` as keyof typeof styles]}`}
                        >
                          {item.estado === "PENDIENTE"
                            ? "Pendiente"
                            : item.estado === "PREPARANDO"
                              ? "Preparando"
                              : item.estado === "LISTO"
                                ? "✓ Listo"
                                : "Entregado"}
                        </span>
                        <div className={styles.itemActions}>
                          {item.estado === "LISTO" && (
                            <button
                              className={styles.iconBtn}
                              title="Marcar entregado"
                              onClick={() =>
                                handleEstado(item.id, "ENTREGADO")
                              }
                              disabled={pending}
                            >
                              ✓
                            </button>
                          )}
                          <button
                            className={`${styles.iconBtn} ${styles.danger}`}
                            title="Eliminar"
                            onClick={() => handleEliminar(item.id)}
                            disabled={pending}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty} style={{ flex: "unset", padding: "1.5rem 0" }}>
                    <span className={styles.emptyIcon}>📋</span>
                    <span className={styles.emptyText}>
                      Sin platos aún — añade el primer plato
                    </span>
                  </div>
                )}

                {/* Add plato */}
                <div className={styles.addSection}>
                  <span className={styles.addTitle}>Añadir plato</span>
                  <div className={styles.addRow}>
                    <select
                      className={styles.select}
                      value={platoId}
                      onChange={(e) => setPlatoId(e.target.value)}
                    >
                      {Object.entries(grupos).map(([cat, items]) => (
                        <optgroup key={cat} label={cat}>
                          {items.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre} — {p.precio.toFixed(2)} €
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className={styles.cantInput}
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                    />
                    <button
                      className={styles.addBtn}
                      onClick={handleAddItem}
                      disabled={pending || !platoId}
                    >
                      {pending ? "…" : "Añadir"}
                    </button>
                  </div>
                  <input
                    type="text"
                    className={styles.notasInput}
                    placeholder="Notas (sin gluten, muy hecho…)"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>
              </div>

              {/* Total bar */}
              {comanda && (
                <div className={styles.totalBar}>
                  <span>Total comanda</span>
                  <span className={styles.totalAmount}>
                    {totalComanda.toFixed(2)} €
                  </span>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
