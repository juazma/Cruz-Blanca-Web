"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DishModal.module.css";

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

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop";

const ALERGENO_MAP: Record<string, { emoji: string; label: string }> = {
  gluten:       { emoji: "🌾", label: "Gluten" },
  lactosa:      { emoji: "🥛", label: "Lactosa" },
  huevo:        { emoji: "🥚", label: "Huevo" },
  marisco:      { emoji: "🦐", label: "Marisco" },
  frutos_secos: { emoji: "🥜", label: "Frutos secos" },
};

// ── COMPONENT ──────────────────────────────────────────────────────────────

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
}

export default function DishModal({ dish, onClose }: DishModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!dish) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [dish, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (dish) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [dish]);

  return (
    <AnimatePresence>
      {dish && (
        <>
          {/* ── OVERLAY ── */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── PANEL ── */}
          {/* Wrapper handles fixed centering; motion.div only animates opacity+y */}
          <div className={styles.panelWrapper}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={dish.nombre}
            className={styles.panel}
            initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, y: 32 }}
            animate={isMobile ? { opacity: 1, y: 0 }      : { opacity: 1, y: 0 }}
            exit={isMobile    ? { opacity: 0, y: "100%" } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Cerrar"
            >
              ×
            </button>

            {/* Image */}
            <div className={styles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dish.imagen || PLACEHOLDER}
                alt={dish.nombre}
                className={styles.img}
              />
            </div>

            {/* Body */}
            <div className={styles.body}>
              {/* Name + price row */}
              <div className={styles.nameRow}>
                <h2 className={styles.name}>{dish.nombre}</h2>
                <span className={styles.price}>
                  {dish.precio.toFixed(2).replace(".", ",")} €
                </span>
              </div>

              {/* Description */}
              <p className={styles.desc}>{dish.descripcion}</p>

              {/* Allergens */}
              {dish.alergenos.length > 0 && (
                <div className={styles.section}>
                  <p className={styles.sectionLabel}>Alérgenos</p>
                  <div className={styles.allergenList}>
                    {dish.alergenos.map((a) => {
                      const info = ALERGENO_MAP[a];
                      if (!info) return null;
                      return (
                        <span key={a} className={styles.allergenBadge}>
                          <span>{info.emoji}</span>
                          <span>{info.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Maridaje */}
              {dish.maridaje && (
                <div className={styles.section}>
                  <p className={styles.sectionLabel}>Maridaje</p>
                  <p className={styles.maridaje}>
                    <span className={styles.maridajeIcon}>🍷</span>
                    {dish.maridaje}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
