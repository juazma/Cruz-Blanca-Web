"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { getDisponibilidad, enviarReservaPublica } from "@/app/actions/reservas";
import type { DisponibilidadResult } from "@/app/actions/reservas";
import styles from "./page.module.css";

// ── Slots disponibles ──────────────────────────────────────────

const SLOTS_COMIDA = ["13:00","13:30","14:00","14:30","15:00","15:30","16:00"];
const SLOTS_CENA   = ["20:00","20:30","21:00","21:30","22:00","22:30","23:00"];

// ── Types ──────────────────────────────────────────────────────

type Status = "idle" | "sending" | "sent" | "error";

// ── Page ───────────────────────────────────────────────────────

export default function ReservarPage() {
  const [status,          setStatus]          = useState<Status>("idle");
  const [errorMsg,        setErrorMsg]        = useState("");
  const [disponibilidad,  setDisponibilidad]  = useState<DisponibilidadResult | null>(null);
  const [loadingDisp,     setLoadingDisp]     = useState(false);
  const [isPending,       startTransition]    = useTransition();

  const [form, setForm] = useState({
    nombre:     "",
    telefono:   "",
    comensales: "2",
    fecha:      "",
    hora:       "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Consultar disponibilidad cada vez que cambia la fecha
  useEffect(() => {
    if (!form.fecha) {
      setDisponibilidad(null);
      return;
    }
    setLoadingDisp(true);
    getDisponibilidad(form.fecha).then((disp) => {
      setDisponibilidad(disp);
      setLoadingDisp(false);
      // Si la hora elegida queda bloqueada u ocupada, la reseteamos
      if (!disp.bloqueadoCompleto) {
        const horaActual = form.hora;
        const estaBloqueada = horaActual in disp.horasBloqueadas;
        const estaOcupada   = disp.horasOcupadas.includes(horaActual);
        if (estaBloqueada || estaOcupada) {
          setForm((f) => ({ ...f, hora: "" }));
        }
      } else {
        // Día completo bloqueado → limpiar hora
        setForm((f) => ({ ...f, hora: "" }));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.fecha]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    setErrorMsg("");
    startTransition(async () => {
      setStatus("sending");
      try {
        const result = await enviarReservaPublica(formData);
        if ("success" in result && result.success) {
          setStatus("sent");
        } else if ("error" in result) {
          setErrorMsg(result.error);
          setStatus("error");
        }
      } catch {
        setErrorMsg("Ha ocurrido un error inesperado. Inténtalo de nuevo.");
        setStatus("error");
      }
    });
  };

  const isSending = isPending || status === "sending";

  // Helpers de disponibilidad
  const bloqueadoCompleto = disponibilidad?.bloqueadoCompleto === true;
  const mensajeBloqueo    = bloqueadoCompleto
    ? (disponibilidad as Extract<DisponibilidadResult, { bloqueadoCompleto: true }>).mensaje
    : "";
  const horasOcupadas     = (!bloqueadoCompleto && disponibilidad)
    ? (disponibilidad as Extract<DisponibilidadResult, { bloqueadoCompleto: false }>).horasOcupadas
    : [];
  const horasBloqueadas   = (!bloqueadoCompleto && disponibilidad)
    ? (disponibilidad as Extract<DisponibilidadResult, { bloqueadoCompleto: false }>).horasBloqueadas
    : {} as Record<string, string>;

  const slotDeshabilitado = (h: string) =>
    horasOcupadas.includes(h) || h in horasBloqueadas;

  const slotLabel = (h: string): string => {
    if (horasOcupadas.includes(h))  return `${h} (Completo)`;
    if (h in horasBloqueadas)       return `${h} (No disponible)`;
    return h;
  };

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.page}>

      {/* ── LEFT — image ─────────────────────────────────── */}
      <div className={styles.imageCol}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/galeria3.png"
          alt="Reservar mesa en Cruz Blanca"
          className={styles.image}
        />
        <div className={styles.imageOverlay} />
        <div className={styles.imageMeta}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cream.svg" alt="Cruz Blanca" className={styles.imageLogo} />
          <p className={styles.imageAddress}>
            C. San Francisco, 85 · Lucena, Córdoba
          </p>
        </div>
      </div>

      {/* ── RIGHT — form ─────────────────────────────────── */}
      <div className={styles.formCol}>
        <div className={styles.formWrap}>

          <a href="/" className={styles.back}>← Volver</a>

          <div className={styles.heading}>
            <span className={styles.eyebrow}>› Reservas</span>
            <h1 className={styles.title}>Reservar<br /><em>una mesa</em></h1>
          </div>

          {/* ── Pantalla de confirmación ─────────────────── */}
          {status === "sent" ? (
            <div className={styles.confirmation}>
              <p className={styles.confirmIcon}>✓</p>
              <h2 className={styles.confirmTitle}>¡Reserva recibida!</h2>
              <p className={styles.confirmText}>
                Nos pondremos en contacto contigo en breve para confirmar
                tu reserva. Si tienes alguna duda, llámanos al{" "}
                <a href="tel:+34957052429">957 05 24 29</a>.
              </p>
              <a href="/" className={styles.confirmBack}>Volver a inicio</a>
            </div>

          ) : (

            /* ── Formulario ──────────────────────────────── */
            <form
              ref={formRef}
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.field}>
                <label className={styles.label} htmlFor="nombre">Nombre</label>
                <input
                  id="nombre" name="nombre" type="text"
                  className={styles.input}
                  placeholder="Juan García"
                  value={form.nombre}
                  onChange={set("nombre")}
                  required autoComplete="name"
                  disabled={isSending}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="telefono">Teléfono</label>
                <input
                  id="telefono" name="telefono" type="tel"
                  className={styles.input}
                  placeholder="+34 600 000 000"
                  value={form.telefono}
                  onChange={set("telefono")}
                  required autoComplete="tel"
                  disabled={isSending}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="comensales">Comensales</label>
                  <select
                    id="comensales" name="comensales"
                    className={styles.select}
                    value={form.comensales}
                    onChange={set("comensales")}
                    required disabled={isSending}
                  >
                    {[1,2,3,4,5,6,7,8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "persona" : "personas"}
                      </option>
                    ))}
                    <option value="9+">Más de 8</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fecha">Fecha</label>
                  <input
                    id="fecha" name="fecha" type="date"
                    className={styles.input}
                    value={form.fecha}
                    onChange={set("fecha")}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    disabled={isSending}
                  />
                </div>
              </div>

              {/* ── Bloqueo de día completo ───────────────── */}
              {form.fecha && bloqueadoCompleto && (
                <div className={styles.bloqueoDiaCard}>
                  <span className={styles.bloqueoDiaIcon}>🔒</span>
                  <div className={styles.bloqueoDiaText}>
                    <strong>No disponible</strong>
                    <span>{mensajeBloqueo}</span>
                  </div>
                </div>
              )}

              {/* ── Selector de hora (oculto si día bloqueado) ── */}
              {!bloqueadoCompleto && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="hora">
                    Hora
                    {loadingDisp && <span className={styles.aforoHint}> · Comprobando…</span>}
                    {!loadingDisp && form.fecha && Object.keys(horasBloqueadas).length > 0 && (
                      <span className={styles.aforoHint}> · Algunos horarios no disponibles</span>
                    )}
                    {!loadingDisp && form.fecha && horasOcupadas.length > 0 && (
                      <span className={styles.aforoHint}> · Algunas horas sin aforo</span>
                    )}
                  </label>
                  <select
                    id="hora" name="hora"
                    className={styles.select}
                    value={form.hora}
                    onChange={set("hora")}
                    required
                    disabled={isSending || loadingDisp}
                  >
                    <option value="" disabled>Selecciona una hora</option>
                    <optgroup label="Comida">
                      {SLOTS_COMIDA.map((h) => (
                        <option key={h} value={h} disabled={slotDeshabilitado(h)}>
                          {slotLabel(h)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Cena">
                      {SLOTS_CENA.map((h) => (
                        <option key={h} value={h} disabled={slotDeshabilitado(h)}>
                          {slotLabel(h)}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Mensaje del bloqueo de la hora elegida */}
                  {form.hora && form.hora in horasBloqueadas && (
                    <p className={styles.horaBloqueoMsg}>
                      {horasBloqueadas[form.hora]}
                    </p>
                  )}
                </div>
              )}

              {/* Mensaje de error */}
              {status === "error" && errorMsg && (
                <p className={styles.errorMsg} role="alert">{errorMsg}</p>
              )}

              {/* Botón — oculto si el día está bloqueado */}
              {!bloqueadoCompleto && (
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={isSending}
                >
                  {isSending ? "Enviando…" : "Reservar mesa"}
                </button>
              )}

              <p className={styles.legal}>
                Al hacer clic en "Reservar mesa" aceptas nuestra{" "}
                <a href="/politica-privacidad">política de privacidad</a>.
              </p>

            </form>
          )}
        </div>
      </div>

    </div>
    </div>
  );
}
