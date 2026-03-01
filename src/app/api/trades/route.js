// src/app/api/trades/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req) {
  try {
    const requesterId = await getUserIdFromRequest(req);
    if (!requesterId) return new Response("Não autenticado", { status: 401 });

    const body = await req.json().catch(() => ({}));
    const wantedItemId = String(body?.wantedItemId || "");
    const offeredItemId = String(body?.offeredItemId || "");

    if (!wantedItemId || !offeredItemId) {
      return new Response("wantedItemId e offeredItemId são obrigatórios", { status: 400 });
    }

    if (wantedItemId === offeredItemId) {
      return new Response("Você não pode oferecer o mesmo item que está desejando.", { status: 400 });
    }

    const wantedItem = await prisma.item.findUnique({
      where: { id: wantedItemId },
      select: { id: true, ownerId: true, status: true },
    });

    if (!wantedItem || wantedItem.status !== "ACTIVE") {
      return new Response("Item desejado inválido", { status: 400 });
    }

    const offeredItem = await prisma.item.findUnique({
      where: { id: offeredItemId },
      select: { id: true, ownerId: true, status: true },
    });

    if (!offeredItem || offeredItem.status !== "ACTIVE") {
      return new Response("Item oferecido inválido", { status: 400 });
    }

    // offeredItem tem que ser do requester
    if (String(offeredItem.ownerId) !== String(requesterId)) {
      return new Response("O item oferecido não pertence ao requester.", { status: 403 });
    }

    // não pode trocar com você mesmo
    if (String(wantedItem.ownerId) === String(requesterId)) {
      return new Response("Você não pode trocar com você mesmo.", { status: 400 });
    }

    const trade = await prisma.trade.create({
      data: {
        requesterId,
        ownerId: wantedItem.ownerId,
        wantedItemId,
        offeredItemId,
        status: "PENDING",
        acceptedByOwner: null,
        requesterDone: false,
        ownerDone: false,
      },
      select: { id: true },
    });

    return Response.json(trade, { status: 201 });
  } catch (err) {
    console.error("TRADE_CREATE_ERROR", err);
    return new Response("Erro ao criar trade", { status: 500 });
  }
}