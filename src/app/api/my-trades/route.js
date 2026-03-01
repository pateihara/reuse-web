// src/app/api/my-trades/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

const IN_PROGRESS = ["PENDING", "CHAT_ACTIVE", "TRADE_MARKED"];
const FINISHED = ["DONE"]; // se quiser incluir CANCELED, troque para ["DONE", "CANCELED"]

export async function GET(req) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "in-progress" | "done" | null

  const where = {
    OR: [{ requesterId: userId }, { ownerId: userId }],
  };

  if (type === "in-progress") where.status = { in: IN_PROGRESS };
  if (type === "done") where.status = { in: FINISHED };

  const trades = await prisma.trade.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      scheduledAt: true,
      completedAt: true,

      requesterId: true,
      ownerId: true,

      requester: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },

      offeredItem: {
        select: {
          id: true,
          title: true,
          status: true,
          images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
        },
      },
      wantedItem: {
        select: {
          id: true,
          title: true,
          status: true,
          images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
        },
      },

      review: { select: { id: true } },
    },
  });

  const mapped = trades.map((t) => {
    const isRequester = String(t.requesterId) === String(userId);
    const otherUser = isRequester ? t.owner : t.requester;

    return {
      ...t,
      role: isRequester ? "REQUESTER" : "OWNER",
      otherUser,
    };
  });

  return Response.json({ trades: mapped });
}