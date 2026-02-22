// src/lib/prisma.js
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function makePrisma() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    // Isso explica o build na Vercel quando env não está configurada
    throw new Error("POSTGRES_URL não definido. Configure na Vercel e no .env.local.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? makePrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;