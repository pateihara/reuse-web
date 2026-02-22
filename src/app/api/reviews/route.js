// src/app/api/reviews/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tradeId = searchParams.get("tradeId");

  if (!tradeId) {
    return new Response("tradeId é obrigatório", { status: 400 });
  }

  const review = await prisma.review.findUnique({
    where: { tradeId },
    select: { id: true, createdAt: true, reviewerId: true, reviewedId: true },
  });

  return Response.json({ exists: !!review, review: review || null }, { status: 200 });
}

export async function POST(req) {
  const reviewerId = getUserIdFromRequest(req);
  if (!reviewerId) return new Response("Não autenticado", { status: 401 });

  const body = await req.json();
  const { tradeId, reviewedId, rating, comment, imageUrls } = body;

  if (!tradeId || !reviewedId) {
    return new Response("tradeId e reviewedId são obrigatórios", { status: 400 });
  }

  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return new Response("rating deve ser um inteiro entre 1 e 5", { status: 400 });
  }

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    select: {
      id: true,
      status: true,
      requesterId: true,
      ownerId: true,
      review: { select: { id: true } },
    },
  });

  if (!trade) return new Response("Trade não encontrado", { status: 404 });
  if (trade.status !== "DONE") return new Response("Só é possível avaliar após concluir a troca", { status: 400 });
  if (trade.review) return new Response("Este trade já foi avaliado", { status: 400 });

  const isParticipant = reviewerId === trade.requesterId || reviewerId === trade.ownerId;
  if (!isParticipant) return new Response("Você não participa desse trade", { status: 403 });

  const expectedReviewedId = reviewerId === trade.requesterId ? trade.ownerId : trade.requesterId;
  if (String(reviewedId) !== String(expectedReviewedId)) {
    return new Response("reviewedId inválido para este trade", { status: 400 });
  }

  const created = await prisma.review.create({
    data: {
      tradeId,
      reviewerId,
      reviewedId,
      rating: r,
      comment: comment?.trim() || null,
      images: Array.isArray(imageUrls) && imageUrls.length
        ? { create: imageUrls.filter(Boolean).map((url, idx) => ({ url, order: idx })) }
        : undefined,
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return Response.json(created, { status: 201 });
}