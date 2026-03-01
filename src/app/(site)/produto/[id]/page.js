// src/app/(site)/produto/[id]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GalleryClient from "./GalleryClient";
import TradeButton from "./TradeButton";

export default async function ProdutoDetalhePage({ params }) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          city: true,
          state: true,
        },
      },
    },
  });

  // ✅ se não existe ou foi deletado, 404
  if (!item || item.status === "DELETED") return notFound();

  // ✅ permite visualizar ACTIVE / PAUSED / TRADED
  // (se você quiser bloquear PAUSED, remova do array)
  const canView = ["ACTIVE", "PAUSED", "TRADED"].includes(item.status);
  if (!canView) return notFound();

  const location =
    [item.city, item.state ? `- ${item.state}` : null].filter(Boolean).join(" ") ||
    "Localização não informada";

  const isAvailableForTrade = item.status === "ACTIVE";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li>
            <Link href="/">Início</Link>
          </li>
          <li>
            <Link href="/buscar">Busca</Link>
          </li>
          <li>
            <span className="text-primary">{item.title}</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Galeria */}
        <div className="lg:col-span-7">
          <GalleryClient
            title={item.title}
            images={
              item.images?.length
                ? item.images.map((img) => img.url)
                : ["/assets/reuse_logo_focus.svg"]
            }
          />
        </div>

        {/* Detalhes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h1 className="card-title text-2xl">{item.title}</h1>

              <div className="flex flex-wrap gap-2 mt-2">
                {item.category ? <span className="badge badge-outline">{item.category}</span> : null}
                {item.size ? <span className="badge badge-outline">Tam: {item.size}</span> : null}
                {item.condition ? <span className="badge badge-outline">{item.condition}</span> : null}
                <span className="badge badge-outline">Status: {item.status}</span>
              </div>

              <p className="text-sm opacity-80 mt-3">{location}</p>

              {item.description ? (
                <div className="mt-3">
                  <p className="font-semibold mb-1">Descrição</p>
                  <p className="text-sm opacity-80 whitespace-pre-line">{item.description}</p>
                </div>
              ) : null}

              <div className="divider my-2" />

              {/* ✅ só permite trocar se ACTIVE */}
              {isAvailableForTrade ? (
                <TradeButton wantedItemId={item.id} />
              ) : (
                <div className="alert alert-warning">
                  <span>
                    Este item não está disponível para novas trocas (status: {item.status}).
                  </span>
                </div>
              )}

              <p className="text-xs opacity-70 mt-2">
                *No MVP, o botão de troca fica disponível apenas para itens ativos.
              </p>
            </div>
          </div>

          {/* Card do usuário */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 rounded-full bg-base-200 flex items-center justify-center">
                    <span className="text-sm">
                      {item.owner?.name
                        ?.split(" ")
                        .slice(0, 2)
                        .map((p) => p[0])
                        .join("")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm opacity-80">
                <p>
                  <span className="font-semibold">Cidade:</span> {item.owner.city || "—"}{" "}
                  {item.owner.state ? `- ${item.owner.state}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="font-semibold mb-2">Dicas</p>
              <ul className="text-sm opacity-80 list-disc pl-5 space-y-1">
                <li>Converse no chat para combinar local e detalhes.</li>
                <li>Confirme o estado do item antes de fechar a troca.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}