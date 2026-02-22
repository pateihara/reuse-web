//src/app/(site)/buscar/page.js
import Link from "next/link";
import BuscarClient from "./BuscarClient";
import ProductGrid from "@/app/_components/Product/ProductGrid";

export default async function BuscarPage({ searchParams }) {
  const sp = await searchParams; // <- resolve Promise

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Início</Link></li>
          <li><span className="text-primary">Busca</span></li>
        </ul>
      </div>

      <BuscarClient />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ProductGrid searchParams={sp} />
        </div>

        <div className="lg:col-span-5">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Mapa</h2>
              <div className="w-full h-[420px] rounded-lg bg-base-200 flex items-center justify-center">
                <span className="opacity-70">Mapa (placeholder)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}