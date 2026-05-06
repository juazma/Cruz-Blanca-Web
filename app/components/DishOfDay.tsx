"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { menuData } from "@/app/data/menuData";
import styles from "./DishOfDay.module.css";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=85&auto=format&fit=crop";

const TAGS = ["Lucena", "Córdoba", "Cocina de mercado", "Tradición", "Temporada"];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: d, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// Selects a dish deterministically by day-of-month
function getDishOfDay() {
  const eligible = (menuData as { categoria: string }[]).filter(
    (d) => d.categoria !== "entrantes" && d.categoria !== "bebidas",
  );
  const index = new Date().getDate() % eligible.length;
  return eligible[index] as {
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
  };
}

export default function DishOfDay() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  // Hydration-safe: compute on client only
  const [dish, setDish] = useState<ReturnType<typeof getDishOfDay> | null>(null);
  useEffect(() => { setDish(getDishOfDay()); }, []);

  // Today's date in Spanish — also client-only to avoid hydration mismatch
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long" }),
    );
  }, []);

  const imgSrc = dish?.imagen || PLACEHOLDER;
  const nombre = dish?.nombre ?? "";
  const descripcion = dish?.descripcion ?? "";
  const precio = dish ? dish.precio.toFixed(2).replace(".", ",") + " €" : "";

  return (
    <section className={styles.section} id="carta" ref={ref} aria-label="Plato del día">
      <div className={styles.inner}>

        {/* ── IMAGE ────────────────────────────────────────── */}
        <motion.div
          className={styles.imageWrap}
          variants={fadeUp} custom={0}
          initial="hidden" animate={inView ? "visible" : "hidden"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={`${nombre} — Cruz Blanca`}
            className={styles.image}
            loading="lazy"
          />
        </motion.div>

        {/* ── CONTENT ──────────────────────────────────────── */}
        <div className={styles.content}>

          <motion.span
            className={styles.eyebrow}
            variants={fadeUp} custom={0.05}
            initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            › Plato del día{today ? ` · ${today}` : ""}
          </motion.span>

          <motion.h2
            className={styles.title}
            variants={fadeUp} custom={0.12}
            initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            {nombre}
          </motion.h2>

          <motion.p
            className={styles.desc}
            variants={fadeUp} custom={0.24}
            initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            {descripcion}
          </motion.p>

          <motion.div
            className={styles.tags}
            variants={fadeUp} custom={0.30}
            initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            {TAGS.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </motion.div>

          <motion.div
            className={styles.footer}
            variants={fadeUp} custom={0.38}
            initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            <div className={styles.priceBlock}>
              <span className={styles.price}>{precio}</span>
              <span className={styles.priceNote}>por comensal · IVA incluido</span>
            </div>
            <a href="/reservar" className={styles.cta}>
              › Reservar mesa
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
