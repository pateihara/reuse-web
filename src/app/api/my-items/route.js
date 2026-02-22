// src/app/api/my-items/route.js
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return new Response("Não autenticado", { status: 401 });

  const { searchParams } = new URL(req.url);

  // filtros opcionais
  const itemStatus = searchParams.get("itemStatus"); // ACTIVE | PAUSED | TRADED
  const negotiation = searchParams.get("negotiation"); // LIVRE | EM_NEGOCIACAO | CONCLUIDO

  const where = {
    ownerId: userId,
    status: { in: ["ACTIVE", "PAUSED", "TRADED"] }, // não traz DELETED
    ...(itemStatus ? { status: itemStatus } : {}),
  };

  const items = await prisma.item.findMany({
    where,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      tradesOffered: {
        select: { status: true, id: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      tradesWanted: {
        select: { status: true, id: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const mapped = items.map((it) => {
    const tradeStatuses = [...it.tradesOffered, ...it.tradesWanted].map((t) => t.status);

    const inNegotiation = tradeStatuses.some((s) =>
      ["PENDING", "CHAT_ACTIVE", "TRADE_MARKED"].includes(s)
    );
    const done = tradeStatuses.includes("DONE");

    let negotiationStatus = "LIVRE";
    if (done) negotiationStatus = "CONCLUIDO";
    else if (inNegotiation) negotiationStatus = "EM_NEGOCIACAO";

    return { ...it, negotiationStatus };
  });

  const filtered =
    negotiation && ["LIVRE", "EM_NEGOCIACAO", "CONCLUIDO"].includes(negotiation)
      ? mapped.filter((it) => it.negotiationStatus === negotiation)
      : mapped;

  return Response.json(filtered);
}