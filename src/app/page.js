// src/app/page.js
import Link from "next/link";
import Image from "next/image";
import BannerCarousel from "./_components/Home/BannerCarousel";

function HomeImageCard({ src, alt, className = "" }) {
  return (
    <div className={`bg-base-200 rounded-2xl overflow-hidden ${className}`}>
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={false}
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
    </div>
  );
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
            <HomeImageCard src="/assets/favorito_1.png" alt="Favorito 1" className="h-40" />
            <HomeImageCard src="/assets/favorito_2.png" alt="Favorito 2" className="h-40" />
            <HomeImageCard src="/assets/favorito_3.png" alt="Favorito 3" className="h-40" />
            <HomeImageCard src="/assets/favorito_4.png" alt="Favorito 4" className="h-40" />
          </div>
        </section>

        {/* Perto de você */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Perto de você</h2>
          <p className="text-sm opacity-70">Encontre o que precisa na sua vizinhança</p>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            <HomeImageCard
              src="/assets/perto_guitarra.png"
              alt="Item perto de você: guitarra"
              className="h-48 md:col-span-1"
            />

            <div className="grid grid-cols-2 gap-6 md:col-span-2">
              <HomeImageCard src="/assets/perto_pesos.png" alt="Item perto de você: pesos" className="h-20" />
              <HomeImageCard
                src="/assets/perto_cesta_brinquedos.png"
                alt="Item perto de você: cesta de brinquedos"
                className="h-20"
              />
              <HomeImageCard
                src="/assets/perto_cesta_livros.png"
                alt="Item perto de você: cesta com livros"
                className="h-20"
              />
              <HomeImageCard
                src="/assets/perto_liquidificador.png"
                alt="Item perto de você: liquidificador"
                className="h-20"
              />
            </div>

            <HomeImageCard
              src="/assets/perto_carrinho_bebe.png"
              alt="Item perto de você: carrinho de bebê"
              className="h-48 md:col-span-1"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <HomeImageCard
              src="/assets/perto_roupas_dobradas.png"
              alt="Item perto de você: roupas dobradas"
              className="h-28"
            />
            <HomeImageCard
              src="/assets/perto_ursinho_blocos.png"
              alt="Item perto de você: ursinho e blocos"
              className="h-28"
            />
            <HomeImageCard
              src="/assets/perto_cesta_brinquedos.png"
              alt="Item perto de você: brinquedos"
              className="h-28"
            />
            <HomeImageCard
              src="/assets/perto_cesta_livros.png"
              alt="Item perto de você: livros"
              className="h-28"
            />
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
            <HomeImageCard src="/assets/categoria_eletronicos.png" alt="Categoria Eletrônicos" className="h-48" />
            <HomeImageCard
              src="/assets/categoria_roupas_acessorios.png"
              alt="Categoria Roupas e Acessórios"
              className="h-48"
            />
            <HomeImageCard src="/assets/categoria_brinquedos.png" alt="Categoria Brinquedos" className="h-48" />
            <HomeImageCard src="/assets/categoria_livros_jogos.png" alt="Categoria Livros e Jogos" className="h-48" />
          </div>
        </section>
      </main>
    </div>
  );
}