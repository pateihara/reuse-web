// src/app/(site)/como-funciona/page.js
import Link from "next/link";

export const metadata = {
  title: "Como funciona | ReUse",
  description: "Entenda o passo a passo para publicar, negociar e concluir uma troca no ReUse.",
};

export default function ComoFuncionaPage() {
  const steps = [
    {
      title: "1) Publique um item",
      text: "Crie um anúncio com fotos, categoria, condição e localização. Itens ativos ficam visíveis na busca.",
    },
    {
      title: "2) Encontre itens e faça uma proposta",
      text: "Navegue por categorias ou use filtros. Ao encontrar um item, você pode solicitar uma troca.",
    },
    {
      title: "3) Chat e negociação",
      text: "Com a solicitação aceita, o chat fica ativo. Vocês combinam detalhes como local e horário de encontro.",
    },
    {
      title: "4) Marcar encontro",
      text: "Quando tudo estiver alinhado, marque o encontro. O trade muda de status e fica registrado.",
    },
    {
      title: "5) Concluir troca",
      text: "Após a troca, cada pessoa confirma a conclusão. Quando ambos confirmam, o trade é finalizado.",
    },
    {
      title: "6) Avaliar",
      text: "Depois de finalizado, você pode avaliar o outro usuário. Isso melhora a segurança e a confiança.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-28 pb-12">
      <div className="breadcrumbs text-sm opacity-70">
        <ul>
          <li><Link href="/">Início</Link></li>
          <li>Como funciona</li>
        </ul>
      </div>

      <section className="mt-6">
        <h1 className="text-3xl font-bold">Como funciona</h1>
        <p className="mt-3 opacity-80 max-w-3xl">
          O ReUse organiza o processo de troca com status claros: solicitação, chat, encontro e conclusão.
          Assim você negocia com transparência e mantém histórico do que foi combinado.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {steps.map((s) => (
            <div key={s.title} className="card bg-base-200 rounded-3xl">
              <div className="card-body">
                <h2 className="card-title">{s.title}</h2>
                <p className="opacity-80">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/buscar" className="btn btn-primary">Buscar itens</Link>
          <Link href="/publicar-item" className="btn btn-outline">Publicar item</Link>
          <Link href="/ajuda" className="btn btn-ghost">Ajuda / FAQ</Link>
        </div>
      </section>
    </main>
  );
}