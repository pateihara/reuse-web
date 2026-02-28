// src/app/api/auth/register/route.js
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const username = body?.username ? String(body.username).trim() : null;
    const city = body?.city ? String(body.city).trim() : null;
    const state = body?.state ? String(body.state).trim() : null;

    if (!name || !email || !password) {
      return Response.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (!email.includes("@") || email.length < 6) {
      return Response.json({ error: "E-mail inválido." }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json(
        { error: "Já existe uma conta com este e-mail." },
        { status: 409 }
      );
    }

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        return Response.json(
          { error: "Este username já está em uso." },
          { status: 409 }
        );
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        username,
        city,
        state,
      },
      select: { id: true, name: true, email: true },
    });

    return Response.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return Response.json({ error: "Erro ao cadastrar." }, { status: 500 });
  }
}