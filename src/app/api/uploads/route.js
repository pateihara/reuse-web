// src/app/api/uploads/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file) return Response.json({ error: "Arquivo não enviado." }, { status: 400 });

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return Response.json({ error: "Formato inválido. Use JPG, PNG ou WEBP." }, { status: 400 });
    }

    const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });
    return Response.json({ url: blob.url }, { status: 201 });
  } catch (err) {
    console.error("UPLOAD_ERROR", err);
    return Response.json({ error: "Erro ao fazer upload." }, { status: 500 });
  }
}