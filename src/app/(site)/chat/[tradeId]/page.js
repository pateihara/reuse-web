// src/app/(site)/chat/[tradeId]/page.js
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/getUserFromCookies";
import ChatClient from "./ChatClient";
import TradeStatusActions from "./TradeStatusActions";
import ReviewCTA from "./ReviewCTA";

export default async function ChatPage({ params }) {
  const p = await params;
  const tradeId = p?.tradeId;

  if (!tradeId) {
    return <div className="p-6">tradeId ausente na rota.</div>;
  }

  const userId = await getUserIdFromCookies();

  if (!userId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="alert flex items-center justify-between">
          <span>Você precisa estar logado para acessar este chat.</span>
          <Link className="btn btn-sm btn-primary" href={`/login?redirect=/chat/${tradeId}`}>
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    include: {
      offeredItem: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
      wantedItem: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
      requester: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },
      // não precisa mandar mensagens aqui (agora o ChatClient busca via /api/messages)
      review: { select: { id: true } }, // opcional (se quiser usar server-side)
    },
  });

  if (!trade) {
    return <div className="p-6">Trade não encontrado.</div>;
  }

  const isParticipant =
    String(userId) === String(trade.requesterId) || String(userId) === String(trade.ownerId);

  if (!isParticipant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="alert alert-error flex items-center justify-between">
          <span>Você não participa desse trade.</span>
          <Link className="btn btn-sm btn-outline" href="/buscar">
            Voltar para buscar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Solicitação de troca</p>

            <p className="text-sm opacity-80">
              {trade.requester.name} ↔ {trade.owner.name}
            </p>

            <TradeStatusActions
              tradeId={trade.id}
              currentStatus={trade.status}
              requesterId={trade.requesterId}
              ownerId={trade.ownerId}
              acceptedByOwner={trade.acceptedByOwner}
              requesterDone={trade.requesterDone}
              ownerDone={trade.ownerDone}
              userId={userId} // ✅ vem do cookie
            />
          </div>

          <div className="divider my-3" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <p className="text-sm font-semibold">Oferecido</p>
              <p className="text-sm opacity-80">{trade.offeredItem.title}</p>
            </div>

            <div className="border rounded-lg p-3">
              <p className="text-sm font-semibold">Desejado</p>
              <p className="text-sm opacity-80">{trade.wantedItem.title}</p>
            </div>
          </div>
        </div>
      </div>

      <ReviewCTA
        tradeId={trade.id}
        tradeStatus={trade.status}
        requesterId={trade.requesterId}
        ownerId={trade.ownerId}
        userId={userId}
      />

      <ChatClient tradeId={trade.id} userId={userId} />
    </div>
  );
}