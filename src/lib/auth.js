// src/lib/auth.js
import crypto from "crypto";

const COOKIE_NAME = "reuse_session";

function b64url(input) {
  return Buffer.from(input).toString("base64url");
}

function b64urlJson(obj) {
  return b64url(JSON.stringify(obj));
}

function sign(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken({ userId, expiresInSeconds = 60 * 60 * 24 * 7 }) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET não definido");

  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = { uid: String(userId), exp };

  const data = b64urlJson(payload);
  const sig = sign(data, secret);
  return `${data}.${sig}`;
}

export function verifySessionToken(token) {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;
    if (!token || typeof token !== "string") return null;

    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expected = sign(data, secret);
    if (sig !== expected) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!payload?.uid || !payload?.exp) return null;

    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) return null;

    return { userId: payload.uid, exp: payload.exp };
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}