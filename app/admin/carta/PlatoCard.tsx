"use client";

import { useState, useTransition, useRef } from "react";
import { Trash2, Loader2, Eye, EyeOff, Pencil, Check, X } from "lucide-react";
import { eliminarPlato, toggleDisponibilidad, editarPlato } from "@/app/actions/carta";
import styles from "./carta.module.css";

/* ── CAT_LABEL para el select de edición ─────────────────────── */
const CATEGORIAS = [
  { id: "entrantes", label: "Para empezar"     },
  { id: "primeros",  label: "Primeros platos"  },
  { id: "pescados",  label: "Pescados"         },
  { id: "carnes",    label: "Carnes"           },
  { id: "postres",   label: "Postres"          },
  { id: "bebidas",   label: "Vinos y bebidas"  },
];

interface Props {
  id:          string;
  nombre:      string;
  descripcion: string;
  precio:      number;
  categoria:   string;
  disponible:  boolean;
  imagen:      string | null;
}

export default function PlatoCard({
  id, nombre, descripcion, precio, categoria, disponible, imagen,
}: Props) {
  const [isEditing,    setIsEditing]    = useState(false);
  const [pendingToggle, startToggle]    = useTransition();
  const [pendingDelete, startDelete]    = useTransition();
  const [pendingSave,   startSave]      = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const isPending = pendingToggle || pendingDelete || pendingSave;

  const handleToggle = () => startToggle(() => toggleDisponibilidad(id));

  const handleDelete = () => {
    if (!confirm(`¿Eliminar "${nombre}" de la carta?`)) return;
    startDelete(() => eliminarPlato(id));
  };

  const handleSave = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startSave(async () => {
      await editarPlato(id, formData);
      setIsEditing(false);
    });
  };

  const handleCancel = () => setIsEditing(false);

  /* ── MODO EDICIÓN ────────────────────────────────────────────── */
  if (isEditing) {
    return (
      <article
        className={`${styles.platoCard} ${styles.platoCardEditing} ${pendingSave ? styles.platoCardPending : ""}`}
      >
        <form ref={formRef} className={styles.editForm} onSubmit={(e) => e.preventDefault()}>

          {/* Nombre */}
          <div className={styles.editField}>
            <label className={styles.editLabel}>Nombre</label>
            <input
              name="nombre"
              defaultValue={nombre}
              required
              className={styles.editInput}
              placeholder="Nombre del plato"
            />
          </div>

          {/* Descripción */}
          <div className={styles.editField}>
            <label className={styles.editLabel}>Descripción</label>
            <input
              name="descripcion"
              defaultValue={descripcion}
              required
              className={styles.editInput}
              placeholder="Breve descripción"
            />
          </div>

          {/* Precio + Categoría en fila */}
          <div className={styles.editRow}>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Precio (€)</label>
              <input
                name="precio"
                type="number"
                defaultValue={precio}
                step="0.01"
                min="0"
                required
                className={styles.editInput}
              />
            </div>

            <div className={styles.editField}>
              <label className={styles.editLabel}>Categoría</label>
              <select name="categoria" defaultValue={categoria} className={styles.editSelect}>
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Imagen */}
          <div className={styles.editField}>
            <label className={styles.editLabel}>Imagen <span className={styles.editLabelOpt}>(ruta o URL)</span></label>
            <input
              name="imagen"
              defaultValue={imagen ?? ""}
              className={styles.editInput}
              placeholder="/images/menu/plato.png o https://…"
            />
          </div>

          {/* Botones guardar / cancelar */}
          <div className={styles.editActions}>
            <button
              type="button"
              className={styles.editCancelBtn}
              onClick={handleCancel}
              disabled={pendingSave}
            >
              <X size={13} strokeWidth={2.5} />
              <span>Cancelar</span>
            </button>

            <button
              type="button"
              className={styles.editSaveBtn}
              onClick={handleSave}
              disabled={pendingSave}
            >
              {pendingSave
                ? <Loader2 size={13} className={styles.spin} />
                : <Check size={13} strokeWidth={2.5} />
              }
              <span>{pendingSave ? "Guardando…" : "Guardar"}</span>
            </button>
          </div>

        </form>
      </article>
    );
  }

  /* ── MODO VISUALIZACIÓN ──────────────────────────────────────── */
  return (
    <article
      className={`${styles.platoCard} ${!disponible ? styles.platoCardAgotado : ""} ${isPending ? styles.platoCardPending : ""}`}
    >
      {/* Badge agotado */}
      {!disponible && (
        <span className={styles.agotadoBadge}>AGOTADO</span>
      )}

      <div className={styles.platoBody}>
        <div className={styles.platoInfo}>
          <span className={styles.platoNombre}>{nombre}</span>
          <span className={styles.platoDesc}>{descripcion}</span>
        </div>
        <span className={styles.platoPrecio}>
          {precio.toFixed(2).replace(".", ",")} €
        </span>
      </div>

      <div className={styles.platoActions}>
        {/* Toggle disponible */}
        <button
          className={`${styles.toggleBtn} ${disponible ? styles.toggleBtnOn : styles.toggleBtnOff}`}
          onClick={handleToggle}
          disabled={isPending}
          title={disponible ? "Marcar como agotado" : "Marcar como disponible"}
        >
          {pendingToggle
            ? <Loader2 size={13} className={styles.spin} />
            : disponible
              ? <><Eye size={13} /><span>Disponible</span></>
              : <><EyeOff size={13} /><span>Agotado</span></>
          }
        </button>

        {/* Editar */}
        <button
          className={styles.editBtn}
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          title="Editar plato"
          aria-label={`Editar ${nombre}`}
        >
          <Pencil size={13} strokeWidth={2} />
        </button>

        {/* Eliminar */}
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={isPending}
          title="Eliminar plato"
          aria-label={`Eliminar ${nombre}`}
        >
          {pendingDelete
            ? <Loader2 size={13} className={styles.spin} />
            : <Trash2 size={13} strokeWidth={2} />
          }
        </button>
      </div>
    </article>
  );
}
