// Prisma 7 configuration — datasource URL lives here, not in schema.prisma
import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // SQLite file path relative to project root
    url: `file:${path.join(process.cwd(), "dev.db")}`,
  },
});
