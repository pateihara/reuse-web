//src/app/_components/Home/BannerCarousel.js

"use client";

import { useState } from "react";

export default function BannerCarousel() {
  const [idx, setIdx] = useState(0);
  const total = 4;

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section className="card bg-base-200 rounded-3xl">
      <div className="card-body">
        <div className="relative w-full h-[220px] rounded-2xl bg-base-300 overflow-hidden">
          <div className="absolute inset-0 grid place-items-center text-lg font-semibold opacity-70">
            Banner {idx + 1}
          </div>

          <button
            type="button"
            onClick={prev}
            className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2"
            aria-label="Anterior"
          >
            ❮
          </button>

          <button
            type="button"
            onClick={next}
            className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2"
            aria-label="Próximo"
          >
            ❯
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ir para banner ${i + 1}`}
              className={`h-2 w-2 rounded-full ${i === idx ? "bg-black/80" : "bg-black/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}