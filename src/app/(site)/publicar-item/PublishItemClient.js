//src/app/(site)/publicar-item/PublishItemClient.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

async function uploadOne(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Falha no upload.");
  return data.url;
}

export default function PublishItemClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const redirect = sp.get("redirect");
  const openTrade = sp.get("openTrade");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    city: "",
    state: "",
  });

  const [files, setFiles] = useState([null, null, null]);

  const previews = useMemo(() => {
    return files.map((f) => (f ? URL.createObjectURL(f) : null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.map((f) => (f ? f.name + f.size : "null")).join("|")]);

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function onPickFile(index, file) {
    setFiles((prev) => {
      const next = [...prev];
      next[index] = file || null;
      return next;
    });
  }

  async function submit() {
    if (!form.title.trim()) {
      alert("Preencha o título do item.");
      return;
    }

    setLoading(true);

    try {
      const selected = files.filter(Boolean);

      let imageUrls = [];
      if (selected.length) {
        setUploading(true);
        for (const f of selected) {
          imageUrls.push(await uploadOne(f));
        }
        setUploading(false);
      }

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
          imageUrls,
        }),
      });

      if (res.status === 401) {
        setLoading(false);
        setUploading(false);
        const current = `/publicar-item?${sp.toString()}`;
        router.push(`/login?redirect=${encodeURIComponent(current)}`);
        return;
      }

      if (!res.ok) {
        alert(await res.text());
        setLoading(false);
        setUploading(false);
        return;
      }

      const item = await res.json();

      if (redirect) {
        const qs = openTrade ? `?openTrade=${encodeURIComponent(openTrade)}` : "";
        router.push(`${redirect}${qs}`);
      } else {
        router.push(`/produto/${item.id}`);
      }
    } catch (e) {
      alert(e?.message || "Erro ao publicar.");
      setLoading(false);
      setUploading(false);
      return;
    }

    setLoading(false);
    setUploading(false);
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

        <div className="divider">Fotos (upload)</div>

        <div className="grid grid-cols-1 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-base-200 p-4">
              <div className="flex items-start gap-4">
                <div className="h-24 w-24 rounded-xl bg-base-300 overflow-hidden grid place-items-center">
                  {previews[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previews[i]} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs opacity-70">Sem foto</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => onPickFile(i, e.target.files?.[0] || null)}
                  />
                  <p className="text-xs opacity-70">
                    JPG/PNG/WEBP. Sugestão: até ~4.5MB por imagem.
                  </p>

                  {files[i] ? (
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => onPickFile(i, null)}>
                      Remover
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary w-full" onClick={submit} disabled={loading || uploading}>
          {uploading ? "Enviando fotos..." : loading ? "Publicando..." : "Publicar"}
        </button>

        <p className="text-xs opacity-70">
          *As fotos são enviadas e salvas como URLs no banco (ItemImage).
        </p>
      </div>
    </div>
  );
}