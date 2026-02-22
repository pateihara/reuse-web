// src/app/api/messages/route.js
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

function isParticipant(userId, trade) {
  return (
    String(userId) === String(trade.requesterId) ||
    String(userId) === String(trade.ownerId)
  );
}

function canSendForTrade(trade) {
  // Trade encerrado
  if (["DONE", "CANCELED"].includes(trade.status)) return false;

  // Se algum item foi removido, encerra chat
  if (trade.offeredItem?.status === "DELETED") return false;
  if (trade.wantedItem?.status === "DELETED") return false;

  // Se você quiser bloquear também quando PAUSED, descomente:
  // if (trade.offeredItem?.status === "PAUSED") return false;
  // if (trade.wantedItem?.status === "PAUSED") return false;

  return true;
}

export async function GET(req) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return new Response("Não autenticado", { status: 401 });

  const { searchParams } = new URL(req.url);
  const tradeId = searchParams.get("tradeId");
  if (!tradeId) return new Response("tradeId é obrigatório", { status: 400 });

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

  if (!trade) return new Response("Trade não encontrado", { status: 404 });
  if (!isParticipant(userId, trade)) {
    return new Response("Você não participa desse trade", { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { tradeId },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({
    tradeStatus: trade.status,
    canSend: canSendForTrade(trade),
    messages,
  });
}

export async function POST(req) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return new Response("Não autenticado", { status: 401 });

  const body = await req.json();
  const tradeId = body?.tradeId;
  const content = String(body?.content || "");

  if (!tradeId) return new Response("tradeId é obrigatório", { status: 400 });
  if (!content.trim()) return new Response("content é obrigatório", { status: 400 });

  // Busca trade com status + itens pra aplicar regra de bloqueio
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

  if (!trade) return new Response("Trade não encontrado", { status: 404 });
  if (!isParticipant(userId, trade)) {
    return new Response("Você não participa desse trade", { status: 403 });
  }

  if (!canSendForTrade(trade)) {
    return new Response("Chat encerrado. Não é possível enviar mensagens.", { status: 400 });
  }

  const msg = await prisma.message.create({
    data: { tradeId, senderId: userId, content: content.trim() },
  });

  return Response.json(msg, { status: 201 });
}