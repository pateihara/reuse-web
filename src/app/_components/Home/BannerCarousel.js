// src/app/_components/Home/BannerCarousel.js
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export default function BannerCarousel() {
  const banners = useMemo(
    () => [
      { src: "/assets/banner_1.png", alt: "Banner 1 - Troque e Reutilize" },
      { src: "/assets/banner_2.png", alt: "Banner 2 - Encontre trocas perto de você" },
      { src: "/assets/banner_3.png", alt: "Banner 3 - Sustentabilidade começa com você" },
      { src: "/assets/banner_4.png", alt: "Banner 4 - +3.000 itens trocados" },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const total = banners.length;

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section className="card bg-base-200 rounded-3xl">
      <div className="card-body">
        <div className="relative w-full h-[220px] rounded-2xl bg-base-300 overflow-hidden">
          <Image
            src={banners[idx].src}
            alt={banners[idx].alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />

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
          {banners.map((_, i) => (
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