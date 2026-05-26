import { Suspense } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import AfluenciaChart from "@/app/admin/components/AfluenciaChart";
import { getReservasHoy } from "@/app/actions/reservas";
import { getProductos } from "@/app/actions/stock";
import styles from "./admin.module.css";

/* ── Constants ──────────────────────────────────────────────── */
const AFORO_TOTAL = 30; // mesas/reservas máximas por día
const HORA_CORTE  = 17; // antes → comida, desde → cena

const QUICK_ACTIONS = [
  { label: "Nueva reserva",    icon: PlusCircle, href: "/admin/reservas/nueva" },
  { label: "Actualizar carta", icon: BookOpen,   href: "/admin/carta"          },
  { label: "Ver horarios",     icon: Clock,      href: "/admin/horarios"       },
  { label: "Clientes de hoy",  icon: Users,      href: "/admin/reservas"       },
];

/* ── Page ───────────────────────────────────────────────────── */
export default async function AdminOverviewPage() {

  /* Datos en paralelo para no bloquear render */
  const [reservasHoy, todosProductos] = await Promise.all([
    getReservasHoy(),
    getProductos(),
  ]);

  /* Productos con stock <= mínimo (incluyendo agotados) */
  const productosAlerta = todosProductos.filter(p => p.cantidad <= p.stockMinimo);

  /* Derivados de reservas */
  const totalReservas  = reservasHoy.length;
  const reservasComida = reservasHoy.filter(r => new Date(r.fechaHora).getHours() < HORA_CORTE);
  const reservasCena   = reservasHoy.filter(r => new Date(r.fechaHora).getHours() >= HORA_CORTE);
  const porcentajeAforo = Math.min(Math.round((totalReservas / AFORO_TOTAL) * 100), 100);
  const mesasLibres     = Math.max(AFORO_TOTAL - totalReservas, 0);

  return (
    <div className={styles.grid}>

      {/* ══════════════════════════════════════════════════════
          CAJA 1 — Gráfico de afluencia
      ══════════════════════════════════════════════════════ */}
      <div className={`${styles.card} ${styles.cardAfluencia}`}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Afluencia semanal</h2>
            <p className={styles.cardSubtitle}>Clientes atendidos esta semana</p>
          </div>
          <div className={`${styles.iconBadge} ${styles.iconGreen}`}>
            <TrendingUp size={18} strokeWidth={2} />
          </div>
        </div>

        <div className={styles.chartWrap}>
          <Suspense fallback={<div className={styles.chartFallback} />}>
            <AfluenciaChart />
          </Suspense>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>551</span>
            <span className={styles.statLabel}>Total semana</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={`${styles.statNum} ${styles.statGreen}`}>+12%</span>
            <span className={styles.statLabel}>vs semana anterior</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>118</span>
            <span className={styles.statLabel}>Récord del sábado</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CAJA 2 — Reservas de hoy (datos reales)
      ══════════════════════════════════════════════════════ */}
      <Link href="/admin/reservas" className={`${styles.card} ${styles.cardSmall}`}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.cardSubtitle}>Reservas para hoy</p>
            <span className={styles.bigNumber}>{totalReservas}</span>
          </div>
          <div className={`${styles.iconBadge} ${styles.iconGreen}`}>
            <CalendarCheck size={20} strokeWidth={1.75} />
          </div>
        </div>

        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div
              className={`${styles.progressBar} ${styles.progressGreen}`}
              style={{ width: `${porcentajeAforo}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {porcentajeAforo}% de aforo · {mesasLibres} mesa{mesasLibres !== 1 ? "s" : ""} libre{mesasLibres !== 1 ? "s" : ""}
          </span>
        </div>

        <div className={styles.tagRow}>
          <span className={`${styles.tag} ${styles.tagGreen}`}>
            {reservasComida.length} comida
          </span>
          <span className={`${styles.tag} ${styles.tagGreen}`}>
            {reservasCena.length} cena
          </span>
        </div>
      </Link>

      {/* ══════════════════════════════════════════════════════
          CAJA 3 — Alertas de stock (datos reales)
      ══════════════════════════════════════════════════════ */}
      <Link href="/admin/inventario" className={`${styles.card} ${styles.cardSmall}`}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.cardSubtitle}>Alertas de stock</p>
            <span className={`${styles.bigNumber} ${styles.bigNumberRed}`}>
              {productosAlerta.length}
            </span>
          </div>
          <div className={`${styles.iconBadge} ${styles.iconRed}`}>
            <AlertTriangle size={20} strokeWidth={1.75} />
          </div>
        </div>

        <ul className={styles.alertList} role="list">
          {productosAlerta.slice(0, 4).map((p) => (
            <li key={p.id} className={styles.alertItem}>
              <span className={styles.alertDot} aria-hidden="true" />
              <span className={styles.alertName}>{p.nombre}</span>
              <span className={styles.alertCount}>{p.cantidad} ud.</span>
            </li>
          ))}
          {productosAlerta.length === 0 && (
            <li className={styles.alertItem}>
              <span className={styles.alertName} style={{ color: "var(--adm-green-fg)" }}>
                ✓ Todo el stock en orden
              </span>
            </li>
          )}
        </ul>
      </Link>

      {/* ══════════════════════════════════════════════════════
          CAJA 4 — Accesos rápidos
      ══════════════════════════════════════════════════════ */}
      <div className={`${styles.card} ${styles.cardAccesos}`}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Accesos rápidos</h2>
            <p className={styles.cardSubtitle}>Gestión frecuente</p>
          </div>
        </div>

        <div className={styles.pillGrid}>
          {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
            <a key={href} href={href} className={styles.pill}>
              <Icon size={15} strokeWidth={2} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
