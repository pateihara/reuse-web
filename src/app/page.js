// src/app/page.js
import Link from "next/link";
import BannerCarousel from "./_components/Home/BannerCarousel";

function SkeletonCard({ className = "" }) {
  return <div className={`bg-base-200 rounded-2xl ${className}`} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <main className="mx-auto max-w-6xl px-4 py-8">
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
          <p className="text-sm opacity-70">Encontre o que precisa na sua vizinhança</p>

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
          <p className="text-sm opacity-70">Procure o que precisa por categorias</p>

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
    </div>
  );
}