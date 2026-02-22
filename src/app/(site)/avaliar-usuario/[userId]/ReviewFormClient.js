//src/app/(site)/avaliar-usuario/[userId]/ReviewFormClient.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function StarRating({ value, onChange, disabled = false }) {
  return (
    <div className="rating rating-lg">
      {[1, 2, 3, 4, 5].map((n) => (
        <input
          key={n}
          type="radio"
          name="rating"
          className="mask mask-star-2 bg-orange-400"
          checked={value === n}
          onChange={() => onChange(n)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default function ReviewFormClient({ tradeId, reviewedId }) {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        tradeId,
        reviewedId,
        rating: Number(rating),
        comment,
        imageUrls: [image1, image2, image3].filter(Boolean),
      }),
    });

    if (res.status === 401) {
      setLoading(false);
      router.push(`/login?redirect=/avaliar-usuario/${reviewedId}?tradeId=${tradeId}`);
      return;
    }

    if (!res.ok) {
      alert(await res.text());
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(`/chat/${tradeId}`);
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body space-y-4">
        <div>
          <p className="font-semibold mb-2">Nota</p>

          <div className="flex items-center gap-3">
            <StarRating value={rating} onChange={setRating} disabled={loading} />
            <span className="text-sm opacity-70">{rating}/5</span>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Comentário (opcional)</p>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi a experiência..."
            disabled={loading}
          />
        </div>

        <div className="divider">Fotos (URLs - opcional)</div>

        <div className="grid grid-cols-1 gap-3">
          <input
            className="input input-bordered w-full"
            placeholder="Imagem 1 (URL)"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            disabled={loading}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Imagem 2 (URL)"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            disabled={loading}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Imagem 3 (URL)"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            disabled={loading}
          />
        </div>

        <button className="btn btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? "Enviando..." : "Enviar avaliação"}
        </button>

        <p className="text-xs opacity-70">
          *A avaliação só é permitida quando o trade está concluído (DONE) e apenas 1 por trade.
        </p>
      </div>
    </div>
  );
}