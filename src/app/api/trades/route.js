// src/app/api/trades/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req) {
  const requesterId = await getUserIdFromRequest(req);
  if (!requesterId) return new Response("Não autenticado", { status: 401 });

  const body = await req.json().catch(() => ({}));
  const wantedItemId = String(body?.wantedItemId || "");
  const offeredItemId = String(body?.offeredItemId || "");

  if (!wantedItemId || !offeredItemId) {
    return new Response("wantedItemId e offeredItemId são obrigatórios", { status: 400 });
  }

  if (wantedItemId === offeredItemId) {
    return new Response("Você não pode trocar um item pelo próprio item.", { status: 400 });
  }

  const [wantedItem, offeredItem] = await Promise.all([
    prisma.item.findUnique({ where: { id: wantedItemId }, select: { id: true, status: true, ownerId: true } }),
    prisma.item.findUnique({ where: { id: offeredItemId }, select: { id: true, status: true, ownerId: true } }),
  ]);

  if (!wantedItem || wantedItem.status !== "ACTIVE") {
    return new Response("Item desejado não está disponível.", { status: 404 });
  }

  if (!offeredItem || offeredItem.status !== "ACTIVE") {
    return new Response("Seu item oferecido não está disponível.", { status: 400 });
  }

  // offeredItem tem que ser do requester
  if (String(offeredItem.ownerId) !== String(requesterId)) {
    return new Response("Você só pode oferecer itens do seu perfil.", { status: 403 });
  }

  const ownerId = String(wantedItem.ownerId);

  // não pode negociar com você mesmo
  if (String(ownerId) === String(requesterId)) {
    return new Response("Você não pode trocar com você mesmo.", { status: 400 });
  }

  // evita trades duplicados abertos para o mesmo par de itens
  const existing = await prisma.trade.findFirst({
    where: {
      status: { in: ["PENDING", "CHAT_ACTIVE", "TRADE_MARKED"] },
      requesterId,
      ownerId,
      offeredItemId,
      wantedItemId,
    },
    select: { id: true },
  });

  if (existing) {
    return Response.json({ id: existing.id, reused: true }, { status: 200 });
  }

  const trade = await prisma.trade.create({
    data: {
      requesterId,
      ownerId,
      offeredItemId,
      wantedItemId,
      status: "PENDING",
      acceptedByOwner: null,
      requesterDone: false,
      ownerDone: false,
    },
    select: { id: true },
  });

  return Response.json(trade, { status: 201 });
}