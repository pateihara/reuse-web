import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return new Response("userId é obrigatório", { status: 400 });

  const items = await prisma.item.findMany({
    where: { ownerId: userId, status: "ACTIVE" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(items);
}