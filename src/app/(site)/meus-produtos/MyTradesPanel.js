//src/app/(site)/meus-produtos/MyTradesPanel.js

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  if (status === "TRADE_MARKED") return "Troca marcada";
  if (status === "DONE") return "Concluída";
  if (status === "CANCELED") return "Cancelada";
  return status;
}

function TradeCard({ t }) {
  const offeredThumb = t.offeredItem?.images?.[0]?.url || "/assets/reuse_logo_focus.svg";
  const wantedThumb = t.wantedItem?.images?.[0]?.url || "/assets/reuse_logo_focus.svg";

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body p-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">
            {t.otherUser?.name || "Usuário"}
          </div>
          <span className={`badge ${badgeForTradeStatus(t.status)}`}>
            {labelForTradeStatus(t.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-lg p-3">
            <p className="text-xs font-semibold opacity-70 mb-1">Você ofereceu</p>
            <div className="flex items-center gap-2">
              <img src={offeredThumb} alt="" className="w-10 h-10 rounded object-cover" />
              <p className="text-sm">{t.offeredItem?.title}</p>
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <p className="text-xs font-semibold opacity-70 mb-1">Você quer</p>
            <div className="flex items-center gap-2">
              <img src={wantedThumb} alt="" className="w-10 h-10 rounded object-cover" />
              <p className="text-sm">{t.wantedItem?.title}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end pt-1">
          <Link className="btn btn-sm btn-outline" href={`/produto/${t.wantedItem?.id}`}>
            Ver desejado
          </Link>
          <Link className="btn btn-sm btn-primary" href={`/chat/${t.id}`}>
            Ir pro chat
          </Link>
        </div>

        {t.status === "DONE" ? (
          <p className="text-xs opacity-70">
            {t.review?.id ? "Avaliação registrada ✅" : "Avaliação pendente"}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function MyTradesPanel() {
  const [loading, setLoading] = useState(true);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/my-trades?type=in-progress", { cache: "no-store" }),
        fetch("/api/my-trades?type=done", { cache: "no-store" }),
      ]);

      if (r1.status === 401 || r2.status === 401) {
        setError("Você precisa estar logado para ver suas trocas.");
        setInProgress([]);
        setDone([]);
        setLoading(false);
        return;
      }

      const j1 = r1.ok ? await r1.json() : { trades: [] };
      const j2 = r2.ok ? await r2.json() : { trades: [] };

      setInProgress(j1.trades || []);
      setDone(j2.trades || []);
    } catch (e) {
      setError("Erro ao carregar trocas.");
      setInProgress([]);
      setDone([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Minhas trocas</h2>
        <button className="btn btn-sm btn-outline" onClick={load} disabled={loading}>
          Atualizar
        </button>
      </div>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}

      <div className="space-y-3">
        <h3 className="font-semibold">Trocas em andamento</h3>
        {loading ? <div className="skeleton h-28 w-full" /> : null}
        {!loading && inProgress.length === 0 ? (
          <div className="alert">
            <span>Nenhuma troca em andamento.</span>
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgress.map((t) => (
            <TradeCard key={t.id} t={t} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Trocas concluídas</h3>
        {!loading && done.length === 0 ? (
          <div className="alert">
            <span>Nenhuma troca concluída.</span>
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {done.map((t) => (
            <TradeCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}