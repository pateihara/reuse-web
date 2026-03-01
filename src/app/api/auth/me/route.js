// src/app/api/auth/me/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getUserIdFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Não autenticado", { status: 401 });

  // Endpoint de debug: não consulta o banco
  return Response.json({ userId }, { status: 200 });
}