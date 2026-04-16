import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import { defineConfig } from "prisma/config";

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/seed.js",
  },
  datasource: {
    url: databaseUrl ?? "",
  },
});