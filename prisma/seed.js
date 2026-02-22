import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

async function main() {
  const url = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;

  if (!url) {
    console.error("❌ Defina POSTGRES_URL (ou PRISMA_DATABASE_URL) no .env.local");
    process.exit(1);
  }

  // Pool do pg com SSL (db.prisma.io normalmente precisa)
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = "teste@reuse.com";
  const plainPassword = "123456";
  const hash = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Usuário Teste",
      password: hash,
      city: "São Paulo",
      state: "SP",
    },
    create: {
      name: "Usuário Teste",
      email,
      password: hash,
      city: "São Paulo",
      state: "SP",
    },
    select: { id: true, name: true, email: true },
  });

  console.log("✅ Seed OK");
  console.log("User:", user);
  console.log("Login:", { email, password: plainPassword });

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});