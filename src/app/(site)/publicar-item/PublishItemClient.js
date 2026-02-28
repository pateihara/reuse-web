//src/app/(site)/publicar-item/PublishItemClient.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

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

  // arquivos + previews
  const [files, setFiles] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // string[]
  const prevUrlsRef = useRef([]); // guarda previews antigos pra revogar

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function onPickFiles(fileList) {
    const arr = Array.from(fileList || []);
    const max = 6;
    const selected = arr.slice(0, max);

    // revoga previews antigos
    prevUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    prevUrlsRef.current = [];

    // cria previews novos
    const urls = selected.map((f) => URL.createObjectURL(f));
    prevUrlsRef.current = urls;

    setFiles(selected);
    setPreviews(urls);
  }

  function removeAt(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed);
      const next = prev.filter((_, i) => i !== index);
      prevUrlsRef.current = next;
      return next;
    });
  }

  const canSubmit = form.title.trim().length > 0 && !loading && !uploading;

  async function submit() {
    if (!form.title.trim()) {
      alert("Preencha o título do item.");
      return;
    }

    setLoading(true);

    try {
      // 1) upload das imagens
      let imageUrls = [];
      if (files.length) {
        setUploading(true);
        for (const f of files) {
          imageUrls.push(await uploadOne(f));
        }
        setUploading(false);
      }

      // 2) cria item
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

        {/* input visível (mais confiável que label hidden) */}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="file-input file-input-bordered w-full"
          onChange={(e) => onPickFiles(e.target.files)}
        />
        <p className="text-xs opacity-70">Selecione até 6 imagens (JPG/PNG/WEBP).</p>

        {previews.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previews.map((src, idx) => (
              <div key={src} className="relative rounded-2xl overflow-hidden bg-base-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Foto ${idx + 1}`} className="h-32 w-full object-cover" />
                <button
                  type="button"
                  className="btn btn-xs btn-circle absolute top-2 right-2"
                  onClick={() => removeAt(idx)}
                  aria-label="Remover foto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs opacity-70">Nenhuma foto selecionada.</p>
        )}

        <button className="btn btn-primary w-full" onClick={submit} disabled={!canSubmit}>
          {uploading ? "Enviando fotos..." : loading ? "Publicando..." : "Publicar"}
        </button>

        <p className="text-xs opacity-70">
          *As fotos são enviadas e salvas como URLs no banco (ItemImage).
        </p>
      </div>
    </div>
  );
}