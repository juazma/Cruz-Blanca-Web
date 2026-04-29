"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StickyHeader from "@/app/components/StickyHeader";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

// ── SWAP THIS PATH for your own image ─────────────────────────────────────
const HERO_IMAGE = "/images/menu/pulpo.png";

const EYEBROW  = "› Nuestra forma de entender la mesa";
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

      {/* ── INFO SECTION ──────────────────────────────────────── */}
      <section className={styles.infoSection}>
        <div className={styles.infoInner}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCol}>
              <span className={styles.infoLabel}>Dirección</span>
              <p>C. San Francisco, 85</p>
              <p>14900 Lucena, Córdoba</p>
            </div>
            <div className={styles.infoCol}>
              <span className={styles.infoLabel}>Teléfono</span>
              <a href="tel:+34957052429" className={styles.infoLink}>957 05 24 29</a>
              <a href="tel:+34628592552" className={styles.infoLink}>628 59 25 52</a>
            </div>
            <div className={styles.infoCol}>
              <span className={styles.infoLabel}>Horario</span>
              <p>Lun – Dom</p>
              <p>13:00 – 16:30 · 20:00 – 23:30</p>
            </div>
            <div className={styles.infoCol}>
              <span className={styles.infoLabel}>Reservas</span>
              <a href="/reservar" className={styles.infoLink}>Reservar mesa →</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
