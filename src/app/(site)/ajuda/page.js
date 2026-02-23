// src/app/(site)/ajuda/page.js
import Link from "next/link";

export const metadata = {
  title: "Ajuda / FAQ | ReUse",
  description: "Tire dúvidas sobre trocas, chat, segurança, status e avaliações no ReUse.",
};

export default function AjudaPage() {
  const faqs = [
    {
      q: "Preciso pagar para usar?",
      a: "O objetivo do ReUse é facilitar trocas. Dependendo do item, vocês podem combinar condições no chat, mas a proposta central é troca entre usuários.",
    },
    {
      q: "Como funciona a troca?",
      a: "Você solicita uma troca, o dono aceita ou recusa. Se aceitar, o chat fica ativo. Vocês marcam encontro e depois confirmam a conclusão.",
    },
    {
      q: "Posso cancelar uma negociação?",
      a: "Sim. Antes de finalizar a troca, o trade pode ser cancelado. Isso fica registrado no status.",
    },
    {
      q: "O que acontece quando a troca é concluída?",
      a: "Quando ambos confirmam, o trade fica como concluído e os itens envolvidos são marcados como trocados.",
    },
    {
      q: "Como posso confiar em outro usuário?",
      a: "Após a conclusão, usuários podem avaliar. Além disso, combine encontros em locais públicos e evite compartilhar dados sensíveis no chat.",
    },
    {
      q: "Quais itens não devo publicar?",
      a: "Evite itens ilegais, perigosos ou que violem políticas/leis locais. Priorize itens seguros e em boas condições de uso.",
    },
    {
      q: "Meu item sumiu da busca. Por quê?",
      a: "Itens pausados, trocados ou removidos não aparecem como ativos na busca. Verifique em “Meus produtos”.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-28 pb-12">
      <div className="breadcrumbs text-sm opacity-70">
        <ul>
          <li><Link href="/">Início</Link></li>
          <li>Ajuda / FAQ</li>
        </ul>
      </div>

      <section className="mt-6">
        <h1 className="text-3xl font-bold">Ajuda / FAQ</h1>
        <p className="mt-3 opacity-80 max-w-3xl">
          Aqui estão as dúvidas mais comuns sobre o ReUse. Se precisar, fale com a gente em{" "}
          <Link className="link" href="/contato">Contato</Link>.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="collapse collapse-arrow bg-base-200 rounded-2xl">
              <input type="checkbox" />
              <div className="collapse-title text-base font-semibold">{f.q}</div>
              <div className="collapse-content">
                <p className="opacity-80">{f.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/buscar" className="btn btn-primary">Ver produtos</Link>
          <Link href="/publicar-item" className="btn btn-outline">Publicar item</Link>
          <Link href="/contato" className="btn btn-ghost">Contato</Link>
        </div>
      </section>
    </main>
  );
}