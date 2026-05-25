/**
 * prisma/seed.ts — Datos iniciales de prueba
 * Ejecutar: npx tsx prisma/seed.ts
 */

import path from "node:path";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const DB_PATH = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: DB_PATH });
const prisma  = new PrismaClient({ adapter });

// ── Helpers ───────────────────────────────────────────────────────
/** Devuelve un Date en la fecha de hoy a una hora concreta (hora local) */
function hoy(horas: number, minutos = 0): Date {
  const d = new Date();
  d.setHours(horas, minutos, 0, 0);
  return d;
}

function manana(horas: number, minutos = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(horas, minutos, 0, 0);
  return d;
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  Iniciando seed…");

  // Limpiar datos anteriores para poder re-ejecutar el seed
  await prisma.turno.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.reserva.deleteMany();
  console.log("   ✓ Tablas vaciadas");

  // ── RESERVAS ─────────────────────────────────────────────────────
  const reservas = await prisma.reserva.createManyAndReturn({
    data: [
      // Hoy — servicio de comida
      { nombreCliente: "Familia García",    comensales: 4, fechaHora: hoy(13, 30), estado: "CONFIRMADA" },
      { nombreCliente: "Ana Romero",        comensales: 2, fechaHora: hoy(13, 45), estado: "CONFIRMADA" },
      { nombreCliente: "Carlos Fernández",  comensales: 6, fechaHora: hoy(14,  0), estado: "PENDIENTE",  notas: "Mesa junto a la ventana" },
      { nombreCliente: "Lucía Navarro",     comensales: 3, fechaHora: hoy(14, 15), estado: "CONFIRMADA" },
      { nombreCliente: "Pablo Molina",      comensales: 2, fechaHora: hoy(14, 30), estado: "CANCELADA",  notas: "Canceló por enfermedad" },
      { nombreCliente: "Marta Ruiz",        comensales: 5, fechaHora: hoy(15,  0), estado: "CONFIRMADA" },
      { nombreCliente: "Empresa Covitel",   comensales: 8, fechaHora: hoy(15, 30), estado: "CONFIRMADA", notas: "Menú degustación · pago empresa" },
      // Hoy — servicio de cena
      { nombreCliente: "Jorge Castillo",    comensales: 2, fechaHora: hoy(20, 30), estado: "CONFIRMADA" },
      { nombreCliente: "Laura Gómez",       comensales: 4, fechaHora: hoy(21,  0), estado: "PENDIENTE" },
      { nombreCliente: "Roberto Díaz",      comensales: 3, fechaHora: hoy(21, 30), estado: "CONFIRMADA", notas: "Alergia al marisco" },
      { nombreCliente: "Isabel Moreno",     comensales: 6, fechaHora: hoy(22,  0), estado: "CONFIRMADA" },
      { nombreCliente: "David Herrero",     comensales: 2, fechaHora: hoy(22,  0), estado: "CONFIRMADA" },
      // Mañana — comida
      { nombreCliente: "Carmen Jiménez",    comensales: 4, fechaHora: manana(13, 30), estado: "CONFIRMADA" },
      { nombreCliente: "Antonio López",     comensales: 2, fechaHora: manana(14,  0), estado: "PENDIENTE" },
      { nombreCliente: "Rosa Martínez",     comensales: 7, fechaHora: manana(14, 30), estado: "CONFIRMADA", notas: "Cumpleaños · tarta de encargo" },
    ],
  });
  console.log(`   ✓ ${reservas.length} reservas creadas`);

  // ── PRODUCTOS (inventario) ────────────────────────────────────────
  const productos = await prisma.producto.createManyAndReturn({
    data: [
      // Pescados y mariscos
      { nombre: "Lubina fresca",        categoria: "Pescado",   cantidad:  2, stockMinimo:  5 },
      { nombre: "Gamba roja",           categoria: "Marisco",   cantidad: 12, stockMinimo: 10 },
      { nombre: "Pulpo cocido",         categoria: "Marisco",   cantidad:  8, stockMinimo:  6 },
      { nombre: "Rape lomo",            categoria: "Pescado",   cantidad:  6, stockMinimo:  4 },
      // Carnes
      { nombre: "Solomillo Angus",      categoria: "Carne",     cantidad: 15, stockMinimo:  8 },
      { nombre: "Secreto ibérico",      categoria: "Carne",     cantidad: 10, stockMinimo:  6 },
      { nombre: "Carrillada de cerdo",  categoria: "Carne",     cantidad:  7, stockMinimo:  5 },
      // Bodega — bajo stock
      { nombre: "Vino Ribera Reserva",  categoria: "Bodega",    cantidad:  4, stockMinimo:  6 },
      { nombre: "Vino Rueda Verdejo",   categoria: "Bodega",    cantidad: 18, stockMinimo:  8 },
      { nombre: "Manzanilla en rama",   categoria: "Bodega",    cantidad:  9, stockMinimo:  6 },
      // Despensa — bajo stock
      { nombre: "Aceite AOVE 500 ml",   categoria: "Despensa",  cantidad:  3, stockMinimo:  8 },
      { nombre: "Sal de Añana",         categoria: "Despensa",  cantidad: 20, stockMinimo:  5 },
      { nombre: "Pimentón La Vera",     categoria: "Despensa",  cantidad: 11, stockMinimo:  4 },
      { nombre: "Trufa negra (lata)",   categoria: "Despensa",  cantidad:  2, stockMinimo:  3 },
      // Postres
      { nombre: "Queso Payoyo curado",  categoria: "Lacteos",   cantidad:  5, stockMinimo:  3 },
      { nombre: "Chocolate 70%",        categoria: "Postres",   cantidad: 14, stockMinimo:  5 },
    ],
  });
  console.log(`   ✓ ${productos.length} productos creados`);

  // ── TURNOS ────────────────────────────────────────────────────────
  const turnos = await prisma.turno.createManyAndReturn({
    data: [
      { empleado: "María José Ruiz",   dia: hoy(0), horaInicio: "13:00", horaFin: "17:00" },
      { empleado: "Paco Téllez",       dia: hoy(0), horaInicio: "13:00", horaFin: "17:00" },
      { empleado: "Carmen Aguado",     dia: hoy(0), horaInicio: "19:30", horaFin: "23:30" },
      { empleado: "Tomás Villanueva",  dia: hoy(0), horaInicio: "19:30", horaFin: "23:30" },
      { empleado: "María José Ruiz",   dia: manana(0), horaInicio: "13:00", horaFin: "17:00" },
      { empleado: "Andrés Cabello",    dia: manana(0), horaInicio: "13:00", horaFin: "17:00" },
    ],
  });
  console.log(`   ✓ ${turnos.length} turnos creados`);

  // ── Resumen ───────────────────────────────────────────────────────
  const bajoStock = productos.filter(p => p.cantidad < p.stockMinimo);
  console.log("\n📊  Resumen:");
  console.log(`   • Reservas hoy:          ${reservas.filter(r => {
    const f = new Date(r.fechaHora);
    const hoyDate = new Date();
    return f.toDateString() === hoyDate.toDateString();
  }).length}`);
  console.log(`   • Productos bajo stock:  ${bajoStock.length} (${bajoStock.map(p => p.nombre).join(", ")})`);
  console.log(`   • Turnos hoy:            ${turnos.filter(t => {
    const f = new Date(t.dia);
    return f.toDateString() === new Date().toDateString();
  }).length}`);

  console.log("\n✅  Seed completado.");
}

main()
  .catch((e) => { console.error("❌ Error en seed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
