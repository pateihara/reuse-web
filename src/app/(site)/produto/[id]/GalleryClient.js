"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function GalleryClient({ images, title }) {
  const safeImages = useMemo(
    () => (Array.isArray(images) && images.length ? images : ["/assets/reuse_logo_focus.svg"]),
    [images]
  );

  const [active, setActive] = useState(0);
  const main = safeImages[active] || safeImages[0];

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <div className="grid grid-cols-12 gap-4">
          {/* thumbs */}
          <div className="col-span-3 sm:col-span-2 flex flex-col gap-2">
            {safeImages.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                className={`relative aspect-square rounded-lg overflow-hidden border ${
                  idx === active ? "border-primary" : "border-base-300"
                }`}
                onClick={() => setActive(idx)}
                aria-label={`Imagem ${idx + 1}`}
              >
                <Image src={src} alt={`${title} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* main image */}
          <div className="col-span-9 sm:col-span-10">
            <div className="relative w-full h-[420px] bg-base-200 rounded-lg overflow-hidden">
              <Image
                src={main}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}