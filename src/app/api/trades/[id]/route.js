// src/app/api/trades/[id]/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function PATCH(req, ctx) {
  const { id } = await ctx.params;

  const userId = getUserIdFromRequest(req);
  if (!userId) return new Response("Não autenticado", { status: 401 });

  const body = await req.json();
  const { action } = body;

  if (!action) {
    return new Response("action é obrigatório", { status: 400 });
  }

  const trade = await prisma.trade.findUnique({
    where: { id },
    select: {
      id: true,
      requesterId: true,
      ownerId: true,
      status: true,
      acceptedByOwner: true,
      requesterDone: true,
      ownerDone: true,
      offeredItemId: true,
      wantedItemId: true,
    },
  });

  if (!trade) return new Response("Trade não encontrado", { status: 404 });

  const isRequester = String(userId) === String(trade.requesterId);
  const isOwner = String(userId) === String(trade.ownerId);

  if (!isRequester && !isOwner) {
    return new Response("Você não participa desse trade", { status: 403 });
  }

  if (action === "ACCEPT") {
    if (!isOwner) return new Response("Só o owner pode aceitar", { status: 403 });
    if (trade.status !== "PENDING") return new Response("Trade não está pendente", { status: 400 });

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "CHAT_ACTIVE", acceptedByOwner: true },
    });

    return Response.json(updated);
  }

  if (action === "REJECT") {
    if (!isOwner) return new Response("Só o owner pode recusar", { status: 403 });
    if (trade.status !== "PENDING") return new Response("Trade não está pendente", { status: 400 });

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "CANCELED", acceptedByOwner: false },
    });

    return Response.json(updated);
  }

  if (action === "CANCEL") {
    if (trade.status === "DONE") return new Response("Trade já concluído", { status: 400 });

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "CANCELED" },
    });

    return Response.json(updated);
  }

  if (action === "MARK_MEET") {
    if (trade.status !== "CHAT_ACTIVE") return new Response("Trade não está ativo", { status: 400 });

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "TRADE_MARKED", scheduledAt: new Date() },
    });

    return Response.json(updated);
  }

  if (action === "CONFIRM_DONE") {
    if (trade.status !== "CHAT_ACTIVE" && trade.status !== "TRADE_MARKED") {
      return new Response("Trade ainda não está ativo", { status: 400 });
    }

    const data = {};
    if (isRequester) data.requesterDone = true;
    if (isOwner) data.ownerDone = true;

    const partial = await prisma.trade.update({
      where: { id },
      data,
      select: { id: true, requesterDone: true, ownerDone: true, status: true },
    });

    if (partial.requesterDone && partial.ownerDone) {
      const result = await prisma.$transaction(async (tx) => {
        const updatedTrade = await tx.trade.update({
          where: { id },
          data: { status: "DONE", completedAt: new Date() },
        });

        await tx.item.update({
          where: { id: trade.offeredItemId },
          data: { status: "TRADED" },
        });

        await tx.item.update({
          where: { id: trade.wantedItemId },
          data: { status: "TRADED" },
        });

        return updatedTrade;
      });

      return Response.json(result);
    }

    return Response.json(partial);
  }

  return new Response("action inválida", { status: 400 });
}