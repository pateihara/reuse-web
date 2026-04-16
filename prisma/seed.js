import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

async function main() {
  const url = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;

  if (!url) {
    console.error("❌ Defina POSTGRES_URL no .env");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Iniciando Seed completo...");

  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Criar Usuários
  const usersData = [
    { name: "Ana Silva", email: "ana@reuse.com", username: "ana_silva", city: "São Paulo", state: "SP" },
    { name: "Bruno Souza", email: "bruno@reuse.com", username: "bruno88", city: "Rio de Janeiro", state: "RJ" },
    { name: "Carlos Lima", email: "carlos@reuse.com", username: "carlinhos", city: "Curitiba", state: "PR" },
    { name: "Usuário Teste", email: "teste@reuse.com", username: "teste", city: "São Paulo", state: "SP" },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { ...u, password: passwordHash },
      create: { ...u, password: passwordHash },
    });
    createdUsers.push(user);
    console.log(`👤 Usuário criado/atualizado: ${u.email}`);
  }

  // 2. Criar Itens
  const itemsData = [
    {
      title: "Camiseta Vintage 90s",
      description: "Camiseta em ótimo estado, tecido grosso.",
      category: "Roupas",
      condition: "Usado - Excelente",
      size: "G",
      ownerEmail: "ana@reuse.com",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    },
    {
      title: "Tênis Esportivo Casual",
      description: "Pouco uso, ideal para o dia a dia.",
      category: "Calçados",
      condition: "Usado - Bom",
      size: "42",
      ownerEmail: "bruno@reuse.com",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    },
    {
      title: "Fone de Ouvido Bluetooth",
      description: "Bateria durando 20h. Funcionando 100%.",
      category: "Eletrônicos",
      condition: "Usado - Excelente",
      size: "Único",
      ownerEmail: "carlos@reuse.com",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      title: "Calça Jeans Slim",
      description: "Azul marinho, sem furos.",
      category: "Roupas",
      condition: "Usado - Bom",
      size: "40",
      ownerEmail: "teste@reuse.com",
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    },
    {
      title: "Mochila Impermeável",
      description: "Muitos compartimentos, ótima para viagem.",
      category: "Acessórios",
      condition: "Novo",
      size: "30L",
      ownerEmail: "ana@reuse.com",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    },
  ];

  for (const item of itemsData) {
    const owner = createdUsers.find((u) => u.email === item.ownerEmail);
    const newItem = await prisma.item.create({
      data: {
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition,
        size: item.size,
        ownerId: owner.id,
        city: owner.city,
        state: owner.state,
        images: {
          create: { url: item.imageUrl },
        },
      },
    });
    console.log(`📦 Item criado: ${item.title}`);
  }

  console.log("✅ Seed completo com sucesso!");
  console.log("---");
  console.log("Acesse com:");
  console.log("- E-mail: teste@reuse.com / Senha: 123456");
  console.log("- E-mail: ana@reuse.com / Senha: 123456");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error("❌ Erro no seed:", e);
  process.exit(1);
});