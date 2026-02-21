//src/app/api/trades/[id]/route.js
import { prisma } from "@/lib/prisma";

export async function PATCH(req, ctx) {
  const { id } = await ctx.params;
  const body = await req.json();

  const { action, userId } = body;

  if (!action || !userId) {
    return new Response("action e userId são obrigatórios", { status: 400 });
  }

  const trade = await prisma.trade.findUnique({
    where: { id },
    select: { id: true, requesterId: true, ownerId: true, status: true, acceptedByOwner: true, requesterDone: true, ownerDone: true },
  });

  if (!trade) return new Response("Trade não encontrado", { status: 404 });

  const isRequester = userId === trade.requesterId;
  const isOwner = userId === trade.ownerId;

  if (!isRequester && !isOwner) {
    return new Response("Você não participa desse trade", { status: 403 });
  }

  // AÇÕES
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
    // qualquer um pode cancelar se ainda não estiver DONE
    if (trade.status === "DONE") return new Response("Trade já concluído", { status: 400 });

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "CANCELED" },
    });
    return Response.json(updated);
  }

  if (action === "CONFIRM_DONE") {
    // só faz sentido se já foi aceito
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

    // se ambos confirmaram -> DONE
    if (partial.requesterDone && partial.ownerDone) {
      const updated = await prisma.trade.update({
        where: { id },
        data: { status: "DONE", completedAt: new Date() },
      });
      return Response.json(updated);
    }

    return Response.json(partial);
  }

  if (action === "MARK_MEET") {
    // opcional: marcar troca (combinar)
    if (trade.status !== "CHAT_ACTIVE") return new Response("Trade não está ativo", { status: 400 });

    const updated = await prisma.trade.update({
      where: { id },
      data: { status: "TRADE_MARKED", scheduledAt: new Date() },
    });
    return Response.json(updated);
  }

  return new Response("action inválida", { status: 400 });
}