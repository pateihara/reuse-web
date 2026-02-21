import { prisma } from "@/lib/prisma";

export async function GET(_req, { params }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: { select: { id: true, name: true, username: true, avatarUrl: true, city: true, state: true } },
    },
  });

  if (!item) return new Response("Not found", { status: 404 });
  return Response.json(item);
}