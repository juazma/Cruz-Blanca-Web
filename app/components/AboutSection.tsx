"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
// textRef and inViewText removed — text block now in SobreSection
import styles from "./AboutSection.module.css";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const GALLERY = [
  {
    src: "/images/galeria1.png",
    alt: "Interior del restaurante Cruz Blanca",
    aspect: "tall",
  },
  {
    src: "/images/menu/tostaanchoas.png",
    alt: "Platos de la carta",
    aspect: "wide",
  },
  {
    src: "/images/galeria2.png",
    alt: "Cocina tradicional española",
    aspect: "wide",
  },
  {
    src: "/images/galeria3.png",
    alt: "Ambiente del restaurante",
    aspect: "tall",
  },
  {
    src: "/images/paso3.png",
    alt: "Detalle de mesa",
    aspect: "square",
  },
];

export default function AboutSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inViewGrid = useInView(gridRef, { once: true, amount: 0.15 });

  return (
    <section className={styles.section} id="galeria" aria-label="Galería de imágenes">

      {/* ── MASONRY GRID ───────────────────────────── */}
      <div className={styles.masonry} ref={gridRef} aria-label="Galería">
        {GALLERY.map((img, i) => (
          <motion.div
            key={img.src}
            className={`${styles.masonryItem} ${styles[img.aspect]}`}
            variants={fadeUp}
            custom={i * 0.08}
            initial="hidden"
            animate={inViewGrid ? "visible" : "hidden"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className={styles.masonryImg} loading="lazy" />
          </motion.div>
        ))}
      </div>

    </section>
  );
}
