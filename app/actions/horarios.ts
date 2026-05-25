"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

/* ── Helpers ─────────────────────────────────────────────────── */

/**
 * Devuelve la fecha del lunes de la semana actual (00:00:00 local).
 */
function getLunesSemanaActual(): Date {
  const hoy = new Date();
  // getDay(): 0=Dom, 1=Lun…6=Sáb  →  desplazamiento hacia el lunes
  const diff = hoy.getDay() === 0 ? -6 : 1 - hoy.getDay();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diff);
  lunes.setHours(0, 0, 0, 0);
  return lunes;
}

/**
 * A partir de un índice 0–6 (0=Lun … 6=Dom) calcula la fecha real
 * del día en la semana actual.
 */
function fechaDesdeDiaIndex(diaIndex: number): Date {
  const lunes = getLunesSemanaActual();
  const fecha = new Date(lunes);
  fecha.setDate(lunes.getDate() + diaIndex);
  return fecha;
}

/* ── getTurnos ───────────────────────────────────────────────── */
export async function getTurnos() {
  return prisma.turno.findMany({
    orderBy: { horaInicio: "asc" },
  });
}

/* ── crearTurno ──────────────────────────────────────────────── */
export async function crearTurno(formData: FormData) {
  const empleado   = (formData.get("empleado")   as string).trim();
  const diaIndex   = parseInt(formData.get("dia") as string, 10); // 0=Lun…6=Dom
  const horaInicio = (formData.get("horaInicio") as string).trim();
  const horaFin    = (formData.get("horaFin")    as string).trim();

  if (!empleado || isNaN(diaIndex) || !horaInicio || !horaFin) {
    throw new Error("Datos del turno incompletos");
  }

  const dia = fechaDesdeDiaIndex(diaIndex);

  await prisma.turno.create({
    data: { empleado, dia, horaInicio, horaFin },
  });

  revalidatePath("/admin/horarios");
}

/* ── eliminarTurno ───────────────────────────────────────────── */
export async function eliminarTurno(id: string) {
  await prisma.turno.delete({ where: { id } });
  revalidatePath("/admin/horarios");
}
