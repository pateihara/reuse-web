// src/app/api/trades/route.js
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { requesterId, wantedItemId, offeredItemId } = body;

  if (!requesterId || !wantedItemId || !offeredItemId) {
    return new Response(
      "requesterId, wantedItemId, offeredItemId são obrigatórios",
      { status: 400 }
    );
  }

  // Item desejado (o item que estou tentando pegar)
  const wantedItem = await prisma.item.findUnique({
    where: { id: wantedItemId },
    select: { id: true, ownerId: true, status: true },
  });

  if (!wantedItem || wantedItem.status !== "ACTIVE") {
    return new Response("Item desejado inválido", { status: 400 });
  }

  // Evitar trade com o próprio item (opcional mas recomendado)
  if (wantedItemId === offeredItemId) {
    return new Response("Você não pode oferecer o mesmo item que está desejando.", {
      status: 400,
    });
  }

  // (Opcional) conferir se offeredItem existe e está ACTIVE
  const offeredItem = await prisma.item.findUnique({
    where: { id: offeredItemId },
    select: { id: true, ownerId: true, status: true },
  });

  if (!offeredItem || offeredItem.status !== "ACTIVE") {
    return new Response("Item oferecido inválido", { status: 400 });
  }

  // (Opcional) garantir que quem oferece é o requester
  if (offeredItem.ownerId !== requesterId) {
    return new Response("O item oferecido não pertence ao requester.", { status: 403 });
  }

  // cria trade (começa PENDING: aguardando owner aceitar/recusar)
  const trade = await prisma.trade.create({
    data: {
      requesterId,
      ownerId: wantedItem.ownerId,
      wantedItemId,
      offeredItemId,

      status: "PENDING",
      // acceptedByOwner fica null automaticamente
      requesterDone: false,
      ownerDone: false,
    },
  });

  return Response.json(trade, { status: 201 });
}