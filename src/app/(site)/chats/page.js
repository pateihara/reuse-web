// src/app/(site)/chats/page.js
import Link from "next/link";
import { getUserIdFromCookies } from "@/lib/getUserFromCookies";
import { prisma } from "@/lib/prisma";
import ChatsClient from "./ChatsClient";

export default async function ChatsPage() {
  const userId = await getUserIdFromCookies();

  if (!userId) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="alert flex items-center justify-between">
          <span>Você precisa estar logado para ver suas conversas.</span>
          <Link className="btn btn-sm btn-primary" href="/login?redirect=/chats">
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  const trades = await prisma.trade.findMany({
    where: { OR: [{ requesterId: userId }, { ownerId: userId }] },
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

      lastMessage: last?.content || "",
      lastMessageAt: last?.createdAt || null,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Minhas conversas</h1>
      <ChatsClient initialTrades={mapped} />
    </div>
  );
}