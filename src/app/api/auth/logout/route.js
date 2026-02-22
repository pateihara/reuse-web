// src/app/api/auth/logout/route.js
import { getSessionCookieName } from "@/lib/auth";

export async function POST() {
  const cookieName = getSessionCookieName();
  const headers = new Headers();

  headers.append(
    "Set-Cookie",
    `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}