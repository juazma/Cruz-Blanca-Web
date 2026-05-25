/**
 * lib/prisma.ts — PrismaClient Singleton
 *
 * Prisma 7 + SQLite (better-sqlite3 adapter)
 *
 * In development, Next.js hot-reload re-executes module code on every save,
 * which would create a new PrismaClient on each reload and quickly exhaust
 * the connection pool. We store the instance on `globalThis` so it survives
 * across reloads in development while staying a true singleton in production.
 */

import path from "node:path";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

// Absolute path to the SQLite file — same location as prisma.config.ts uses
const DB_PATH = path.join(process.cwd(), "dev.db");

function createPrismaClient() {
  const sqlite  = new Database(DB_PATH);
  const adapter = new PrismaBetterSqlite3({ url: DB_PATH });
  return new PrismaClient({ adapter });
}

// ── Singleton pattern (Next.js hot-reload safe) ──────────────────
declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export default prisma;
