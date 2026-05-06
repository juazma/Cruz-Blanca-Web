"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import StickyHeader from "./components/StickyHeader";
import LoadingScreen from "./components/LoadingScreen";
import SobreSection from "./components/SobreSection";
import QuizRecomendador from "./components/QuizRecomendador";
import AboutSection from "./components/AboutSection";
import DishOfDay from "./components/DishOfDay";
import MapSection from "./components/MapSection";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const heroRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  /* ── Scroll: logo shrink + fade ────────────────────────── */
  const { scrollY } = useScroll();
  // Scale from 1 → 0.18 (slightly bigger than header logo ~0.16 ratio)
  const logoScale = useTransform(scrollY, [0, 230], [1, 0.18]);
  // Fade out only in the last stretch, already gone when header appears at 240
  const logoOpacity = useTransform(scrollY, [180, 240], [1, 0]);
  const infoOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  /* ── Scroll: hero image parallax ───────────────────────── */
  const { scrollYProgress: photoProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  // More noticeable zoom-out effect
  const photoScale = useTransform(photoProgress, [0, 1], [1.35, 1]);

  return (
    <>
      {/* ── LOADING SCREEN ─────────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <StickyHeader />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className={styles.hero} ref={heroRef} aria-label="Inicio">

        {/* Giant logo — shares layoutId with loading screen logo */}
        <motion.div
          className={styles.logoBlock}
          style={{ opacity: logoOpacity, scale: logoScale }}
        >
          <motion.img
            layoutId="main-logo"
            src="/logo.svg"
            alt="Cruz Blanca"
            className={styles.logoSvg}
            width={477}
            height={47}
          />
        </motion.div>

        {/* Info bar — only visible once loading is done */}
        <motion.div
          className={styles.infoBar}
          style={{ opacity: infoOpacity }}
          initial={{ opacity: 0 }}
          animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className={styles.infoLeft}>
            <p className={styles.tagline}>
              Cocina española de mercado<br />en el corazón de Lucena, Córdoba
            </p>
            <nav className={styles.nav} aria-label="Navegación principal">
              <a href="/menu">› carta</a>
              <a href="/sobre-nosotros">› nosotros</a>
              <a href="#galeria">› galería</a>
              <a href="#contacto">› contacto</a>
            </nav>
          </div>
          <div className={styles.infoRight}>
            <p>Lun – Dom</p>
            <p>13:00 – 16:30</p>
            <p>20:00 – 23:30</p>
            <a href="/reservar" className={styles.reservarHero}>› reservar</a>
          </div>
        </motion.div>
      </section>

      {/* ── HERO IMAGE ─────────────────────────────────────── */}
      <div className={styles.heroImage} ref={photoRef}>
        <motion.div className={styles.heroImageInner} style={{ scale: photoScale }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-home.png"
            alt="Interior de Cruz Blanca"
            className={styles.heroImg}
          />
          <div className={styles.heroImageOverlay} />
        </motion.div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────── */}
      <SobreSection />
      <QuizRecomendador />
      <AboutSection />
      <DishOfDay />
      <MapSection />
    </>
  );
}
