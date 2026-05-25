"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

/* ── Helpers ─────────────────────────────────────────────────── */

/** Devuelve el inicio y fin (00:00 – 23:59:59) del día de hoy en UTC */
function rangoDiaHoy() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date();
  fin.setHours(23, 59, 59, 999);

  return { inicio, fin };
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
