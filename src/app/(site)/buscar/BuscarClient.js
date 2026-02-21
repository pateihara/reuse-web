"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function BuscarClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo(
    () => ({
      q: sp.get("q") || "",
      category: sp.get("category") || "",
      size: sp.get("size") || "",
      condition: sp.get("condition") || "",
      city: sp.get("city") || "",
    }),
    [sp]
  );

  const [form, setForm] = useState(initial);

  function apply() {
    const params = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <input
          className="input input-bordered w-full"
          placeholder="Busque seu produto"
          value={form.q}
          onChange={(e) => setForm((p) => ({ ...p, q: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
        <button className="btn btn-primary" onClick={apply} aria-label="Buscar">
          🔎
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <select
          className="select select-bordered w-full"
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
        >
          <option value="">categoria</option>
          <option value="Roupa">Roupa</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Livros">Livros</option>
          <option value="Casa">Casa</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={form.size}
          onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
        >
          <option value="">tamanho</option>
          <option value="PP">PP</option>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={form.condition}
          onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))}
        >
          <option value="">estado do produto</option>
          <option value="Novo">Novo</option>
          <option value="Pouco usado">Pouco usado</option>
          <option value="Usado">Usado</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={form.city}
          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
        >
          <option value="">localização</option>
          <option value="Curitiba">Curitiba</option>
          <option value="São Paulo">São Paulo</option>
          <option value="Campinas">Campinas</option>
        </select>
      </div>
    </>
  );
}