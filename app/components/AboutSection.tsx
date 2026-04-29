"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
// textRef and inViewText removed — text block now in SobreSection
import styles from "./AboutSection.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
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
    src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=900&q=80&auto=format&fit=crop",
    alt: "Cocina tradicional española",
    aspect: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop",
    alt: "Ambiente del restaurante",
    aspect: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1482275548304-a58859dc31b7?w=900&q=80&auto=format&fit=crop",
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
