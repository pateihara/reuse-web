// src/app/api/auth/login/route.js
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSessionToken, getSessionCookieName } from "@/lib/auth";

export async function GET() {
  return Response.json({ ok: true, message: "Use POST para autenticar." });
}

export async function POST(req) {
  const body = await req.json();
  const email = String(body?.email || "").toLowerCase().trim();
  const password = String(body?.password || "");

  if (!email || !password) {
    return new Response("email e password são obrigatórios", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  });

  if (!user) return new Response("Credenciais inválidas", { status: 401 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return new Response("Credenciais inválidas", { status: 401 });

  const token = createSessionToken({ userId: user.id });

  const cookieName = getSessionCookieName();
  const headers = new Headers();

  // Cookie HttpOnly (não vai pro JS)
  headers.append(
    "Set-Cookie",
    `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );

  return new Response(JSON.stringify({ user: { id: user.id, name: user.name, email: user.email } }), {
    status: 200,
    headers,
  });
}