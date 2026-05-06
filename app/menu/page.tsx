"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuData, categorias } from "@/app/data/menuData";
import StickyHeader from "@/app/components/StickyHeader";
import DishModal from "@/app/components/DishModal";
import styles from "./page.module.css";

// ── TYPES ──────────────────────────────────────────────────────────────────

type Dish = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  alergenos: string[];
  maridaje?: string;
  tags: { saciedad: string; sabor: string[]; base: string; ocasion: string };
};

type Categoria = { id: string; label: string };

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&auto=format&fit=crop";

const ALERGENO_ICON: Record<string, string> = {
  gluten:       "🌾",
  lactosa:      "🥛",
  huevo:        "🥚",
  marisco:      "🦐",
  frutos_secos: "🥜",
};

const FILTERS = [
  { id: "todos",   label: "Todos",          emoji: "" },
  { id: "gluten",  label: "Sin gluten",     emoji: "🌾" },
  { id: "lactosa", label: "Sin lactosa",    emoji: "🥛" },
  { id: "huevo",   label: "Sin huevo",      emoji: "🥚" },
  { id: "marisco", label: "Sin marisco",    emoji: "🦐" },
  { id: "vegetal", label: "Vegetariano",    emoji: "🥗" },
];

// ── DISH CARD ──────────────────────────────────────────────────────────────

function DishCard({ dish, onOpen }: { dish: Dish; onOpen: (d: Dish) => void }) {
  const imgSrc = dish.imagen || PLACEHOLDER;

  return (
    <article
      className={styles.card}
      onClick={() => onOpen(dish)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(dish); }}
      aria-label={`Ver detalles de ${dish.nombre}`}
    >
      <div className={styles.cardImgWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={dish.nombre}
          className={styles.cardImg}
          loading="lazy"
        />
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardName}>{dish.nombre}</p>
        <p className={styles.cardDesc}>{dish.descripcion}</p>
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>
            {dish.precio.toFixed(2).replace(".", ",")} €
          </span>
          {dish.alergenos.length > 0 && (
            <div className={styles.badges}>
              {dish.alergenos.map((a) =>
                ALERGENO_ICON[a] ? (
                  <span key={a} className={styles.badge} title={a}>
                    {ALERGENO_ICON[a]}
                  </span>
                ) : null,
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [activeFilter,   setActiveFilter]   = useState("todos");
  const [activeCategory, setActiveCategory] = useState((categorias as Categoria[])[0].id);
  const [selectedDish,   setSelectedDish]   = useState<Dish | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Filtered dishes per category
  function getFiltered(catId: string): Dish[] {
    return (menuData as Dish[]).filter((d) => {
      if (d.categoria !== catId) return false;
      if (activeFilter === "todos")   return true;
      if (activeFilter === "vegetal") return d.tags.base === "verdura";
      return !d.alergenos.includes(activeFilter);
    });
  }

  // IntersectionObserver: track which section is visible
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-cat") ?? "";
            if (id) setActiveCategory(id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const setRef = useCallback((catId: string) => (el: HTMLElement | null) => {
    sectionRefs.current[catId] = el;
    if (el) observerRef.current?.observe(el);
  }, []);

  function scrollToCategory(catId: string) {
    const el = sectionRefs.current[catId];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const cats = categorias as Categoria[];

  return (
    <>
      <StickyHeader />

      <div className={styles.page}>

        {/* ── PAGE HEADER ──────────────────────────────────── */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Carta</h1>
          <p className={styles.pageSubtitle}>
            Cocina española de mercado,<br />Lucena.
          </p>
        </header>

        <div className={styles.divider} />

        {/* ── MAIN LAYOUT ──────────────────────────────────── */}
        <div className={styles.layout}>

          {/* ── SIDEBAR — Desktop: sticky / Mobile: tabs ── */}
          <nav className={styles.sidebar} aria-label="Categorías">
            {/* Mobile: horizontal tabs */}
            <div className={styles.mobileTabs}>
              {cats.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.mobileTab} ${activeCategory === cat.id ? styles.mobileTabActive : ""}`}
                  onClick={() => scrollToCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Desktop: vertical list */}
            <ul className={styles.catList}>
              {cats.map((cat) => {
                const count = getFiltered(cat.id).length;
                const active = activeCategory === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      className={`${styles.catLink} ${active ? styles.catLinkActive : ""}`}
                      onClick={() => scrollToCategory(cat.id)}
                      disabled={count === 0}
                    >
                      <span className={styles.catArrow}>›</span>
                      <span>{cat.label}</span>
                      {count === 0 && (
                        <span className={styles.catEmpty}>—</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── RIGHT COLUMN ─────────────────────────────── */}
          <div className={styles.content}>

            {/* FILTER BAR */}
            <div className={styles.filterBar}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`${styles.filterBtn} ${activeFilter === f.id ? styles.filterActive : ""}`}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.emoji && <span>{f.emoji}</span>}
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            {/* CATEGORY SECTIONS */}
            {cats.map((cat) => {
              const dishes = getFiltered(cat.id);
              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  data-cat={cat.id}
                  ref={setRef(cat.id)}
                  className={styles.catSection}
                >
                  <h2 className={styles.catHeading}>{cat.label}</h2>

                  <div className={styles.grid}>
                    <AnimatePresence mode="popLayout">
                      {dishes.length > 0 ? (
                        dishes.map((dish) => (
                          <motion.div
                            key={dish.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <DishCard dish={dish} onOpen={setSelectedDish} />
                          </motion.div>
                        ))
                      ) : (
                        <motion.p
                          key="empty"
                          className={styles.emptyMsg}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Ningún plato en esta categoría cumple los filtros seleccionados.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </section>
              );
            })}

          </div>
        </div>
      </div>

      {/* ── DISH MODAL ───────────────────────────────────── */}
      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </>
  );
}
