// Load dotenv only if available (not needed in production)
try {
  require("dotenv/config");
} catch {
  // dotenv not available, DATABASE_URL should be set via environment
}

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
