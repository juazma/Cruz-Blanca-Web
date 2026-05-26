"use client";

import { useTransition, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  crearOActualizarComanda,
  actualizarEstadoItem,
  finalizarComanda,
  eliminarItem,
  type ItemEstado,
} from "@/app/actions/comandasActions";
import { logoutStaff } from "@/app/actions/authCamarero";
import styles from "./camareros.module.css";

/* ── Types ──────────────────────────────────────────────────────── */
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

/* ── Default mesas ──────────────────────────────────────────────── */
const DEFAULT_MESAS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const STORAGE_KEY = "cruzblanca_mesas";

interface Props {
  comandas: Comanda[];
  platos: Plato[];
  camarero: string;
}

export default function CamareroClient({ comandas, platos, camarero }: Props) {
  const router = useRouter();
  /* ── Mesas state (persisted in localStorage) ────────────────────── */
  const [mesas, setMesas] = useState<string[]>(DEFAULT_MESAS);
  const [mesasLoaded, setMesasLoaded] = useState(false);
  const [showMesaManager, setShowMesaManager] = useState(false);
  const [nuevaMesa, setNuevaMesa] = useState("");

  /* Auto-refresh every 5 s */
  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMesas(parsed);
        }
      }
    } catch {
      // ignore
    }
    setMesasLoaded(true);
  }, []);

  // Save to localStorage whenever mesas changes (after initial load)
  useEffect(() => {
    if (mesasLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
    }
  }, [mesas, mesasLoaded]);

  function handleAddMesa() {
    const trimmed = nuevaMesa.trim();
    if (!trimmed || mesas.includes(trimmed)) return;
    setMesas((prev) => [...prev, trimmed]);
    setNuevaMesa("");
  }

  function handleDeleteMesa(mesa: string) {
    const comanda = comandas.find((c) => c.mesa === mesa);
    if (comanda) {
      alert(`La mesa "${mesa}" tiene una comanda activa. Ciérrala primero.`);
      return;
    }
    if (!confirm(`¿Eliminar la mesa "${mesa}"?`)) return;
    setMesas((prev) => prev.filter((m) => m !== mesa));
    if (selectedMesa === mesa) handleBack();
  }

  /* ── Comanda state ──────────────────────────────────────────────── */
  const [selectedMesa, setSelectedMesa] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [platoId, setPlatoId] = useState(platos[0]?.id ?? "");
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState("");

  const [pending, startTransition] = useTransition();

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
    setShowMesaManager(false);
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

  /* ── Grouped platos for select ──────────────────────────────────── */
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
        <img src="/logo.svg" alt="Cruz Blanca" className={styles.topbarLogo} style={{ height: '20px' }} />
        <div className={styles.topbarActions}>
          {selectedMesa ? (
            <button className={styles.backTopbarBtn} onClick={handleBack}>
              ‹ Mesas
            </button>
          ) : (
            <>
              <button
                className={styles.managerBtn}
                onClick={() => {
                  setShowMesaManager((v) => !v);
                  setDetailOpen(false);
                }}
                title="Gestionar mesas"
              >
                ⚙ Mesas
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Salir
              </button>
            </>
          )}
        </div>
      </header>

      <div className={styles.body}>
        {/* Mesa grid */}
        <aside
          className={`${styles.mesaPanel} ${detailOpen ? styles.hidden : ""}`}
        >
          {/* ── Mesa Manager ────────────────────────────────── */}
          {showMesaManager && (
            <div className={styles.mesaManagerBox}>
              <span className={styles.mesaManagerTitle}>Gestionar mesas</span>
              <div className={styles.mesaManagerAdd}>
                <input
                  type="text"
                  className={styles.mesaManagerInput}
                  placeholder="Ej: Terraza 1, Barra 2…"
                  value={nuevaMesa}
                  onChange={(e) => setNuevaMesa(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMesa()}
                  maxLength={20}
                />
                <button
                  className={styles.mesaManagerAddBtn}
                  onClick={handleAddMesa}
                  disabled={!nuevaMesa.trim() || mesas.includes(nuevaMesa.trim())}
                >
                  + Añadir
                </button>
              </div>
              <div className={styles.mesaManagerList}>
                {mesas.map((m) => (
                  <div key={m} className={styles.mesaManagerItem}>
                    <span className={styles.mesaManagerItemName}>Mesa {m}</span>
                    <button
                      className={styles.mesaManagerDeleteBtn}
                      onClick={() => handleDeleteMesa(m)}
                      title={`Eliminar mesa ${m}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Mesa grid ───────────────────────────────────── */}
          <div className={styles.mesaGrid}>
            {mesas.map((mesa) => {
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
                <span className={styles.detailTitle}>
                  Mesa {selectedMesa}
                </span>
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

                {/* Add plato — fixed layout to prevent overflow */}
                <div className={styles.addSection}>
                  <span className={styles.addTitle}>Añadir plato</span>

                  {/* Row 1: selector full width */}
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

                  {/* Row 2: cantidad + button */}
                  <div className={styles.addRow}>
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
                      {pending ? "…" : "Añadir a la comanda"}
                    </button>
                  </div>

                  {/* Row 3: notes */}
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
                  <div className={styles.totalTextCol}>
                    <span className={styles.totalLabel}>Total comanda</span>
                    <span className={styles.totalAmount}>
                      {totalComanda.toFixed(2)} €
                    </span>
                  </div>
                  {/* Cobrar button only if all items are LISTO or ENTREGADO */}
                  {comanda.items.length > 0 && comanda.items.every(i => i.estado === "LISTO" || i.estado === "ENTREGADO") ? (
                    <button
                      className={styles.cobrarBottomBtn}
                      onClick={handleFinalizar}
                      disabled={pending}
                      title="Terminar y liberar mesa (todos los productos listos)"
                    >
                      {pending ? "…" : "Cobrar y Liberar Mesa"}
                    </button>
                  ) : (
                    <span className={styles.cobrarWarning} title="No se puede cobrar hasta que cocina termine todos los platos">
                      Pendiente en cocina
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
