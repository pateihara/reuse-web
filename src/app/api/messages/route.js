import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { tradeId, senderId, content } = body;

  if (!tradeId || !senderId || !content?.trim()) {
    return new Response("tradeId, senderId e content são obrigatórios", { status: 400 });
  }

  // (opcional) validar trade existe
  const trade = await prisma.trade.findUnique({ where: { id: tradeId }, select: { id: true } });
  if (!trade) return new Response("Trade não encontrado", { status: 404 });

  const msg = await prisma.message.create({
    data: { tradeId, senderId, content: content.trim() },
  });

  return Response.json(msg, { status: 201 });
}