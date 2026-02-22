// src/app/api/items/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("category") || "").trim();
  const size = (searchParams.get("size") || "").trim();
  const condition = (searchParams.get("condition") || "").trim();
  const city = (searchParams.get("city") || "").trim();

  const where = {
    status: "ACTIVE",
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      category ? { category: { equals: category, mode: "insensitive" } } : {},
      size ? { size: { equals: size, mode: "insensitive" } } : {},
      condition ? { condition: { equals: condition, mode: "insensitive" } } : {},
      city ? { city: { equals: city, mode: "insensitive" } } : {},
    ],
  };

  const items = await prisma.item.findMany({
    where,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          city: true,
          state: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return Response.json(items);
}

export async function POST(req) {
  // ✅ auth pelo cookie (não aceitar ownerId do client)
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return new Response("Não autenticado", { status: 401 });
  }

  const body = await req.json();

  const {
    title,
    description,
    category,
    size,
    condition,
    city,
    state,
    imageUrls, // array
  } = body;

  if (!title?.trim()) {
    return new Response("title é obrigatório", { status: 400 });
  }

  const item = await prisma.item.create({
    data: {
      ownerId: userId,
      title: title.trim(),
      description: description?.trim() || null,
      category: category?.trim() || null,
      size: size?.trim() || null,
      condition: condition?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      status: "ACTIVE",
      images:
        Array.isArray(imageUrls) && imageUrls.length
          ? {
              create: imageUrls
                .filter(Boolean)
                .map((url, idx) => ({ url, order: idx })),
            }
          : undefined,
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return Response.json(item, { status: 201 });
}