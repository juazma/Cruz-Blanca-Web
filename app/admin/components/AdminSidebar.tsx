"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  Package,
  Clock,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import styles from "./AdminSidebar.module.css";

const NAV = [
  { href: "/admin",            label: "Resumen",    icon: LayoutDashboard },
  { href: "/admin/reservas",   label: "Reservas",   icon: CalendarCheck   },
  { href: "/admin/carta",      label: "Carta",      icon: UtensilsCrossed },
  { href: "/admin/inventario", label: "Inventario", icon: Package         },
  { href: "/admin/horarios",   label: "Horarios",   icon: Clock           },
];

interface Props {
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ onClose, isCollapsed, onToggleCollapse }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
      aria-label="Navegación del gestor"
    >

      {/* ══════════════════════════════════════════════════════
          HEADER — logo + close (mobile)
      ══════════════════════════════════════════════════════ */}
      <div className={styles.header}>

        {/* Logo — hidden when collapsed */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Cruz Blanca"
          className={styles.logo}
          aria-hidden={isCollapsed}
        />

        {/* Mobile: X button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar menú"
          tabIndex={isCollapsed ? -1 : 0}
        >
          <X size={17} />
        </button>

      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION LABEL — fades out when collapsed
      ══════════════════════════════════════════════════════ */}
      <span className={styles.sectionLabel} aria-hidden={isCollapsed}>
        Menú principal
      </span>

      {/* ══════════════════════════════════════════════════════
          NAV LINKS
      ══════════════════════════════════════════════════════ */}
      <ul className={styles.navList} role="list">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navItem} ${active ? styles.active : ""}`}
                onClick={onClose}
                title={isCollapsed ? label : undefined}
              >
                <span className={styles.iconWrap}>
                  <Icon size={20} strokeWidth={1.75} />
                </span>

                {/* Text fades out — always in DOM for smooth transition */}
                <span className={styles.navLabel} aria-hidden={isCollapsed}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── Spacer ────────────────────────────────────────── */}
      <div className={styles.spacer} />

      {/* ── Divider ───────────────────────────────────────── */}
      <div className={styles.divider} />

      {/* ══════════════════════════════════════════════════════
          LOGOUT
      ══════════════════════════════════════════════════════ */}
      <form action={logout} className={styles.logoutForm}>
        <button
          type="submit"
          className={styles.logoutBtn}
          title={isCollapsed ? "Cerrar sesión" : undefined}
        >
          <span className={styles.iconWrap}>
            <LogOut size={20} strokeWidth={1.75} />
          </span>
          <span className={styles.navLabel} aria-hidden={isCollapsed}>
            Cerrar sesión
          </span>
        </button>
      </form>

    </nav>
  );
}
