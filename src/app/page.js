"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

function SkeletonCard({ className = "" }) {
  return <div className={`bg-base-200 rounded-2xl ${className}`} />;
}

function BannerCarousel() {
  const [idx, setIdx] = useState(0);
  const total = 4;

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section className="card bg-base-200 rounded-3xl">
      <div className="card-body">
        <div className="relative w-full h-[220px] rounded-2xl bg-base-300 overflow-hidden">
          {/* Placeholder do banner (troca por imagens reais depois) */}
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

        {/* bolinhas */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ir para banner ${i + 1}`}
              className={`h-2 w-2 rounded-full ${
                i === idx ? "bg-black/80" : "bg-black/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      <div className="h-16" />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Banner / Carousel (sem scroll bug) */}
        <BannerCarousel />

        {/* Favoritos */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Favoritos</h2>
          <p className="text-sm opacity-70">Dê uma nova vida aos seus objetos</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
          </div>
        </section>

        {/* Perto de você */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Perto de você</h2>
          <p className="text-sm opacity-70">
            Encontre o que precisa na sua vizinhança
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            <SkeletonCard className="h-48 md:col-span-1" />
            <div className="grid grid-cols-2 gap-6 md:col-span-2">
              <SkeletonCard className="h-20" />
              <SkeletonCard className="h-20" />
              <SkeletonCard className="h-20" />
              <SkeletonCard className="h-20" />
            </div>
            <SkeletonCard className="h-48 md:col-span-1" />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10">
          <div className="card bg-base-200 rounded-3xl">
            <div className="card-body">
              <h3 className="card-title text-xl md:text-2xl">
                Já são +3.000 itens trocados pela comunidade
              </h3>

              <div className="card-actions mt-2">
                <Link href="/publicar-item" className="btn btn-primary">
                  publicar item de troca
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Categorias</h2>
          <p className="text-sm opacity-70">
            Procure o que precisa por categorias
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            <SkeletonCard className="h-48 md:col-span-1" />
            <div className="grid grid-cols-2 gap-6 md:col-span-1">
              <SkeletonCard className="h-20" />
              <SkeletonCard className="h-20" />
            </div>
            <SkeletonCard className="h-48 md:col-span-1" />
            <div className="grid grid-cols-2 gap-6 md:col-span-1">
              <SkeletonCard className="h-20" />
              <SkeletonCard className="h-20" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}