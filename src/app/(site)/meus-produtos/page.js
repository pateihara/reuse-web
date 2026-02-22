//src/app/(site)/meus-produtos/page.js
import MyItemsClient from "./MyItemsClient";

export default function MeusProdutosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Meus produtos</h1>
      </div>

      <MyItemsClient />
    </div>
  );
}