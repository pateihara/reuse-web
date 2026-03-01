// src/app/api/trades/[id]/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function PATCH(req, ctx) {
  const { id } = await ctx.params;

  const userId = await getUserIdFromRequest(req);
  if (!userId) return jsonError("Não autenticado", 401);

  const body = await req.json().catch(() => ({}));
  const { action, scheduledAt } = body;

  if (!action) return jsonError("action é obrigatório", 400);

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
      offeredItem: { select: { id: true, status: true } },
      wantedItem: { select: { id: true, status: true } },
    },
  });

  if (!trade) return jsonError("Trade não encontrado", 404);

  const isRequester = String(userId) === String(trade.requesterId);
  const isOwner = String(userId) === String(trade.ownerId);
  if (!isRequester && !isOwner) return jsonError("Você não participa desse trade", 403);

  const isFinished = trade.status === "DONE" || trade.status === "CANCELED";
  const anyItemDeleted =
    trade.offeredItem?.status === "DELETED" || trade.wantedItem?.status === "DELETED";

  // Travas gerais
  if (isFinished && action !== "CANCEL") {
    return jsonError("Trade já finalizado (DONE/CANCELED).", 400);
  }

  if (anyItemDeleted && ["ACCEPT", "MARK_MEET", "CONFIRM_DONE"].includes(action)) {
    return jsonError("Não é possível continuar: um dos itens foi removido (DELETED).", 400);
  }

  if (action === "ACCEPT") {
    if (!isOwner) return jsonError("Só o owner pode aceitar", 403);
    if (trade.status !== "PENDING") return jsonError("Trade não está pendente", 400);

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "CHAT_ACTIVE", acceptedByOwner: true },
    });

    return Response.json(updated);
  }

  if (action === "REJECT") {
    if (!isOwner) return jsonError("Só o owner pode recusar", 403);
    if (trade.status !== "PENDING") return jsonError("Trade não está pendente", 400);

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "CANCELED", acceptedByOwner: false },
    });

    return Response.json(updated);
  }

  if (action === "CANCEL") {
    if (trade.status === "DONE") return jsonError("Trade já concluído", 400);

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "CANCELED" },
    });

    return Response.json(updated);
  }

  if (action === "MARK_MEET") {
    if (trade.status !== "CHAT_ACTIVE") return jsonError("Trade não está ativo", 400);

    const date =
      scheduledAt && !Number.isNaN(Date.parse(scheduledAt)) ? new Date(scheduledAt) : new Date();

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "TRADE_MARKED", scheduledAt: date },
    });

    return Response.json(updated);
  }

  if (action === "CONFIRM_DONE") {
    if (trade.status !== "CHAT_ACTIVE" && trade.status !== "TRADE_MARKED") {
      return jsonError("Trade ainda não está ativo", 400);
    }

    const data = {};
    if (isRequester) data.requesterDone = true;
    if (isOwner) data.ownerDone = true;

    // Marca confirmação do usuário atual
    const partial = await prisma.trade.update({
      where: { id },
      data,
      select: { id: true, requesterDone: true, ownerDone: true, status: true },
    });

    // Se ambos confirmaram, finaliza e marca itens como TRADED em transação
    if (partial.requesterDone && partial.ownerDone) {
      const result = await prisma.$transaction(async (tx) => {
        const updatedTrade = await tx.trade.update({
          where: { id },
          data: { status: "DONE", completedAt: new Date() },
        });

        await tx.item.update({ where: { id: trade.offeredItemId }, data: { status: "TRADED" } });
        await tx.item.update({ where: { id: trade.wantedItemId }, data: { status: "TRADED" } });

        return updatedTrade;
      });

      return Response.json(result);
    }

    return Response.json(partial);
  }

  return jsonError("action inválida", 400);
}