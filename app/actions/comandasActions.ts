"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

/* ── Types ───────────────────────────────────────────────────────── */
export type ItemEstado = "PENDIENTE" | "PREPARANDO" | "LISTO" | "ENTREGADO";
export type ComandaEstado = "ABIERTA" | "PAGADA";

/* ── Queries ─────────────────────────────────────────────────────── */
export async function getComandasActivas() {
  return prisma.comanda.findMany({
    where: { estado: "ABIERTA" },
    include: {
      items: {
        include: { plato: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getPlatosDisponibles() {
  return prisma.plato.findMany({
    where: { disponible: true },
    orderBy: [{ categoria: "asc" }, { nombre: "asc" }],
  });
}

/* ── Mutations ───────────────────────────────────────────────────── */

/**
 * Creates a new comanda for a mesa, or returns the existing open one.
 * Then adds / increments the requested plato.
 */
export async function crearOActualizarComanda(formData: FormData) {
  const mesa = (formData.get("mesa") as string).trim();
  const platoId = formData.get("platoId") as string;
  const cantidad = Number(formData.get("cantidad") ?? 1);
  const notas = (formData.get("notas") as string | null)?.trim() || null;
  const camarero = (formData.get("camarero") as string) || "camarero";

  if (!mesa || !platoId) return;

  /* Find or create the open comanda for this mesa */
  let comanda = await prisma.comanda.findFirst({
    where: { mesa, estado: "ABIERTA" },
  });

  if (!comanda) {
    comanda = await prisma.comanda.create({
      data: { mesa, camarero },
    });
  }

  /* Check if the same plato already exists in the comanda */
  const existing = await prisma.comandaItem.findFirst({
    where: { comandaId: comanda.id, platoId, estado: "PENDIENTE" },
  });

  if (existing) {
    await prisma.comandaItem.update({
      where: { id: existing.id },
      data: { cantidad: existing.cantidad + cantidad },
    });
  } else {
    await prisma.comandaItem.create({
      data: { comandaId: comanda.id, platoId, cantidad, notas },
    });
  }

  revalidatePath("/camareros");
  revalidatePath("/cocina");
}

/**
 * Updates the estado of a single ComandaItem.
 * Used by both camareros (mark ENTREGADO) and cocina (PREPARANDO → LISTO).
 */
export async function actualizarEstadoItem(itemId: string, nuevoEstado: ItemEstado) {
  await prisma.comandaItem.update({
    where: { id: itemId },
    data: { estado: nuevoEstado },
  });

  revalidatePath("/camareros");
  revalidatePath("/cocina");
}

/**
 * Marks the comanda as PAGADA (closes it).
 */
export async function finalizarComanda(comandaId: string) {
  await prisma.comanda.update({
    where: { id: comandaId },
    data: { estado: "PAGADA" },
  });

  revalidatePath("/camareros");
  revalidatePath("/cocina");
}

/**
 * Removes a single item from a comanda (used by camarero to undo an error).
 */
export async function eliminarItem(itemId: string) {
  await prisma.comandaItem.delete({ where: { id: itemId } });

  revalidatePath("/camareros");
  revalidatePath("/cocina");
}
