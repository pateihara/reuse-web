// src/lib/getUserFromCookies.js
import "server-only";
import { headers } from "next/headers";
import { verifySessionToken, getSessionCookieName } from "@/lib/auth";

export async function getUserIdFromCookies() {
  const cookieName = getSessionCookieName();

  const h = await headers();
  const cookieHeader = h.get("cookie") || "";

  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${cookieName}=`));

  if (!match) return null;

  const token = match.split("=").slice(1).join("=");
  const session = verifySessionToken(token);
  return session?.userId || null;
}