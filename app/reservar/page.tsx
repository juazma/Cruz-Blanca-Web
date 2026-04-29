"use client";

import { useState } from "react";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

type Status = "idle" | "sent";

export default function ReservarPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    comensales: "2",
    fecha: "",
    hora: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sent");
  };

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.page}>

      {/* ── LEFT — image ─────────────────────────────────── */}
      <div className={styles.imageCol}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&auto=format&fit=crop"
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
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  className={styles.input}
                  placeholder="Juan García"
                  value={form.nombre}
                  onChange={set("nombre")}
                  required
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="telefono">Teléfono</label>
                <input
                  id="telefono"
                  type="tel"
                  className={styles.input}
                  placeholder="+34 600 000 000"
                  value={form.telefono}
                  onChange={set("telefono")}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="comensales">Comensales</label>
                  <select
                    id="comensales"
                    className={styles.select}
                    value={form.comensales}
                    onChange={set("comensales")}
                    required
                  >
                    {[1,2,3,4,5,6,7,8].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>
                    ))}
                    <option value="9+">Más de 8</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fecha">Fecha</label>
                  <input
                    id="fecha"
                    type="date"
                    className={styles.input}
                    value={form.fecha}
                    onChange={set("fecha")}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="hora">Hora</label>
                <select
                  id="hora"
                  className={styles.select}
                  value={form.hora}
                  onChange={set("hora")}
                  required
                >
                  <option value="" disabled>Selecciona una hora</option>
                  <optgroup label="Comida">
                    {["13:00","13:30","14:00","14:30","15:00","15:30","16:00"].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Cena">
                    {["20:00","20:30","21:00","21:30","22:00","22:30","23:00"].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <button type="submit" className={styles.submit}>
                Reservar mesa
              </button>

              <p className={styles.legal}>
                Al hacer clic en "Reservar mesa" aceptas nuestra{" "}
                <a href="#">política de privacidad</a>.
              </p>

            </form>
          )}
        </div>
      </div>

    </div>
    <Footer />
    </div>
  );
}
