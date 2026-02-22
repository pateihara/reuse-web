//src/app/(site)/meus-produtos/MyItemsClient.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function badgeForItemStatus(status) {
  if (status === "ACTIVE") return "badge-success";
  if (status === "PAUSED") return "badge-warning";
  if (status === "TRADED") return "badge-neutral";
  return "badge-outline";
}

function badgeForNegotiation(status) {
  if (status === "EM_NEGOCIACAO") return "badge-info";
  if (status === "CONCLUIDO") return "badge-success";
  return "badge-outline";
}

export default function MyItemsClient() {
  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("reuse_user_id");
  }, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    itemStatus: "", // ACTIVE | PAUSED | TRADED | ""
    negotiation: "", // LIVRE | EM_NEGOCIACAO | CONCLUIDO | ""
  });

  async function load() {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const qs = new URLSearchParams();
    qs.set("userId", userId);
    if (filters.itemStatus) qs.set("itemStatus", filters.itemStatus);
    if (filters.negotiation) qs.set("negotiation", filters.negotiation);

    const res = await fetch(`/api/my-items?${qs.toString()}`, { cache: "no-store" });
    const data = res.ok ? await res.json() : [];
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.itemStatus, filters.negotiation]);

  async function setStatus(itemId, status) {
    const res = await fetch(`/api/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    load();
  }

  if (!userId) {
    return (
      <div className="alert flex items-center justify-between">
        <span>Você precisa estar logado para ver seus produtos.</span>
        <Link className="btn btn-sm btn-outline" href="/login">
          Ir para login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          className="select select-bordered w-full"
          value={filters.itemStatus}
          onChange={(e) => setFilters((p) => ({ ...p, itemStatus: e.target.value }))}
        >
          <option value="">Status do item (todos)</option>
          <option value="ACTIVE">Ativo</option>
          <option value="PAUSED">Pausado</option>
          <option value="TRADED">Concluído (trocado)</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={filters.negotiation}
          onChange={(e) => setFilters((p) => ({ ...p, negotiation: e.target.value }))}
        >
          <option value="">Status negociação (todos)</option>
          <option value="LIVRE">Livre</option>
          <option value="EM_NEGOCIACAO">Em negociação</option>
          <option value="CONCLUIDO">Concluída</option>
        </select>
      </div>

      {loading ? <div className="skeleton h-40 w-full" /> : null}

      {!loading && !items.length ? (
        <div className="alert flex items-center justify-between">
          <span>Nenhum item encontrado com os filtros selecionados.</span>
          <Link className="btn btn-sm btn-primary" href="/publicar-item">
            Publicar item
          </Link>
        </div>
      ) : null}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => {
          const thumb = it.images?.[0]?.url || "/assets/reuse_logo_focus.svg";

          const itemStatusLabel =
            it.status === "ACTIVE" ? "Ativo" : it.status === "PAUSED" ? "Pausado" : "Concluído";

          const negLabel =
            it.negotiationStatus === "EM_NEGOCIACAO"
              ? "Em negociação"
              : it.negotiationStatus === "CONCLUIDO"
              ? "Concluída"
              : "Livre";

          const isLocked = it.status === "TRADED"; // concluiu, não faz mais nada

          return (
            <div key={it.id} className="card bg-base-100 shadow">
              <figure className="relative h-44 bg-base-200">
                <Image src={thumb} alt={it.title} fill className="object-cover" />
              </figure>

              <div className="card-body p-4">
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm opacity-70">
                  {it.city || "—"} {it.state ? `- ${it.state}` : ""}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`badge ${badgeForItemStatus(it.status)}`}>
                    {itemStatusLabel}
                  </span>
                  <span className={`badge ${badgeForNegotiation(it.negotiationStatus)}`}>
                    {negLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link className="btn btn-sm btn-outline" href={`/produto/${it.id}`}>
                    Ver
                  </Link>

                  {/* Pausar/Ativar só se não estiver concluído */}
                  {isLocked ? null : it.status === "ACTIVE" ? (
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => setStatus(it.id, "PAUSED")}
                    >
                      Pausar
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => setStatus(it.id, "ACTIVE")}
                    >
                      Ativar
                    </button>
                  )}

                  {/* Excluir sempre (soft delete) */}
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => setStatus(it.id, "DELETED")}
                    disabled={false}
                  >
                    Excluir
                  </button>
                </div>

                {isLocked ? (
                  <p className="text-xs opacity-70 mt-2">
                    Item concluído (trocado). Não é possível reativar.
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}