// src/app/(site)/chat/[tradeId]/TradeStatusActions.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

  // ✅ estado local para refletir mudanças sem depender do refresh lento
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [localRequesterDone, setLocalRequesterDone] = useState(!!requesterDone);
  const [localOwnerDone, setLocalOwnerDone] = useState(!!ownerDone);

  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    setLocalRequesterDone(!!requesterDone);
  }, [requesterDone]);

  useEffect(() => {
    setLocalOwnerDone(!!ownerDone);
  }, [ownerDone]);

  const isRequester = userId && String(userId) === String(requesterId);
  const isOwner = userId && String(userId) === String(ownerId);

  const iConfirmed = useMemo(() => {
    if (isRequester) return localRequesterDone;
    if (isOwner) return localOwnerDone;
    return false;
  }, [isRequester, isOwner, localRequesterDone, localOwnerDone]);

  const otherConfirmed = useMemo(() => {
    if (isRequester) return localOwnerDone;
    if (isOwner) return localRequesterDone;
    return false;
  }, [isRequester, isOwner, localRequesterDone, localOwnerDone]);

  const bothConfirmed = localRequesterDone && localOwnerDone;

  async function act(action) {
    setLoading(true);

    // ✅ otimista (melhora UX instantânea)
    if (action === "MARK_MEET" && localStatus === "CHAT_ACTIVE") {
      setLocalStatus("TRADE_MARKED");
    }
    if (action === "CONFIRM_DONE") {
      if (isRequester) setLocalRequesterDone(true);
      if (isOwner) setLocalOwnerDone(true);
    }
    if (action === "ACCEPT" && localStatus === "PENDING") {
      setLocalStatus("CHAT_ACTIVE");
    }
    if (action === "REJECT" || action === "CANCEL") {
      setLocalStatus("CANCELED");
    }

    const res = await fetch(`/api/trades/${tradeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
      credentials: "include",
    });

    if (!res.ok) {
      // rollback simples: força refresh para voltar ao estado real
      alert(await res.text());
      setLoading(false);
      router.refresh();
      return;
    }

    // se vier um trade atualizado, tenta sincronizar local também
    const json = await res.json().catch(() => null);
    if (json?.status) setLocalStatus(json.status);

    setLoading(false);
    router.refresh();
  }

  let banner = null;

  if (localStatus === "PENDING") {
    if (isRequester) banner = "Aguardando resposta do usuário…";
    if (isOwner) banner = "Você recebeu uma solicitação de troca.";
  }

  if (localStatus === "CHAT_ACTIVE") banner = "Troca aceita. Use o chat para combinar detalhes.";
  if (localStatus === "TRADE_MARKED") banner = "Troca marcada. Confirme quando concluir.";
  if (localStatus === "DONE") banner = "Troca concluída ✅";
  if (localStatus === "CANCELED") banner = "Troca cancelada.";

  // ✅ banner extra de confirmação
  const showConfirmHint =
    ["CHAT_ACTIVE", "TRADE_MARKED"].includes(localStatus) && !bothConfirmed;

  const confirmHint =
    showConfirmHint && iConfirmed && !otherConfirmed
      ? "Você já confirmou. Aguardando o outro usuário confirmar…"
      : showConfirmHint && !iConfirmed && otherConfirmed
      ? "O outro usuário já confirmou. Falta você confirmar para concluir."
      : null;

  const canAcceptReject = localStatus === "PENDING" && isOwner;
  const canChatFlow = localStatus === "CHAT_ACTIVE" || localStatus === "TRADE_MARKED";

  return (
    <div className="flex flex-col gap-2">
      {banner ? (
        <div className="alert">
          <span>{banner}</span>
        </div>
      ) : null}

      {confirmHint ? (
        <div className={`alert ${iConfirmed ? "alert-info" : "alert-warning"}`}>
          <span>{confirmHint}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 items-center">
        <span className="badge badge-outline">Status: {localStatus}</span>

        {canAcceptReject ? (
          <>
            <button
              className="btn btn-sm btn-success"
              onClick={() => act("ACCEPT")}
              disabled={loading}
            >
              Aceitar
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => act("REJECT")}
              disabled={loading}
            >
              Recusar
            </button>
          </>
        ) : null}

        {canChatFlow ? (
          <>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => act("MARK_MEET")}
              disabled={loading || localStatus !== "CHAT_ACTIVE"}
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

            <button
              className="btn btn-sm btn-error"
              onClick={() => act("CANCEL")}
              disabled={loading || localStatus === "DONE"}
            >
              Cancelar
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}