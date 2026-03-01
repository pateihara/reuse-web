// src/app/(site)/produtos-trocados/TradedItemsClient.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function badgeForNegotiation(status) {
  if (status === "EM_NEGOCIACAO") return "badge-info";
  if (status === "CONCLUIDO") return "badge-success";
  return "badge-outline";
}

export default function TradedItemsClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  async function load() {
    setLoading(true);
    setAuthError(false);

    const qs = new URLSearchParams();
    qs.set("itemStatus", "TRADED");

    const res = await fetch(`/api/my-items?${qs.toString()}`, {
      cache: "no-store",
      credentials: "include",
    });

    if (res.status === 401) {
      setItems([]);
      setAuthError(true);
      setLoading(false);
      return;
    }

    const data = res.ok ? await res.json() : [];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    // ✅ evita chamar setState "direto" via função externa no body do effect
    (async () => {
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authError) {
    return (
      <div className="alert flex items-center justify-between">
        <span>Você precisa estar logado para ver seus produtos trocados.</span>
        <Link className="btn btn-sm btn-outline" href="/login?redirect=/produtos-trocados">
          Ir para login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="skeleton h-40 w-full" />;
  }

  if (!items.length) {
    return (
      <div className="alert flex items-center justify-between">
        <span>Você ainda não tem produtos trocados.</span>
        <Link className="btn btn-sm btn-outline" href="/meus-produtos">
          Ver meus produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="alert">
        <span>Total: {items.length} item(ns) trocado(s).</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => {
          const thumb = it.images?.[0]?.url || "/assets/reuse_logo_focus.svg";

          const negLabel =
            it.negotiationStatus === "EM_NEGOCIACAO"
              ? "Em negociação"
              : it.negotiationStatus === "CONCLUIDO"
              ? "Concluída"
              : "Livre";

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
                  <span className="badge badge-neutral">Concluído (TRADED)</span>
                  <span className={`badge ${badgeForNegotiation(it.negotiationStatus)}`}>
                    {negLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link className="btn btn-sm btn-outline" href={`/produto/${it.id}`}>
                    Ver
                  </Link>
                  <Link className="btn btn-sm btn-ghost" href="/meus-produtos">
                    Meus produtos
                  </Link>
                </div>

                <p className="text-xs opacity-70 mt-2">
                  Item trocado. Não é possível reativar.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}