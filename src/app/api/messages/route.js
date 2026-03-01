// src/app/api/messages/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

function isParticipant(userId, trade) {
  return (
    String(userId) === String(trade.requesterId) ||
    String(userId) === String(trade.ownerId)
  );
}

function canSendForTrade(trade) {
  if (["DONE", "CANCELED"].includes(trade.status)) return false;
  if (trade.offeredItem?.status === "DELETED") return false;
  if (trade.wantedItem?.status === "DELETED") return false;
  return true;
}

export async function GET(req) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return jsonError("Não autenticado", 401);

  const { searchParams } = new URL(req.url);
  const tradeId = searchParams.get("tradeId");
  if (!tradeId) return jsonError("tradeId é obrigatório", 400);

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    select: {
      id: true,
      requesterId: true,
      ownerId: true,
      status: true,
      requesterDone: true,
      ownerDone: true,
      offeredItem: { select: { status: true } },
      wantedItem: { select: { status: true } },
    },
  });

  if (!trade) return jsonError("Trade não encontrado", 404);
  if (!isParticipant(userId, trade)) return jsonError("Você não participa desse trade", 403);

  const messages = await prisma.message.findMany({
    where: { tradeId },
    orderBy: { createdAt: "asc" },
  });

  const myRole =
    String(userId) === String(trade.requesterId)
      ? "REQUESTER"
      : "OWNER";

  const iConfirmed = myRole === "REQUESTER" ? !!trade.requesterDone : !!trade.ownerDone;
  const otherConfirmed = myRole === "REQUESTER" ? !!trade.ownerDone : !!trade.requesterDone;

  return Response.json({
    tradeStatus: trade.status,
    canSend: canSendForTrade(trade),
    messages,

    // extras p/ UX do chat
    requesterDone: !!trade.requesterDone,
    ownerDone: !!trade.ownerDone,
    myRole,
    iConfirmed,
    otherConfirmed,
  });
}

export async function POST(req) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return jsonError("Não autenticado", 401);

  const body = await req.json().catch(() => ({}));
  const tradeId = body?.tradeId;
  const content = String(body?.content || "");

  if (!tradeId) return jsonError("tradeId é obrigatório", 400);
  if (!content.trim()) return jsonError("content é obrigatório", 400);

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    select: {
      requesterId: true,
      ownerId: true,
      status: true,
      offeredItem: { select: { status: true } },
      wantedItem: { select: { status: true } },
    },
  });

  if (!trade) return jsonError("Trade não encontrado", 404);
  if (!isParticipant(userId, trade)) return jsonError("Você não participa desse trade", 403);

  if (!canSendForTrade(trade)) {
    return jsonError("Chat encerrado. Não é possível enviar mensagens.", 400);
  }

  const msg = await prisma.message.create({
    data: { tradeId, senderId: userId, content: content.trim() },
  });

  return Response.json(msg, { status: 201 });
}