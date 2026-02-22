// src/app/(site)/avaliar-usuario/[userId]/page.js
import Link from "next/link";
import { getUserIdFromCookies } from "@/lib/getUserFromCookies";
import ReviewFormClient from "./ReviewFormClient";

export default async function AvaliarUsuarioPage({ params, searchParams }) {
  const p = await params;
  const sp = await searchParams;

  const reviewedUserId = p?.userId;
  const tradeId = sp?.tradeId;

  if (!reviewedUserId) return <div className="p-6">userId ausente.</div>;
  if (!tradeId) return <div className="p-6">tradeId ausente na URL.</div>;

  const userId = await getUserIdFromCookies();

  if (!userId) {
    const current = `/avaliar-usuario/${reviewedUserId}?tradeId=${tradeId}`;
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="alert flex items-center justify-between">
          <span>Você precisa estar logado para avaliar.</span>
          <Link className="btn btn-sm btn-primary" href={`/login?redirect=${encodeURIComponent(current)}`}>
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold">Avaliar usuário</h1>

      <ReviewFormClient
        tradeId={tradeId}
        reviewedId={reviewedUserId}
      />
    </div>
  );
}