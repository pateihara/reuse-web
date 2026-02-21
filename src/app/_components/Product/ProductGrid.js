import ProductCard from "./ProductCard";
import Link from "next/link";

function buildQuery(searchParams) {
  const qs = new URLSearchParams();
  ["q", "category", "size", "condition", "city"].forEach((k) => {
    const v = searchParams?.[k];
    if (v) qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

async function getItems(searchParams) {
  const query = buildQuery(searchParams);

  const res = await fetch(`http://localhost:3000/api/items${query}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

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