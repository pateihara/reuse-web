// src/app/(site)/contato/page.js
import Link from "next/link";

export const metadata = {
  title: "Contato | ReUse",
  description: "Fale com o ReUse — dúvidas, sugestões e feedback.",
};

export default function ContatoPage() {
  const email = "contato@reuse.app";
  const sede = {
    nome: "ReUse – Sede (fictícia)",
    endereco: "Av. Paulista, 1000 – Bela Vista",
    cidade: "São Paulo – SP, 01310-100",
    pais: "Brasil",
    horario: "Seg–Sex, 9h–18h (BRT)",
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pt-28 pb-12">
      <div className="breadcrumbs text-sm opacity-70">
        <ul>
          <li><Link href="/">Início</Link></li>
          <li>Contato</li>
        </ul>
      </div>

      <section className="mt-6">
        <h1 className="text-3xl font-bold">Contato</h1>
        <p className="mt-3 opacity-80 max-w-3xl">
          Quer falar com a gente? Envie um e-mail com sua dúvida, sugestão ou feedback.
          <span className="block mt-2 text-sm opacity-70">
            (Informações fictícias para o projeto/MVP.)
          </span>
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card bg-base-200 rounded-3xl">
            <div className="card-body">
              <h2 className="card-title">E-mail</h2>

              <p className="opacity-80">
                Escreva para:
              </p>

              <div className="mt-2">
                <a className="link link-primary text-lg font-semibold" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>

              <div className="mt-4 rounded-2xl bg-base-100/60 p-4">
                <p className="text-sm opacity-80">
                  Dica: se a mensagem for sobre uma troca, inclua o contexto (sem dados sensíveis) e,
                  se possível, prints do problema.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/ajuda" className="btn btn-outline">Ajuda / FAQ</Link>
                <Link href="/buscar" className="btn btn-ghost">Buscar itens</Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 rounded-3xl">
            <div className="card-body">
              <h2 className="card-title">Sede (fictícia)</h2>

              <ul className="mt-1 space-y-2 text-sm opacity-80">
                <li><span className="font-semibold">Nome:</span> {sede.nome}</li>
                <li><span className="font-semibold">Endereço:</span> {sede.endereco}</li>
                <li><span className="font-semibold">Cidade/UF:</span> {sede.cidade}</li>
                <li><span className="font-semibold">País:</span> {sede.pais}</li>
                <li><span className="font-semibold">Atendimento:</span> {sede.horario}</li>
              </ul>

              <div className="mt-6 rounded-2xl bg-base-100/60 p-4">
                <p className="text-sm opacity-80">
                  Para sua segurança, combine trocas em locais públicos e evite compartilhar informações
                  sensíveis no chat.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/sobre" className="btn btn-outline">Sobre</Link>
                <Link href="/como-funciona" className="btn btn-ghost">Como funciona</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}