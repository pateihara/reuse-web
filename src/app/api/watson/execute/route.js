import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const ALLOWED_ACTIONS = new Set(["PAUSE_ALL", "ACTIVATE_ALL", "LIST_MY_ITEMS"]);

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "").trim().toUpperCase();
    const userEmail = String(body?.userEmail || "").trim().toLowerCase();
    const bodyApiKey = String(body?.apiKey || "").trim();
    const headerApiKey = String(req.headers.get("x-api-key") || "").trim();
    const authHeader = String(req.headers.get("authorization") || "").trim();
    const bearerApiKey = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";
    const apiKey = bodyApiKey || headerApiKey || bearerApiKey;

    if (!action || !userEmail) {
      return jsonError("action e userEmail sao obrigatorios.", 400);
    }

    if (!ALLOWED_ACTIONS.has(action)) {
      return jsonError("Acao desconhecida.", 400);
    }

    const secretKey = String(process.env.WATSON_API_KEY || "").trim();
    if (!secretKey) {
      return jsonError("WATSON_API_KEY nao configurada no servidor.", 500);
    }

    if (!apiKey) {
      return jsonError("Chave de API nao informada.", 401);
    }

    if (apiKey !== secretKey) {
      return jsonError("Chave de API invalida.", 401);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: userEmail,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return jsonError("Usuario nao encontrado.", 404);
    }

    if (action === "PAUSE_ALL") {
      const result = await prisma.item.updateMany({
        where: {
          ownerId: user.id,
          status: "ACTIVE",
        },
        data: { status: "PAUSED" },
      });

      return NextResponse.json({
        ok: true,
        action,
        userEmail: user.email,
        count: result.count,
        message: `${result.count} item(ns) foram pausados.`,
      });
    }

    if (action === "ACTIVATE_ALL") {
      const result = await prisma.item.updateMany({
        where: {
          ownerId: user.id,
          status: "PAUSED",
        },
        data: { status: "ACTIVE" },
      });

      return NextResponse.json({
        ok: true,
        action,
        userEmail: user.email,
        count: result.count,
        message: `${result.count} item(ns) foram ativados.`,
      });
    }

    const items = await prisma.item.findMany({
      where: {
        ownerId: user.id,
        status: { in: ["ACTIVE", "PAUSED", "TRADED"] },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        condition: true,
        city: true,
        state: true,
        updatedAt: true,
      },
    });

    const itemsText =
      items.length === 0
        ? "Voce nao possui itens cadastrados."
        : items
            .map((item, idx) => {
              const status = item.status || "UNKNOWN";
              const title = item.title || "Sem titulo";
              return `${idx + 1}. ${title} [${status}]`;
            })
            .join("\n");

    return NextResponse.json({
      ok: true,
      action,
      userEmail: user.email,
      count: items.length,
      items,
      itemsText,
      message: `Voce possui ${items.length} item(ns).`,
    });
  } catch (error) {
    console.error("[WATSON_WEBHOOK_ERROR]", error);
    return jsonError("Erro interno ao processar comando.", 500);
  }
}
