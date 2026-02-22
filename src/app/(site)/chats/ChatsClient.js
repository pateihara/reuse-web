//src/app/(site)/chats/ChatsClient.js
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function badgeForTradeStatus(status) {
  if (status === "PENDING") return "badge-warning";
  if (status === "CHAT_ACTIVE") return "badge-info";
  if (status === "TRADE_MARKED") return "badge-accent";
  if (status === "DONE") return "badge-success";
  if (status === "CANCELED") return "badge-error";
  return "badge-outline";
}

function labelForTradeStatus(status) {
  if (status === "PENDING") return "Pendente";
  if (status === "CHAT_ACTIVE") return "Chat ativo";
  if (status === "TRADE_MARKED") return "Marcada";
  if (status === "DONE") return "Concluída";
  if (status === "CANCELED") return "Cancelada";
  return status;
}

function canSendMessage(trade) {
  if (trade.status === "CANCELED") return false;
  if (trade.status === "DONE") return false; // só leitura
  if (trade.offeredItemStatus === "DELETED") return false;
  if (trade.wantedItemStatus === "DELETED") return false;
  return true;
}

function TradeCard({ t }) {
  const otherName = t.otherUserName || "Usuário";
  const blocked = !canSendMessage(t);

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{otherName}</p>
          <span className={`badge ${badgeForTradeStatus(t.status)}`}>
            {labelForTradeStatus(t.status)}
          </span>
        </div>

        <div className="text-sm opacity-80">
          <p>
            <span className="font-semibold">Oferecido:</span> {t.offeredItemTitle}
          </p>
          <p>
            <span className="font-semibold">Desejado:</span> {t.wantedItemTitle}
          </p>
        </div>

        <div className="text-sm opacity-70">
          {t.lastMessage ? (
            <>
              <p className="truncate">
                <span className="font-semibold">Última:</span> {t.lastMessage}
              </p>
              <p className="text-xs opacity-60">
                {t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleString() : ""}
              </p>
            </>
          ) : (
            <p>Sem mensagens ainda.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Link className="btn btn-sm btn-outline" href={`/produto/${t.wantedItemId}`}>
            Ver item
          </Link>

          {/* Eu prefiro abrir mesmo quando bloqueado (só leitura),
              mas se quiser bloquear total, mantenha desabilitado. */}
          <Link className="btn btn-sm btn-primary" href={`/chat/${t.id}`}>
            Abrir chat
          </Link>
        </div>

        {blocked ? (
          <p className="text-xs opacity-70">
            Conversa encerrada (troca finalizada/cancelada ou item removido).
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function ChatsClient({ initialTrades }) {
  const [rows, setRows] = useState(Array.isArray(initialTrades) ? initialTrades : []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function refresh() {
    setLoading(true);
    setErr("");

    const res = await fetch("/api/my-chats", { cache: "no-store", credentials: "include" });

    if (res.status === 401) {
      setErr("Você precisa estar logado para ver suas conversas.");
      setRows([]);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErr(await res.text());
      setRows([]);
      setLoading(false);
      return;
    }

    const json = await res.json();
    setRows(json?.trades || []);
    setLoading(false);
  }

  const empty = useMemo(() => rows.length === 0, [rows.length]);

  if (err) {
    return (
      <div className="alert alert-error flex items-center justify-between">
        <span>{err}</span>
        <Link className="btn btn-sm btn-outline" href="/login">
          Ir para login
        </Link>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="alert flex items-center justify-between">
        <span>Você ainda não tem conversas.</span>
        <Link className="btn btn-sm btn-primary" href="/buscar">
          Buscar itens
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button className="btn btn-sm btn-outline" onClick={refresh} disabled={loading}>
          {loading ? "..." : "Atualizar"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((t) => (
          <TradeCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}