// src/lib/getUserFromRequest.js
import { cookies } from "next/headers";
import { verifySessionToken, getSessionCookieName } from "@/lib/auth";

// Funciona dentro de Route Handlers (src/app/api/**)
// e também aguenta casos em que o header cookie vem vazio.
export function getUserIdFromRequest(req) {
  const cookieName = getSessionCookieName();

  // 1) Tenta via cookies() (mais confiável no App Router)
  try {
    const tokenFromStore = cookies().get(cookieName)?.value;
    const session = verifySessionToken(tokenFromStore);
    if (session?.userId) return session.userId;
  } catch {
    // ignora e cai pro fallback
  }

  // 2) Fallback: tenta no header "cookie"
  const cookieHeader = req?.headers?.get?.("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${cookieName}=`));

  if (!match) return null;

  const token = match.split("=").slice(1).join("="); // mais seguro
  const session = verifySessionToken(token);
  return session?.userId || null;
}