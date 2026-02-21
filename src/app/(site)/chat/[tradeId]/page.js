//src/app/(site)/chat/[tradeId]/page.js
import { prisma } from "@/lib/prisma";
import ChatClient from "./ChatClient";
import TradeStatusActions from "./TradeStatusActions";

export default async function ChatPage({ params }) {
  const { tradeId } = await params;

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    include: {
      offeredItem: {
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      },
      wantedItem: {
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      },
      messages: { orderBy: { createdAt: "asc" } },

      requester: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },

      // campos do fluxo novo (aceite + confirmações)
      // (não precisa de select separado, porque o include já traz tudo do Trade)
    },
  });

  if (!trade) return <div className="p-6">Trade não encontrado.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      {/* Card de resumo + ações */}
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

      {/* Chat */}
      <ChatClient tradeId={trade.id} initialMessages={trade.messages} />
    </div>
  );
}