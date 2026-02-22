//src/app/(site)/avaliar-usuario/[userId]/ReviewFormClient.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewFormClient({ tradeId, reviewedId }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const reviewerId = localStorage.getItem("reuse_user_id");
    if (!reviewerId) {
      router.push("/login");
      return;
    }
    if (!tradeId) {
      alert("tradeId ausente na URL. Volte pelo chat e clique em Avaliar.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tradeId,
        reviewerId,
        reviewedId,
        rating,
        comment,
        imageUrls: [img1, img2, img3].filter(Boolean),
      }),
    });

    if (!res.ok) {
      alert(await res.text());
      setLoading(false);
      return;
    }

    setLoading(false);
    alert("Avaliação enviada!");
    router.push(`/chat/${tradeId}`);
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body space-y-4">
        <div>
          <p className="font-semibold mb-2">Nota</p>

          {/* DaisyUI rating */}
          <div className="rating rating-lg">
            {[1,2,3,4,5].map((n) => (
              <input
                key={n}
                type="radio"
                name="rating"
                className="mask mask-star-2 bg-orange-400"
                checked={rating === n}
                onChange={() => setRating(n)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Comentário</p>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Conte como foi a experiência..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="divider">Fotos (URLs por enquanto)</div>

        <input className="input input-bordered w-full" placeholder="Foto 1 (URL)" value={img1} onChange={(e) => setImg1(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Foto 2 (URL)" value={img2} onChange={(e) => setImg2(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Foto 3 (URL)" value={img3} onChange={(e) => setImg3(e.target.value)} />

        <button className="btn btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? "Enviando..." : "Enviar avaliação"}
        </button>

        <p className="text-xs opacity-70">
          *No MVP, fotos são URLs. Depois trocamos por upload.
        </p>
      </div>
    </div>
  );
}