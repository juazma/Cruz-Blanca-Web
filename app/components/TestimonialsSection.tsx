"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TestimonialsSection.module.css";

// ── DATA ───────────────────────────────────────────────────────────────────

const REVIEWS = [
  {
    author: "J. Aguilera",
    text: "Restaurante muy acogedor. Tiene un buen menú y una amplia carta. Los platos exquisitos y el trato muy agradable y profesional. Muy recomendable.",
  },
  {
    author: "J.J Romero",
    text: "Comida espectacular y la atención perfecta, no se puede pedir más.",
  },
  {
    author: "F. Sotomayor",
    text: "Sitio bastante barato y con una buena calidad de comida. Estuvimos cenando y se esta muy a gusto. La comida sale a su hora y no viene toda del tirón, lo cual se agradece.",
  },
  {
    author: "S. Panadero",
    text: "Nos quedamos sorprendidos por la cantidad. Las raciones son bastante abundantes, y de buena calidad. El local es bastante bonito y el trato fue bueno. Repetiremos.",
  },
];

// ── COMPONENT ──────────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const total = REVIEWS.length;

  function goTo(index: number, dir: number) {
    setDirection(dir);
    setCurrent((index + total) % total);
  }

  const prev = () => goTo(current - 1, -1);
  const next = () => goTo(current + 1,  1);

  // Slide variants: enter from right if forward, from left if back
  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d * 40, filter: "blur(6px)" }),
    center: {             opacity: 1, x: 0,          filter: "blur(0px)" },
    exit:   (d: number) => ({ opacity: 0, x: d * -40, filter: "blur(6px)" }),
  };

  return (
    <section className={styles.section} aria-label="Testimonios">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className={styles.header}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          › Testimonios
        </motion.span>

        {/* Blur-in title — the signature effect */}
        <motion.h2
          className={styles.title}
          initial={{ filter: "blur(15px)", opacity: 0, scale: 1.08 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Hablan nuestros clientes
        </motion.h2>
      </div>

      {/* ── CAROUSEL ─────────────────────────────────────────── */}
      <div className={styles.carousel}>

        {/* Prev arrow */}
        <button
          className={styles.arrow}
          onClick={prev}
          aria-label="Reseña anterior"
        >
          ‹
        </button>

        {/* Review card */}
        <div className={styles.cardWrap} aria-live="polite">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              className={styles.card}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={styles.author}>{REVIEWS[current].author}</p>
              <blockquote className={styles.quote}>
                {REVIEWS[current].text}
              </blockquote>
              <div className={styles.rating}>
                <span className={styles.star} aria-hidden="true">★</span>
                <span>Valoración 5/5</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next arrow */}
        <button
          className={styles.arrow}
          onClick={next}
          aria-label="Reseña siguiente"
        >
          ›
        </button>

      </div>

      {/* ── DOTS ─────────────────────────────────────────────── */}
      <div className={styles.dots} role="tablist" aria-label="Navegar entre reseñas">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Reseña ${i + 1}`}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i, i > current ? 1 : -1)}
          />
        ))}
      </div>

    </section>
  );
}
