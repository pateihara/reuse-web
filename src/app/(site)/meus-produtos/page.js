//src/app/(site)/meus-produtos/page.js
import Link from "next/link";
import MyItemsClient from "./MyItemsClient";
import MyTradesPanel from "./MyTradesPanel";

export default function MeusProdutosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Meus produtos</h1>

        <div className="flex gap-2">
          <Link className="btn btn-sm btn-outline" href="/produtos-trocados">
            Ver trocados
          </Link>
          <Link className="btn btn-sm btn-primary" href="/publicar-item">
            Publicar item
          </Link>
        </div>
      </div>

      {/* ✅ NOVO painel de trades */}
      <MyTradesPanel />

      {/* Lista atual de itens */}
      <div className="divider" />

      <MyItemsClient />
    </div>
  );
}