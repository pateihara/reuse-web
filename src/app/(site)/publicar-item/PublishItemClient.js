//src/app/(site)/publicar-item/PublishItemClient.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PublishItemClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const redirect = sp.get("redirect");
  const openTrade = sp.get("openTrade");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    city: "",
    state: "",
    image1: "/assets/reuse_logo_focus.svg",
    image2: "",
    image3: "",
  });

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function submit() {
    if (!form.title.trim()) {
      alert("Preencha o título do item.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category,
        size: form.size,
        condition: form.condition,
        city: form.city,
        state: form.state,
        imageUrls: [form.image1, form.image2, form.image3].filter(Boolean),
      }),
    });

    // ✅ cookie auth: se não autenticado, manda pro login preservando o fluxo atual
    if (res.status === 401) {
      setLoading(false);

      // mantém querystring atual (redirect/openTrade) para voltar certinho depois do login
      const current = `/publicar-item?${sp.toString()}`;
      router.push(`/login?redirect=${encodeURIComponent(current)}`);
      return;
    }

    if (!res.ok) {
      alert(await res.text());
      setLoading(false);
      return;
    }

    const item = await res.json();
    setLoading(false);

    // volta para o produto e reabre modal, se veio desse fluxo
    if (redirect) {
      const qs = openTrade ? `?openTrade=${encodeURIComponent(openTrade)}` : "";
      router.push(`${redirect}${qs}`);
    } else {
      router.push(`/produto/${item.id}`);
    }
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <input
            className="input input-bordered w-full"
            placeholder="Nome do item"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Descrição do item"
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input input-bordered w-full"
            placeholder="Categoria (ex: Roupa)"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
          />

          <input
            className="input input-bordered w-full"
            placeholder="Tamanho (ex: M)"
            value={form.size}
            onChange={(e) => setField("size", e.target.value)}
          />

          <input
            className="input input-bordered w-full"
            placeholder="Estado/Condição (ex: Pouco usado)"
            value={form.condition}
            onChange={(e) => setField("condition", e.target.value)}
          />

          <input
            className="input input-bordered w-full"
            placeholder="Cidade"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
          />

          <input
            className="input input-bordered w-full"
            placeholder="UF (ex: PR)"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
          />
        </div>

        <div className="divider">Fotos (URLs por enquanto)</div>

        <div className="grid grid-cols-1 gap-3">
          <input
            className="input input-bordered w-full"
            placeholder="Imagem 1 (URL)"
            value={form.image1}
            onChange={(e) => setField("image1", e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Imagem 2 (URL)"
            value={form.image2}
            onChange={(e) => setField("image2", e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Imagem 3 (URL)"
            value={form.image3}
            onChange={(e) => setField("image3", e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? "Publicando..." : "Publicar"}
        </button>

        <p className="text-xs opacity-70">
          *No MVP, as fotos são URLs. Depois a gente troca por upload.
        </p>
      </div>
    </div>
  );
}