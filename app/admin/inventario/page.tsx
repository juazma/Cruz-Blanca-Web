import { AlertTriangle, Package } from "lucide-react";
import { getProductos, crearProducto } from "@/app/actions/stock";
import StockControles from "./StockControles";
import styles from "./inventario.module.css";

export const metadata = { title: "Inventario — Cruz Blanca Gestor" };

/* ── Icono por categoría ─────────────────────────────────────── */
const CATEGORIA_EMOJI: Record<string, string> = {
  Pescado:  "🐟",
  Marisco:  "🦐",
  Carne:    "🥩",
  Bodega:   "🍷",
  Despensa: "🫙",
  Lacteos:  "🧀",
  Postres:  "🍫",
};

const CATEGORIAS_SUGERIDAS = [
  "Pescado", "Marisco", "Carne", "Bodega", "Despensa", "Lacteos", "Postres",
];

export default async function InventarioPage() {
  const productos = await getProductos();

  /* ── Agrupar por categoría ───────────────────────────────────── */
  const grupos = productos.reduce<Record<string, typeof productos>>(
    (acc, p) => {
      if (!acc[p.categoria]) acc[p.categoria] = [];
      acc[p.categoria].push(p);
      return acc;
    },
    {},
  );

  const totalProductos  = productos.length;
  const totalEnAlerta   = productos.filter(p => p.cantidad <= p.stockMinimo).length;
  const totalCategorias = Object.keys(grupos).length;

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Inventario</h1>
          <p className={styles.pageSubtitle}>
            {totalProductos} producto{totalProductos !== 1 ? "s" : ""} · {totalCategorias} categoría{totalCategorias !== 1 ? "s" : ""}
            {totalEnAlerta > 0 && (
              <span className={styles.alertaBadge}>
                <AlertTriangle size={11} strokeWidth={2.5} />
                {totalEnAlerta} bajo mínimo
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Formulario de nuevo producto ─────────────────────── */}
      <section className={styles.formCard}>
        <h2 className={styles.formTitle}>Añadir producto</h2>
        <form action={crearProducto} className={styles.form}>
          <div className={styles.formRow}>

            <div className={styles.formField} style={{ flex: "2 1 200px" }}>
              <label htmlFor="inv-nombre" className={styles.label}>Nombre</label>
              <input
                id="inv-nombre" name="nombre" type="text"
                placeholder="Ej: Lubina fresca"
                required className={styles.input}
              />
            </div>

            <div className={styles.formField} style={{ flex: "1 1 160px" }}>
              <label htmlFor="inv-categoria" className={styles.label}>Categoría</label>
              <input
                id="inv-categoria" name="categoria" type="text"
                placeholder="Pescado, Carne…"
                list="cats-list"
                required className={styles.input}
              />
              <datalist id="cats-list">
                {CATEGORIAS_SUGERIDAS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div className={styles.formField} style={{ flex: "0 0 110px" }}>
              <label htmlFor="inv-cantidad" className={styles.label}>Cantidad</label>
              <input
                id="inv-cantidad" name="cantidad" type="number"
                placeholder="0" min="0" defaultValue="0"
                required className={styles.input}
              />
            </div>

            <div className={styles.formField} style={{ flex: "0 0 130px" }}>
              <label htmlFor="inv-minimo" className={styles.label}>Mín. alerta</label>
              <input
                id="inv-minimo" name="stockMinimo" type="number"
                placeholder="5" min="0" defaultValue="5"
                required className={styles.input}
              />
            </div>

            <div className={styles.formFieldBtn}>
              <button type="submit" className={styles.submitBtn}>
                + Añadir
              </button>
            </div>

          </div>
        </form>
      </section>

      {/* ── Grupos por categoría ────────────────────────────── */}
      <div className={styles.grupos}>
        {Object.entries(grupos).map(([categoria, items]) => {
          const enAlertaEnGrupo = items.filter(p => p.cantidad <= p.stockMinimo).length;

          return (
            <section key={categoria} className={styles.grupo} aria-labelledby={`cat-${categoria}`}>

              {/* Cabecera de grupo */}
              <div className={styles.grupoHeader}>
                <span className={styles.grupoEmoji} aria-hidden="true">
                  {CATEGORIA_EMOJI[categoria] ?? "📦"}
                </span>
                <h2 id={`cat-${categoria}`} className={styles.grupoTitulo}>
                  {categoria}
                </h2>
                <span className={styles.grupoCount}>{items.length}</span>
                {enAlertaEnGrupo > 0 && (
                  <span className={styles.grupoAlerta}>
                    <AlertTriangle size={11} strokeWidth={2.5} />
                    {enAlertaEnGrupo}
                  </span>
                )}
                <div className={styles.grupoLine} />
              </div>

              {/* Tarjetas de producto */}
              <div className={styles.productosGrid}>
                {items.map(p => {
                  const enAlerta = p.cantidad <= p.stockMinimo;
                  const agotado  = p.cantidad === 0;

                  return (
                    <div
                      key={p.id}
                      className={`${styles.productoCard} ${enAlerta ? styles.productoCardAlerta : ""}`}
                    >
                      {/* Nombre + indicador */}
                      <div className={styles.productoTop}>
                        <div className={styles.productoInfo}>
                          <span className={styles.productoNombre}>{p.nombre}</span>
                          <span className={styles.productoMinimo}>
                            Mín. {p.stockMinimo} ud.
                          </span>
                        </div>

                        {enAlerta && (
                          <span className={`${styles.estadoBadge} ${agotado ? styles.estadoAgotado : styles.estadoAlerta}`}>
                            {agotado ? "Agotado" : "Bajo stock"}
                          </span>
                        )}
                      </div>

                      {/* Controles +/− y eliminar */}
                      <StockControles id={p.id} nombre={p.nombre} cantidad={p.cantidad} />
                    </div>
                  );
                })}
              </div>

            </section>
          );
        })}
      </div>

      {/* ── Estado vacío ────────────────────────────────────── */}
      {productos.length === 0 && (
        <div className={styles.empty}>
          <Package size={32} strokeWidth={1.25} />
          <p>No hay productos registrados. Añade el primero arriba.</p>
        </div>
      )}

    </div>
  );
}
