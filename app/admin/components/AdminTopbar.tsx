"use client";

import { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";
import styles from "./AdminTopbar.module.css";

interface Props {
  onMenuToggle: () => void;
}

export default function AdminTopbar({ onMenuToggle }: Props) {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  return (
    <header className={styles.topbar}>

      {/* ── Left: hamburger (mobile) + greeting ───────────── */}
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={onMenuToggle}
          aria-label="Abrir menú lateral"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        <div className={styles.greeting}>
          <span className={styles.greetingText}>Hola, Admin</span>
          {dateStr && (
            <span className={styles.greetingDate}>
              {/* Capitalise first letter */}
              {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* ── Right: notifications + avatar ─────────────────── */}
      <div className={styles.right}>

        {/* Bell */}
        <button className={styles.iconBtn} aria-label="Notificaciones">
          <Bell size={18} strokeWidth={1.75} />
          {/* Badge */}
          <span className={styles.badge} aria-hidden="true">2</span>
        </button>

        {/* Avatar */}
        <div className={styles.avatar} aria-hidden="true">
          A
        </div>

      </div>
    </header>
  );
}
