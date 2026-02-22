// src/app/api/items/[id]/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

const STATUS_ALLOWED = new Set(["ACTIVE", "PAUSED", "DELETED"]);

export async function GET(_req, ctx) {
  const { id } = await ctx.params; // Next 16: params pode ser Promise

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
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
  });

  if (!item) return new Response("Not found", { status: 404 });
  return Response.json(item);
}

// PATCH: mudar status (Pausar/Ativar/Excluir)
export async function PATCH(req, ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { status } = body;

  if (!status || !STATUS_ALLOWED.has(status)) {
    return new Response("Status inválido", { status: 400 });
  }

  const item = await prisma.item.update({
    where: { id },
    data: { status },
  });

  return Response.json(item);
}

// PUT: editar item (opcional, mas já deixo pronto)
export async function PUT(req, ctx) {
  const { id } = await ctx.params;
  const body = await req.json();

  const {
    title,
    description,
    category,
    size,
    condition,
    city,
    state,
    imageUrls, // array de urls para substituir
  } = body;

  if (title !== undefined && !String(title).trim()) {
    return new Response("title não pode ser vazio", { status: 400 });
  }

  const data = {
    ...(title !== undefined ? { title: String(title).trim() } : {}),
    ...(description !== undefined ? { description: String(description).trim() || null } : {}),
    ...(category !== undefined ? { category: String(category).trim() || null } : {}),
    ...(size !== undefined ? { size: String(size).trim() || null } : {}),
    ...(condition !== undefined ? { condition: String(condition).trim() || null } : {}),
    ...(city !== undefined ? { city: String(city).trim() || null } : {}),
    ...(state !== undefined ? { state: String(state).trim() || null } : {}),
  };

  const updated = await prisma.item.update({
    where: { id },
    data: {
      ...data,

      // Se vier imageUrls, substitui todas as imagens
      ...(Array.isArray(imageUrls)
        ? {
            images: {
              deleteMany: {}, // remove todas do item
              create: imageUrls
                .filter(Boolean)
                .map((url, idx) => ({ url, order: idx })),
            },
          }
        : {}),
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return Response.json(updated);
}