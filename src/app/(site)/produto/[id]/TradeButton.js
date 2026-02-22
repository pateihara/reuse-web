//src/app/(site)/produto/[id]/TradeButton.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TradeButton({ wantedItemId }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [myItems, setMyItems] = useState([]);
  const [selected, setSelected] = useState(null);

  async function loadMyItems() {
    const res = await fetch(`/api/my-items?itemStatus=ACTIVE`, {
  cache: "no-store",
  credentials: "include",
});

    if (res.status === 401) {
      router.push(`/login?redirect=/produto/${wantedItemId}`);
      return;
    }

    const data = res.ok ? await res.json() : [];
    setMyItems(Array.isArray(data) ? data : []);
  }

  // abre modal automaticamente quando voltar de publicar-item
  useEffect(() => {
    const openTrade = searchParams.get("openTrade");
    if (openTrade === "1") {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open) loadMyItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function confirmTrade() {
    if (!selected) return;

    setLoading(true);

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
      router.push(`/login?redirect=/produto/${wantedItemId}`);
      return;
    }

    if (!res.ok) {
      const txt = await res.text();
      alert(txt);
      setLoading(false);
      return;
    }

    const trade = await res.json();
    setLoading(false);
    setOpen(false);
    router.push(`/chat/${trade.id}`);
  }

  function goPublish() {
    // volta pro produto e já reabre a modal
    router.push(`/publicar-item?redirect=/produto/${wantedItemId}&openTrade=1`);
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
            <button className="btn btn-outline btn-sm" onClick={goPublish}>
              Publicar novo item
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myItems.map((it) => (
              <button
                key={it.id}
                onClick={() => setSelected(it.id)}
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
              <div className="alert">
                <span>Você ainda não tem itens ativos. Clique em “Publicar novo item”.</span>
              </div>
            ) : null}
          </div>

          <div className="modal-action">
            <button className="btn" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={confirmTrade}
              disabled={!selected || loading}
            >
              {loading ? "Criando..." : "Confirmar troca"}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop" onClick={() => setOpen(false)}>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}