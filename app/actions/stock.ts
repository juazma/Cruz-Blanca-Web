"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

/* ── getProductos ────────────────────────────────────────────── */
export async function getProductos() {
  return prisma.producto.findMany({
    orderBy: [
      { categoria: "asc" },
      { nombre:    "asc" },
    ],
  });
}

/* ── actualizarStock ─────────────────────────────────────────── */
export async function actualizarStock(id: string, variacion: number) {
  /* Leer primero para garantizar que nunca bajamos de 0 */
  const producto = await prisma.producto.findUniqueOrThrow({ where: { id } });

  const nuevaCantidad = Math.max(0, producto.cantidad + variacion);

  await prisma.producto.update({
    where: { id },
    data:  { cantidad: nuevaCantidad },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inventario");
}
