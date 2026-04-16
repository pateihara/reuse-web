import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Endpoint de Webhook para o IBM Watson Assistant.
 * Permite que o chatbot execute ações administrativas para o usuário.
 * 
 * Exemplo de Body esperado:
 * {
 *   "action": "PAUSE_ALL",
 *   "userEmail": "ana@reuse.com",
 *   "apiKey": "sua-chave-aqui"
 * }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, userEmail, apiKey } = body;

    // 1. Validação de Segurança
    const secretKey = process.env.WATSON_API_KEY || "reuse-watson-123";
    if (apiKey !== secretKey) {
      return NextResponse.json({ error: "Chave de API inválida." }, { status: 401 });
    }

    // 2. Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // 3. Execução das Ações
    if (action === "PAUSE_ALL") {
      const result = await prisma.item.updateMany({
        where: {
          ownerId: user.id,
          status: "ACTIVE"
        },
        data: { status: "PAUSED" }
      });

      return NextResponse.json({ 
        message: `Comando executado: ${result.count} itens foram pausados.`,
        count: result.count 
      });
    }

    if (action === "ACTIVATE_ALL") {
      const result = await prisma.item.updateMany({
        where: {
          ownerId: user.id,
          status: "PAUSED"
        },
        data: { status: "ACTIVE" }
      });

      return NextResponse.json({ 
        message: `Comando executado: ${result.count} itens foram reativados.`,
        count: result.count 
      });
    }

    return NextResponse.json({ error: "Ação desconhecida." }, { status: 400 });

  } catch (error) {
    console.error("[WATSON_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Erro interno ao processar comando." }, { status: 500 });
  }
}
