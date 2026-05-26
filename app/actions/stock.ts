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

/* ── crearProducto ───────────────────────────────────────────── */
export async function crearProducto(formData: FormData) {
  const nombre      = (formData.get("nombre")      as string).trim();
  const categoria   = (formData.get("categoria")   as string).trim();
  const cantidad    = parseInt(formData.get("cantidad")    as string, 10);
  const stockMinimo = parseInt(formData.get("stockMinimo") as string, 10);

  if (!nombre || !categoria) throw new Error("Nombre y categoría son obligatorios");
  if (isNaN(cantidad)    || cantidad    < 0) throw new Error("Cantidad inválida");
  if (isNaN(stockMinimo) || stockMinimo < 0) throw new Error("Stock mínimo inválido");

  await prisma.producto.create({
    data: { nombre, categoria, cantidad, stockMinimo },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inventario");
}

/* ── eliminarProducto ────────────────────────────────────────── */
export async function eliminarProducto(id: string) {
  await prisma.producto.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/inventario");
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
