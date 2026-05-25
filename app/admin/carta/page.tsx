import { UtensilsCrossed } from "lucide-react";
import { getPlatos }       from "@/app/actions/carta";
import { crearPlato }      from "@/app/actions/carta";
import PlatoCard           from "./PlatoCard";
import styles              from "./carta.module.css";
import type { Plato }      from "@/app/generated/prisma/client";

export const metadata = { title: "Carta — Cruz Blanca Gestor" };

/* ── Label por categoría ─────────────────────────────────────── */
const CAT_LABEL: Record<string, string> = {
  entrantes: "Para empezar",
  primeros:  "Primeros platos",
  pescados:  "Pescados",
  carnes:    "Carnes",
  postres:   "Postres",
  bebidas:   "Vinos y bebidas",
};

const CAT_EMOJI: Record<string, string> = {
  entrantes: "🥗",
  primeros:  "🍲",
  pescados:  "🐟",
  carnes:    "🥩",
  postres:   "🍮",
  bebidas:   "🍷",
};

/* ── Page ────────────────────────────────────────────────────── */
export default async function CartaPage() {
  const platos = await getPlatos();

  /* Group by categoria */
  const grupos = platos.reduce<Record<string, Plato[]>>(
    (acc, p) => {
      if (!acc[p.categoria]) acc[p.categoria] = [];
      acc[p.categoria].push(p);
      return acc;
    },
    {},
  );

  const totalPlatos     = platos.length;
  const totalAgotados   = platos.filter((p: Plato) => !p.disponible).length;
  const totalCategorias = Object.keys(grupos).length;

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Carta</h1>
          <p className={styles.pageSubtitle}>
            {totalPlatos} plato{totalPlatos !== 1 ? "s" : ""} · {totalCategorias} categoría{totalCategorias !== 1 ? "s" : ""}
            {totalAgotados > 0 && (
              <span className={styles.agotadosBadge}>
                {totalAgotados} agotado{totalAgotados !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Formulario nuevo plato ───────────────────────────── */}
      <section className={styles.formCard}>
        <h2 className={styles.formTitle}>Añadir plato</h2>
        <form action={crearPlato} className={styles.form}>

          <div className={styles.formGrid}>
            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label htmlFor="nombre" className={styles.label}>Nombre del plato</label>
              <input
                id="nombre" name="nombre" type="text"
                placeholder="Ej: Jamón ibérico"
                required className={styles.input}
              />
            </div>

            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label htmlFor="descripcion" className={styles.label}>Descripción</label>
              <input
                id="descripcion" name="descripcion" type="text"
                placeholder="Breve descripción del plato"
                required className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="precio" className={styles.label}>Precio (€)</label>
              <input
                id="precio" name="precio" type="number"
                placeholder="12.50" step="0.01" min="0"
                required className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="categoria" className={styles.label}>Categoría</label>
              <select id="categoria" name="categoria" required className={styles.select}>
                {Object.entries(CAT_LABEL).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formField} style={{ gridColumn: "span 2" }}>
              <label htmlFor="imagen" className={styles.label}>
                URL de imagen <span className={styles.labelOpt}>(opcional)</span>
              </label>
              <input
                id="imagen" name="imagen" type="url"
                placeholder="https://…"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formFooter}>
            <button type="submit" className={styles.submitBtn}>
              + Añadir plato
            </button>
          </div>
        </form>
      </section>

      {/* ── Grupos por categoría ─────────────────────────────── */}
      {Object.keys(grupos).length === 0 ? (
        <div className={styles.empty}>
          <UtensilsCrossed size={32} strokeWidth={1.25} />
          <p>No hay platos en la carta. Añade el primero arriba.</p>
        </div>
      ) : (
        <div className={styles.grupos}>
          {Object.entries(grupos).map(([cat, items]) => {
            const agotadosEnGrupo = (items as Plato[]).filter((p) => !p.disponible).length;
            return (
              <section key={cat} className={styles.grupo} aria-labelledby={`cat-${cat}`}>

                {/* Cabecera de grupo */}
                <div className={styles.grupoHeader}>
                  <span className={styles.grupoEmoji} aria-hidden="true">
                    {CAT_EMOJI[cat] ?? "🍽️"}
                  </span>
                  <h2 id={`cat-${cat}`} className={styles.grupoTitulo}>
                    {CAT_LABEL[cat] ?? cat}
                  </h2>
                  <span className={styles.grupoCount}>{items.length}</span>
                  {agotadosEnGrupo > 0 && (
                    <span className={styles.grupoAgotados}>
                      {agotadosEnGrupo} agotado{agotadosEnGrupo !== 1 ? "s" : ""}
                    </span>
                  )}
                  <div className={styles.grupoLine} />
                </div>

                {/* Tarjetas de platos */}
                <div className={styles.platosGrid}>
                  {(items as Plato[]).map((p) => (
                    <PlatoCard
                      key={p.id}
                      id={p.id}
                      nombre={p.nombre}
                      descripcion={p.descripcion}
                      precio={p.precio}
                      categoria={p.categoria}
                      disponible={p.disponible}
                      imagen={p.imagen ?? null}
                    />
                  ))}
                </div>

              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
