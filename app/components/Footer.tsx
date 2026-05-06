"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { href: "/",             label: "Inicio"   },
  { href: "/menu",         label: "Carta"    },
  { href: "/sobre-nosotros", label: "Nosotros" },
  { href: "/reservar",     label: "Reservas" },
];

const LEGAL_LINKS = [
  { href: "/aviso-legal",  label: "Aviso legal"   },
  { href: "/privacidad",   label: "Privacidad"    },
  { href: "/cookies",      label: "Cookies"       },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Parallax: the big wordmark scrolls up slightly slower than the rest
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["6%", "0%"]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  const year = new Date().getFullYear();

  return (
    /* ── footerOuter: sticky bottom so the page slides OVER it ── */
    <div className={styles.footerOuter}>
      <footer
        ref={footerRef}
        className={styles.footer}
        id="contacto"
        aria-label="Pie de página"
      >

        {/* ── GIANT LOGO ──────────────────────────────────── */}
        <div className={styles.wordmarkWrap}>
          <motion.div
            className={styles.wordmarkInner}
            style={{ y: wordmarkY, scale: wordmarkScale }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Cruz Blanca"
              className={styles.wordmarkLogo}
            />
          </motion.div>
        </div>

        {/* ── CENTRAL 2-COL SECTION ───────────────────────── */}
        <div className={styles.central}>

          {/* Left: contact blurb */}
          <div className={styles.centralLeft}>
            <p className={styles.blurb}>
              Si buscas una experiencia gastronómica única en el centro de Lucena,
              estaremos encantados de recibirte en nuestra casa.
            </p>
            <div className={styles.contactBlock}>
              <a href="mailto:info@cruzblancalucena.es" className={styles.contactBig}>
                info@cruzblancalucena.es
              </a>
              <a href="tel:+34957052429" className={styles.contactBig}>
                957 05 24 29
              </a>
              <a href="tel:+34628592552" className={styles.contactMid}>
                628 59 25 52
              </a>
            </div>
          </div>

          {/* Right: schedule */}
          <div className={styles.centralRight}>
            <span className={styles.scheduleLabel}>Horario de apertura</span>
            <p className={styles.scheduleDays}>Lunes – Domingo</p>
            <p className={styles.scheduleHours}>13:00 – 16:30 / 20:00 – 23:30</p>
            <a href="/reservar" className={styles.reservarBtn}>
              Reservar mesa →
            </a>
          </div>

        </div>

        {/* ── BOTTOM BAR ──────────────────────────────────── */}
        <div className={styles.bottom}>
          <nav className={styles.bottomNav} aria-label="Navegación pie de página">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={styles.bottomLink}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className={styles.bottomRight}>
            <nav className={styles.bottomNav} aria-label="Aviso legal">
              {LEGAL_LINKS.map((l) => (
                <a key={l.href} href={l.href} className={styles.bottomLink}>
                  {l.label}
                </a>
              ))}
            </nav>
            <span className={styles.copyright}>
              © {year} Cruz Blanca · Lucena, Córdoba
            </span>
          </div>
        </div>

      </footer>
    </div>
  );
}
