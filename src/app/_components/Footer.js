import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
<footer className="bg-base-100" style={{ boxShadow: "0 -6px 16px rgba(0,0,0,0.06)" }}>
          <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* Esquerda: logo + redes */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/reuse_logo.svg"
                alt="ReUse"
                width={160}
                height={48}
                priority={false}
                className="h-12 w-auto"
              />
            </div>

            <p className="mt-3 text-sm opacity-70">
              Trocas inteligentes para uma comunidade mais sustentável.
            </p>

            <div className="mt-4 flex gap-2">
              {/* Links externos podem continuar como <a> */}
              <a className="btn btn-ghost btn-circle btn-sm" href="#" aria-label="X">
                <Image src="/assets/x_logo.svg" alt="" width={16} height={16} />
              </a>

              <a className="btn btn-ghost btn-circle btn-sm" href="#" aria-label="Instagram">
                <Image src="/assets/instagram_logo.svg" alt="" width={16} height={16} />
              </a>

              <a className="btn btn-ghost btn-circle btn-sm" href="#" aria-label="YouTube">
                <Image src="/assets/youtube_logo.svg" alt="" width={16} height={16} />
              </a>

              <a className="btn btn-ghost btn-circle btn-sm" href="#" aria-label="LinkedIn">
                <Image src="/assets/linkedIn_logo.svg" alt="" width={16} height={16} />
              </a>
            </div>
          </div>

          {/* Meio: colunas */}
          <div className="md:col-span-5">
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-70">
                  Navegue
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li><Link className="link link-hover" href="/">Início</Link></li>
                  <li><Link className="link link-hover" href="/buscar">Produtos</Link></li>
                  <li><Link className="link link-hover" href="/baixar-app">Baixar App</Link></li>
                  <li><Link className="link link-hover" href="/comunidade">Comunidade</Link></li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-70">
                  Explore
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li><Link className="link link-hover" href="/sobre">Sobre</Link></li>
                  <li><Link className="link link-hover" href="/como-funciona">Como funciona</Link></li>
                  <li><Link className="link link-hover" href="/contato">Contato</Link></li>
                  <li><Link className="link link-hover" href="/ajuda">Ajuda / FAQ</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Direita: arte grande */}
          <div className="md:col-span-4">
            <div className="relative h-44 w-full overflow-hidden rounded-3xl md:h-56">
              <Image
                src="/assets/reuse_logo_focus.svg"
                alt="ReUse"
                fill
                className="object-contain object-right-bottom opacity-90"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}