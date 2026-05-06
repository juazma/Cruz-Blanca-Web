"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StickyHeader from "@/app/components/StickyHeader";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import styles from "./page.module.css";

// ── SWAP THIS PATH for your own image ─────────────────────────────────────
const HERO_IMAGE = "/images/menu/pulpo.png";

const EYEBROW  = "› Nuestra forma de entender la mesa";

const VALORES = [
  {
    imagen: "/images/galeria1.png",
    titulo: "Producto Local",
    texto: "Trabajamos de la mano con proveedores de la zona para asegurar que a tu mesa solo llegue lo más fresco. El respeto por la materia prima es innegociable.",
  },
  {
    imagen: "/images/galeria2.png",
    titulo: "Cocina Honesta",
    texto: "Sin artificios ni atajos. Nuestras recetas se basan en el recetario tradicional andaluz, dándole a cada guiso el tiempo y el cariño que merece.",
  },
  {
    imagen: "/images/galeria3.png",
    titulo: "Trato Cercano",
    texto: "Cruzar nuestras puertas es entrar en nuestra casa. Nos esforzamos cada día en ofrecerte un servicio atento, cálido y profesional en cada visita.",
  },
];
const HEADLINE = "Seleccionamos cada ingrediente con la máxima exigencia para ofrecerte una cocina honesta, fresca y memorable.";

// ── PAGE ───────────────────────────────────────────────────────────────────

export default function SobreNosotrosPage() {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Reveal starts at 8% scroll progress, finishes at 72%
  const clipInset = useTransform(
    scrollYProgress,
    [0.08, 0.72],
    ["100%", "0%"],
  );
  const clipPath = useTransform(clipInset, (v) => `inset(${v} 0px 0px 0px)`);

  const imgStyle = {
    backgroundImage: `url('${HERO_IMAGE}')`,
    backgroundSize: "cover" as const,
    backgroundPosition: "center" as const,
    backgroundAttachment: "fixed" as const,
  };

  return (
    <>
      <StickyHeader />

      {/* ── SCROLL TRACK ──────────────────────────────────── */}
      <div ref={trackRef} className={styles.scrollTrack}>
        <div className={styles.sticky}>

          {/* ── LAYER 2: Text — image visible through letterforms ── */}
          <div className={styles.textLayer}>
            <span className={styles.eyebrow}>{EYEBROW}</span>
            <h1
              className={styles.headline}
              style={imgStyle}
              aria-label={HEADLINE}
            >
              {HEADLINE}
            </h1>
          </div>

          {/* ── LAYER 3: Full image + overlay + white text — slides up ── */}
          <motion.div
            className={styles.imageReveal}
            style={{ ...imgStyle, clipPath }}
            aria-hidden="true"
          >
            {/* Dark overlay for contrast */}
            <div className={styles.overlay} />

            {/* Content on top of overlay */}
            <div className={styles.revealContent}>
              <span className={styles.eyebrowLight}>{EYEBROW}</span>
              <p className={styles.headlineLight}>{HEADLINE}</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── VALORES ───────────────────────────────────────────── */}
      <section className={styles.valoresSection}>
        <div className={styles.valoresInner}>
          {VALORES.map((v, i) => (
            <motion.div
              key={v.titulo}
              className={styles.valorCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.valorImgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.imagen} alt={v.titulo} className={styles.valorImg} loading="lazy" />
              </div>
              <h3 className={styles.valorTitulo}>{v.titulo}</h3>
              <p className={styles.valorTexto}>{v.texto}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIOS ───────────────────────────────────────── */}
      <TestimonialsSection />
    </>
  );
}
