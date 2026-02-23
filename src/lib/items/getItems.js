// src/lib/items/getItems.js
import { prisma } from "@/lib/prisma";

function buildWhere(searchParams) {
  const q = searchParams?.q ? String(searchParams.q).trim() : "";
  const category = searchParams?.category ? String(searchParams.category).trim() : "";
  const size = searchParams?.size ? String(searchParams.size).trim() : "";
  const condition = searchParams?.condition ? String(searchParams.condition).trim() : "";
  const city = searchParams?.city ? String(searchParams.city).trim() : "";

  // ✅ respeita sua regra: só ACTIVE
  const where = { status: "ACTIVE" };

  // ⚠️ Ajuste os campos de Item conforme seu schema:
  // Exemplo: title/description/category/size/condition/city
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) where.category = category;
  if (size) where.size = size;
  if (condition) where.condition = condition;
  if (city) where.city = city;

  return where;
}

export async function getItems(searchParams) {
  const where = buildWhere(searchParams);

  return prisma.item.findMany({
    where,
    orderBy: { createdAt: "desc" }, // ajuste se não existir createdAt
    include: {
      images: true, // ajuste: se seu relacionamento tiver outro nome (ItemImage)
      owner: { select: { id: true, name: true } }, // ajuste se tiver owner/user
    },
  });
}