"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

import { menuData } from "@/app/data/menuData";

/* ── getPlatos ───────────────────────────────────────────────── */
export async function getPlatos() {
  // 1. Migración automática: Si la BD está vacía, volcamos los datos estáticos
  const count = await prisma.plato.count().catch(() => 0);
  if (count === 0 && prisma.plato) {
    try {
      console.log("Migrando platos de menuData.js a la base de datos...");
      const platosAInsertar = menuData.map((p) => ({
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        categoria: p.categoria,
        imagen: p.imagen,
        alergenos: JSON.stringify(p.alergenos || []),
        disponible: true,
      }));
      await prisma.plato.createMany({ data: platosAInsertar });
      console.log("¡Migración completada con éxito!");
    } catch (e) {
      console.error("Error en la migración:", e);
    }
  }

  return prisma.plato.findMany({
    orderBy: [{ categoria: "asc" }, { nombre: "asc" }],
  });
}

/* ── getPlatosDisponibles ────────────────────────────────────── */
/** Usado en el menú público — devuelve todos (también los agotados para marcarlos) */
export async function getPlatosPublico() {
  // Llama a getPlatos para asegurar que la migración ocurra si está vacío
  return getPlatos();
}

/* ── crearPlato ──────────────────────────────────────────────── */
export async function crearPlato(formData: FormData) {
  const nombre      = (formData.get("nombre")      as string).trim();
  const descripcion = (formData.get("descripcion") as string).trim();
  const precioRaw   = (formData.get("precio")      as string).trim();
  const categoria   = (formData.get("categoria")   as string).trim();
  const imagen      = (formData.get("imagen")      as string | null)?.trim() || null;

  if (!nombre || !descripcion || !precioRaw || !categoria) {
    throw new Error("Faltan campos obligatorios");
  }

  const precio = parseFloat(precioRaw.replace(",", "."));
  if (isNaN(precio) || precio < 0) throw new Error("Precio inválido");

  await prisma.plato.create({
    data: { nombre, descripcion, precio, categoria, imagen },
  });

  revalidatePath("/admin/carta");
  revalidatePath("/menu");
}

/* ── editarPlato ─────────────────────────────────────────────── */
export async function editarPlato(id: string, formData: FormData) {
  const nombre      = (formData.get("nombre")      as string).trim();
  const descripcion = (formData.get("descripcion") as string).trim();
  const precioRaw   = (formData.get("precio")      as string).trim();
  const categoria   = (formData.get("categoria")   as string).trim();
  const imagen      = (formData.get("imagen")      as string | null)?.trim() || null;

  if (!nombre || !descripcion || !precioRaw || !categoria) {
    throw new Error("Faltan campos obligatorios");
  }

  const precio = parseFloat(precioRaw.replace(",", "."));
  if (isNaN(precio) || precio < 0) throw new Error("Precio inválido");

  await prisma.plato.update({
    where: { id },
    data: { nombre, descripcion, precio, categoria, imagen },
  });

  revalidatePath("/admin/carta");
  revalidatePath("/menu");
}

/* ── eliminarPlato ───────────────────────────────────────────── */
export async function eliminarPlato(id: string) {
  await prisma.plato.delete({ where: { id } });
  revalidatePath("/admin/carta");
  revalidatePath("/menu");
}

/* ── toggleDisponibilidad ────────────────────────────────────── */
export async function toggleDisponibilidad(id: string) {
  const plato = await prisma.plato.findUniqueOrThrow({ where: { id } });
  await prisma.plato.update({
    where: { id },
    data: { disponible: !plato.disponible },
  });
  revalidatePath("/admin/carta");
  revalidatePath("/menu");
}
