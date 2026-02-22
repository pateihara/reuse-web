// src/app/api/trades/route.js
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req) {
  const requesterId = getUserIdFromRequest(req);
  if (!requesterId) return new Response("Não autenticado", { status: 401 });

  const body = await req.json();
  const { wantedItemId, offeredItemId } = body;

  if (!wantedItemId || !offeredItemId) {
    return new Response("wantedItemId e offeredItemId são obrigatórios", { status: 400 });
  }

  const wantedItem = await prisma.item.findUnique({
    where: { id: wantedItemId },
    select: { id: true, ownerId: true, status: true },
  });

  if (!wantedItem || wantedItem.status !== "ACTIVE") {
    return new Response("Item desejado inválido", { status: 400 });
  }

  if (wantedItemId === offeredItemId) {
    return new Response("Você não pode oferecer o mesmo item que está desejando.", { status: 400 });
  }

  const offeredItem = await prisma.item.findUnique({
    where: { id: offeredItemId },
    select: { id: true, ownerId: true, status: true },
  });

  if (!offeredItem || offeredItem.status !== "ACTIVE") {
    return new Response("Item oferecido inválido", { status: 400 });
  }

  if (offeredItem.ownerId !== requesterId) {
    return new Response("O item oferecido não pertence ao requester.", { status: 403 });
  }

  const trade = await prisma.trade.create({
    data: {
      requesterId,
      ownerId: wantedItem.ownerId,
      wantedItemId,
      offeredItemId,
      status: "PENDING",
      requesterDone: false,
      ownerDone: false,
    },
  });

  return Response.json(trade, { status: 201 });
}