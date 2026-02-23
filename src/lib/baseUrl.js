// src/lib/baseUrl.js
import { headers } from "next/headers";

/**
 * Base URL segura para uso em Server Components / Route Handlers
 * - Next 16: headers() pode ser Promise => usar await
 * - Em produção/preview na Vercel: usa x-forwarded-* (host real)
 * - Em dev local: cai para http://localhost:3000
 */
export async function getBaseUrl() {
  const h = await headers();

  const forwardedProto = h.get("x-forwarded-proto");
  const forwardedHost = h.get("x-forwarded-host");
  const host = forwardedHost || h.get("host");

  if (host) {
    const proto =
      forwardedProto || (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}