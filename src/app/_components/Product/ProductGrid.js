// src/app/_components/Product/ProductGrid.js
import ProductCard from "./ProductCard";
import Link from "next/link";
import { getItems } from "@/lib/items/getItems";

export default async function ProductGrid({ searchParams }) {
  const items = await getItems(searchParams);

  if (!items.length) {
    return (
      <div className="alert flex items-center justify-between">
        <span>Nenhum produto encontrado com os filtros selecionados.</span>
        <Link href="/buscar" className="btn btn-sm btn-outline">
          Limpar filtros
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((it) => (
        <ProductCard key={it.id} item={it} />
      ))}
    </div>
  );
}