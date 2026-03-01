// src/app/(site)/produto/[id]/TradeButton.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TradeButton({ wantedItemId }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [myItems, setMyItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const productRedirect = useMemo(() => `/produto/${wantedItemId}`, [wantedItemId]);

  async function loadMyItems() {
    setErrorMsg("");
    try {
      const res = await fetch(`/api/my-items?itemStatus=ACTIVE`, {
        cache: "no-store",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(productRedirect)}`);
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setMyItems([]);
        setErrorMsg(txt || "Não foi possível carregar seus itens.");
        return;
      }

      const data = await res.json().catch(() => []);
      setMyItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMyItems([]);
      setErrorMsg("Erro de rede ao carregar seus itens.");
    }
  }

  // abre modal automaticamente quando voltar de publicar-item
  useEffect(() => {
    const openTrade = searchParams.get("openTrade");
    if (openTrade === "1") setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // carrega itens ao abrir
  useEffect(() => {
    if (!open) return;
    loadMyItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function confirmTrade() {
    if (!selected || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          wantedItemId,
          offeredItemId: selected,
        }),
      });

      if (res.status === 401) {
        setLoading(false);
        router.push(`/login?redirect=${encodeURIComponent(productRedirect)}`);
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setErrorMsg(txt || "Não foi possível criar o trade.");
        setLoading(false);
        return;
      }

      // pode vir { id } ou { id, reused: true } se você aplicar o anti-duplicidade no backend
      const trade = await res.json();
      const tradeId = trade?.id;

      if (!tradeId) {
        setErrorMsg("Resposta inválida do servidor (trade sem id).");
        setLoading(false);
        return;
      }

      setLoading(false);
      setOpen(false);
      router.push(`/chat/${tradeId}`);
    } catch (e) {
      console.error(e);
      setErrorMsg("Erro de rede ao criar o trade.");
      setLoading(false);
    }
  }

  function goPublish() {
    // volta pro produto e já reabre a modal
    router.push(
      `/publicar-item?redirect=${encodeURIComponent(productRedirect)}&openTrade=1`
    );
  }

  function closeModal() {
    setOpen(false);
    setSelected(null);
    setErrorMsg("");
  }

  return (
    <>
      <button className="btn btn-primary w-full" onClick={() => setOpen(true)}>
        Trocar agora
      </button>

      <dialog className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg">Escolha o item que você vai oferecer</h3>
          <p className="text-sm opacity-70 mt-1">
            Selecione um item ativo do seu perfil ou publique um novo.
          </p>

          <div className="mt-4 flex gap-2 justify-end">
            <button className="btn btn-outline btn-sm" onClick={goPublish} type="button">
              Publicar novo item
            </button>
          </div>

          {errorMsg ? (
            <div className="alert alert-error mt-4">
              <span>{errorMsg}</span>
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myItems.map((it) => (
              <button
                key={it.id}
                onClick={() => setSelected(it.id)}
                type="button"
                className={`card border text-left ${
                  selected === it.id ? "border-primary" : "border-base-300"
                }`}
              >
                <div className="card-body p-4">
                  <p className="font-semibold">{it.title}</p>
                  <p className="text-sm opacity-70">
                    {it.city || "—"} {it.state ? `- ${it.state}` : ""}
                  </p>
                </div>
              </button>
            ))}

            {!myItems.length ? (
              <div className="alert mt-2">
                <span>Você ainda não tem itens ativos. Clique em “Publicar novo item”.</span>
              </div>
            ) : null}
          </div>

          <div className="modal-action">
            <button className="btn" onClick={closeModal} type="button" disabled={loading}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={confirmTrade}
              disabled={!selected || loading}
              type="button"
            >
              {loading ? "Criando..." : "Confirmar troca"}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}