// src/app/api/my-chats/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Não autenticado", { status: 401 });

  const trades = await prisma.trade.findMany({
    where: {
      OR: [{ requesterId: userId }, { ownerId: userId }],
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      status: true,
      updatedAt: true,

      requesterId: true,
      ownerId: true,

      offeredItemId: true,
      wantedItemId: true,

      offeredItem: { select: { title: true, status: true } },
      wantedItem: { select: { title: true, status: true } },

      requester: { select: { name: true } },
      owner: { select: { name: true } },

      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
    },
  });

  const mapped = trades.map((t) => {
    const isRequester = String(t.requesterId) === String(userId);
    const otherUserName = isRequester ? t.owner?.name : t.requester?.name;

    // ✅ item que faz sentido pro usuário "ver"
    // - se eu sou requester, o item que eu quero ver normalmente é o wantedItem (do dono)
    // - se eu sou owner, o item que eu quero ver normalmente é o offeredItem (do requester)
    const viewItemId = isRequester ? t.wantedItemId : t.offeredItemId;
    const viewItemStatus = isRequester ? t.wantedItem?.status : t.offeredItem?.status;

    const last = t.messages?.[0];

    return {
      id: t.id,
      status: t.status,

      otherUserName,

      offeredItemId: t.offeredItemId,
      wantedItemId: t.wantedItemId,

      offeredItemTitle: t.offeredItem?.title || "—",
      wantedItemTitle: t.wantedItem?.title || "—",

      offeredItemStatus: t.offeredItem?.status || null,
      wantedItemStatus: t.wantedItem?.status || null,

      viewItemId,
      viewItemStatus,

      lastMessage: last?.content || "",
      lastMessageAt: last?.createdAt || null,
    };
  });

  return Response.json({ trades: mapped });
}