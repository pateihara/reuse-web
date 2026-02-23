// src/app/(site)/sobre/page.js
import Link from "next/link";
import PageShell from "@/app/_components/PageShell";

export const metadata = {
  title: "Sobre | ReUse",
  description: "Conheça o ReUse — troca de itens entre pessoas próximas com foco em sustentabilidade.",
};

export default function SobrePage() {
  return (
    <PageShell>
      <div className="breadcrumbs text-sm opacity-70">
        <ul>
          <li><Link href="/">Início</Link></li>
          <li>Sobre</li>
        </ul>
      </div>

      <section className="mt-6">
        <h1 className="text-3xl font-bold">Sobre o ReUse</h1>
        <p className="mt-3 text-base opacity-80 max-w-3xl">
          O <b>ReUse</b> é uma plataforma de troca de itens entre pessoas próximas, criada para
          estimular a <b>reutilização</b>, reduzir desperdício e incentivar hábitos mais sustentáveis.
          Em vez de descartar algo que ainda está em bom estado, você pode publicar, negociar e combinar
          a troca diretamente no app.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card bg-base-200 rounded-3xl">
            <div className="card-body">
              <h2 className="card-title">Sustentabilidade</h2>
              <p className="opacity-80">
                Dar uma nova vida a itens reduz consumo e descarte. Trocar é um jeito simples de
                praticar economia circular.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 rounded-3xl">
            <div className="card-body">
              <h2 className="card-title">Troca local</h2>
              <p className="opacity-80">
                Você encontra pessoas na sua região e combina a troca de forma prática e segura,
                usando chat e status de negociação.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 rounded-3xl">
            <div className="card-body">
              <h2 className="card-title">Confiança</h2>
              <p className="opacity-80">
                Depois que a troca é concluída, usuários podem se avaliar. Isso ajuda a fortalecer a
                confiabilidade da comunidade.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/buscar" className="btn btn-primary">Ver produtos</Link>
          <Link href="/publicar-item" className="btn btn-outline">Publicar item</Link>
          <Link href="/como-funciona" className="btn btn-ghost">Como funciona</Link>
        </div>
      </section>
    </PageShell>
  );
}