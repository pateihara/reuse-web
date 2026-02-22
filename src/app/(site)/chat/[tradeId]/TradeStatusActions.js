//src/app/(site)/chat/[tradeId]/TradeStatusActions.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TradeStatusActions({
  tradeId,
  currentStatus,
  requesterId,
  ownerId,
  acceptedByOwner,
  requesterDone,
  ownerDone,
  userId,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isRequester = userId && String(userId) === String(requesterId);
  const isOwner = userId && String(userId) === String(ownerId);

  async function act(action) {
    setLoading(true);
    const res = await fetch(`/api/trades/${tradeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
      credentials: "include",
    });

    if (!res.ok) {
      alert(await res.text());
      setLoading(false);
      return;
    }
    setLoading(false);
    router.refresh();
  }

  let banner = null;

  if (currentStatus === "PENDING") {
    if (isRequester) banner = "Aguardando resposta do usuário…";
    if (isOwner) banner = "Você recebeu uma solicitação de troca.";
  }
  if (currentStatus === "CHAT_ACTIVE") banner = "Troca aceita. Use o chat para combinar detalhes.";
  if (currentStatus === "TRADE_MARKED") banner = "Troca marcada. Confirme quando concluir.";
  if (currentStatus === "DONE") banner = "Troca concluída ✅";
  if (currentStatus === "CANCELED") banner = "Troca cancelada.";

  const canAcceptReject = currentStatus === "PENDING" && isOwner;
  const canChatFlow = currentStatus === "CHAT_ACTIVE" || currentStatus === "TRADE_MARKED";

  const iConfirmed = isRequester ? requesterDone : isOwner ? ownerDone : false;
  const bothConfirmed = requesterDone && ownerDone;

  return (
    <div className="flex flex-col gap-2">
      {banner ? (
        <div className="alert">
          <span>{banner}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 items-center">
        <span className="badge badge-outline">Status: {currentStatus}</span>

        {canAcceptReject ? (
          <>
            <button className="btn btn-sm btn-success" onClick={() => act("ACCEPT")} disabled={loading}>
              Aceitar
            </button>
            <button className="btn btn-sm btn-error" onClick={() => act("REJECT")} disabled={loading}>
              Recusar
            </button>
          </>
        ) : null}

        {canChatFlow ? (
          <>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => act("MARK_MEET")}
              disabled={loading || currentStatus !== "CHAT_ACTIVE"}
            >
              Marcar troca
            </button>

            <button
              className="btn btn-sm btn-success"
              onClick={() => act("CONFIRM_DONE")}
              disabled={loading || iConfirmed || bothConfirmed}
            >
              {iConfirmed ? "Você já confirmou" : "Concluir troca"}
            </button>

            <button className="btn btn-sm btn-error" onClick={() => act("CANCEL")} disabled={loading || currentStatus === "DONE"}>
              Cancelar
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}