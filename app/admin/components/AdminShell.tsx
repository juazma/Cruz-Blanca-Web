"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import styles from "./AdminShell.module.css";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [isCollapsed,  setIsCollapsed]  = useState(true); // Collapsed by default

  return (
    <div
      className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Floating Sidebar ──────────────────────────────── */}
      <aside
        className={`${styles.sidebarSlot} ${mobileOpen ? styles.sidebarOpen : ""}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <AdminSidebar
          onClose={() => setMobileOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => {}}
        />
      </aside>

      {/* ── Main area ─────────────────────────────────────── */}
      <div className={styles.main}>
        <AdminTopbar onMenuToggle={() => setMobileOpen((o) => !o)} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
