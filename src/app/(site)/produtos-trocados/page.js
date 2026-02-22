// src/app/(site)/produtos-trocados/page.js
import TradedItemsClient from "./TradedItemsClient";

export default function ProdutosTrocadosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Produtos trocados</h1>
          <p className="text-sm opacity-70">
            Itens com status <span className="badge badge-neutral">TRADED</span>
          </p>
        </div>
      </div>

      <TradedItemsClient />
    </div>
  );
}