"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./StickyHeader.module.css";

const NAV_LINKS = [
  { href: "/menu",      label: "carta" },
  { href: "/sobre-nosotros", label: "nosotros" },
  { href: "#galeria",   label: "galería" },
  { href: "#contacto",  label: "contacto" },
];

const SYMBOL = "›";

export default function StickyHeader() {
  const [visible,    setVisible]    = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 245);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={`${styles.header} ${visible ? styles.visible : ""}`}
      aria-label="Cabecera fija"
    >
      <a href="/" className={styles.logoLink} aria-label="Inicio Cruz Blanca">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Cruz Blanca" className={styles.logo} width={170} height={17} />
      </a>

      {/* Desktop nav */}
      <nav className={styles.nav} aria-label="Navegación principal">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className={styles.navLink}>
            <span className={styles.symbol}>{SYMBOL}</span>{l.label}
          </a>
        ))}
        <a href="/reservar" className={styles.reservar}>
          reservar
        </a>
      </nav>

      {/* Hamburger — mobile only */}
      <button
        className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {/* Mobile popup — INSIDE header so position:absolute works correctly */}
      <nav
        className={`${styles.drawer} ${menuOpen ? styles.open : ""}`}
        aria-label="Menú móvil"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={close} className={styles.drawerLink}>
            <span className={styles.symbol}>{SYMBOL}</span>{l.label}
          </a>
        ))}
        <a href="/reservar" onClick={close} className={`${styles.drawerLink} ${styles.drawerReservar}`}>
          reservar
        </a>
      </nav>
    </header>
  );
}
