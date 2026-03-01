// src/app/(site)/buscar/page.js
import Link from "next/link";
import BuscarClient from "./BuscarClient";
import ProductGrid from "@/app/_components/Product/ProductGrid";

export default async function BuscarPage({ searchParams }) {
  const sp = await searchParams; // Next 16: pode ser Promise

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li>
            <Link href="/">Início</Link>
          </li>
          <li>
            <span className="text-primary">Busca</span>
          </li>
        </ul>
      </div>

      <BuscarClient />

      {/* ✅ Sem mapa: grid ocupa largura total */}
      <div className="mt-6">
        <ProductGrid searchParams={sp} />
      </div>
    </div>
  );
}