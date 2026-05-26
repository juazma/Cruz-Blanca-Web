"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

/* ── Constantes de aforo ─────────────────────────────────────── */

const AFORO_POR_HORA = 20;

/* ── Helpers ─────────────────────────────────────────────────── */

/** Devuelve el inicio y fin (00:00 – 23:59:59) del día de hoy en UTC */
function rangoDiaHoy() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date();
  fin.setHours(23, 59, 59, 999);

  return { inicio, fin };
}

/** Devuelve inicio/fin del día para una fecha "YYYY-MM-DD" en hora local */
function rangoDia(fechaStr: string) {
  const [y, m, d] = fechaStr.split("-").map(Number);
  const inicio = new Date(y, m - 1, d, 0, 0, 0, 0);
  const fin    = new Date(y, m - 1, d, 23, 59, 59, 999);
  return { inicio, fin };
}

/** Devuelve la hora en formato "HH:MM" desde un Date usando hora local */
function horaStr(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/* ── Types ──────────────────────────────────────────────────── */

export type EstadoReserva = "PENDIENTE" | "CONFIRMADA" | "COMPLETADA" | "CANCELADA";

export type NuevaReservaData = {
  nombreCliente: string;
  comensales: number;
  fechaHora: Date;
  estado?: EstadoReserva;
  notas?: string;
};

/* ── getReservasHoy ──────────────────────────────────────────── */

export async function getReservasHoy() {
  const { inicio, fin } = rangoDiaHoy();

  const reservas = await prisma.reserva.findMany({
    where: {
      fechaHora: {
        gte: inicio,
        lte: fin,
      },
    },
    orderBy: { fechaHora: "asc" },
  });

  return reservas;
}

/* ── cambiarEstadoReserva ────────────────────────────────────── */

export async function cambiarEstadoReserva(id: string, estado: EstadoReserva) {
  await prisma.reserva.update({
    where: { id },
    data: { estado },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reservas");
}

/* ── getDisponibilidad ───────────────────────────────────────── */

/**
 * Resultado que devuelve getDisponibilidad.
 * - bloqueadoCompleto: el día entero está bloqueado → no mostrar formulario
 * - horasOcupadas: slots sin aforo por reservas
 * - horasBloqueadas: slots bloqueados manualmente con mensaje personalizado
 */
export type DisponibilidadResult =
  | { bloqueadoCompleto: true; mensaje: string }
  | {
      bloqueadoCompleto: false;
      horasOcupadas:  string[];
      horasBloqueadas: Record<string, string>; // "HH:MM" → mensaje
    };

export async function getDisponibilidad(
  fechaStr: string,
): Promise<DisponibilidadResult> {
  if (!fechaStr) {
    return { bloqueadoCompleto: false, horasOcupadas: [], horasBloqueadas: {} };
  }

  // 1. ¿Existe bloqueo de todo el día?
  const bloqueoDia = await prisma.bloqueoReserva.findFirst({
    where: { fecha: fechaStr, hora: null },
  });
  if (bloqueoDia) {
    return { bloqueadoCompleto: true, mensaje: bloqueoDia.mensaje };
  }

  // 2. Bloqueos de horas específicas
  const bloqueosHora = await prisma.bloqueoReserva.findMany({
    where: { fecha: fechaStr, hora: { not: null } },
  });
  const horasBloqueadas: Record<string, string> = {};
  for (const b of bloqueosHora) {
    if (b.hora) horasBloqueadas[b.hora] = b.mensaje;
  }

  // 3. Horas saturadas por aforo
  const { inicio, fin } = rangoDia(fechaStr);
  const reservas = await prisma.reserva.findMany({
    where: {
      fechaHora: { gte: inicio, lte: fin },
      estado:    { not: "CANCELADA" },
    },
    select: { fechaHora: true, comensales: true },
  });

  const totales: Record<string, number> = {};
  for (const r of reservas) {
    const h = horaStr(new Date(r.fechaHora));
    totales[h] = (totales[h] ?? 0) + r.comensales;
  }
  const horasOcupadas = Object.entries(totales)
    .filter(([, total]) => total >= AFORO_POR_HORA)
    .map(([h]) => h);

  return { bloqueadoCompleto: false, horasOcupadas, horasBloqueadas };
}

/* ── getBloqueos ─────────────────────────────────────────────── */

export async function getBloqueos() {
  return prisma.bloqueoReserva.findMany({
    orderBy: [{ fecha: "asc" }, { hora: "asc" }],
  });
}

/* ── crearBloqueo ────────────────────────────────────────────── */

export async function crearBloqueo(formData: FormData) {
  const fecha   = (formData.get("fecha")   as string).trim();
  const horaRaw = (formData.get("hora")    as string).trim();
  const mensaje = (formData.get("mensaje") as string).trim();

  if (!fecha || !mensaje) throw new Error("Fecha y mensaje son obligatorios");

  // "todo" → bloqueo de día completo (hora = null)
  const hora = horaRaw === "" || horaRaw === "todo" ? null : horaRaw;

  await prisma.bloqueoReserva.create({
    data: { fecha, hora, mensaje },
  });

  revalidatePath("/admin/reservas");
  revalidatePath("/reservar");
}

/* ── eliminarBloqueo ─────────────────────────────────────────── */

export async function eliminarBloqueo(id: string) {
  await prisma.bloqueoReserva.delete({ where: { id } });
  revalidatePath("/admin/reservas");
  revalidatePath("/reservar");
}

/* ── enviarReservaPublica ────────────────────────────────────── */

export type ReservaPublicaResult =
  | { success: true }
  | { error: string };

export async function enviarReservaPublica(
  formData: FormData,
): Promise<ReservaPublicaResult> {
  const nombre     = (formData.get("nombre")     as string).trim();
  const telefono   = (formData.get("telefono")   as string).trim();
  const fecha      = (formData.get("fecha")      as string).trim(); // "YYYY-MM-DD"
  const hora       = (formData.get("hora")       as string).trim(); // "HH:MM"
  const comensalesRaw = formData.get("comensales") as string;

  if (!nombre || !telefono || !fecha || !hora || !comensalesRaw) {
    return { error: "Por favor, completa todos los campos." };
  }

  // "9+" se toma como 9 para el cálculo de aforo
  const comensales = comensalesRaw === "9+" ? 9 : parseInt(comensalesRaw, 10);
  if (isNaN(comensales) || comensales < 1) {
    return { error: "Número de comensales inválido." };
  }

  // Construir fechaHora en hora local
  const [y, m, d]   = fecha.split("-").map(Number);
  const [hh, mm]    = hora.split(":").map(Number);
  const fechaHora   = new Date(y, m - 1, d, hh, mm, 0);

  if (isNaN(fechaHora.getTime())) {
    return { error: "Fecha u hora inválida." };
  }

  // Comprobar bloqueos (día completo u hora específica)
  const bloqueoDia = await prisma.bloqueoReserva.findFirst({
    where: { fecha, hora: null },
  });
  if (bloqueoDia) {
    return { error: bloqueoDia.mensaje };
  }
  const bloqueoHora = await prisma.bloqueoReserva.findFirst({
    where: { fecha, hora },
  });
  if (bloqueoHora) {
    return { error: bloqueoHora.mensaje };
  }

  // Comprobar aforo en ese slot
  const { inicio, fin } = rangoDia(fecha);
  const reservasHora = await prisma.reserva.findMany({
    where: {
      fechaHora: { gte: inicio, lte: fin },
      estado:    { not: "CANCELADA" },
    },
    select: { fechaHora: true, comensales: true },
  });

  const ocupadosEnSlot = reservasHora
    .filter((r) => horaStr(new Date(r.fechaHora)) === hora)
    .reduce((sum, r) => sum + r.comensales, 0);

  if (ocupadosEnSlot + comensales > AFORO_POR_HORA) {
    return { error: "No hay aforo disponible para esa hora. Por favor, elige otra." };
  }

  // Crear reserva — teléfono guardado en el campo notas
  await prisma.reserva.create({
    data: {
      nombreCliente: nombre,
      comensales,
      fechaHora,
      estado: "PENDIENTE",
      notas:  `Teléfono: ${telefono}`,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reservas");

  return { success: true };
}

/* ── crearReserva ────────────────────────────────────────────── */

export async function crearReserva(data: NuevaReservaData) {
  const reserva = await prisma.reserva.create({
    data: {
      nombreCliente: data.nombreCliente,
      comensales:    data.comensales,
      fechaHora:     data.fechaHora,
      estado:        data.estado ?? "PENDIENTE",
      notas:         data.notas ?? null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reservas");

  return reserva;
}
