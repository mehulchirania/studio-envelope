// Server-only: signed, httpOnly session cookie for the admin panel.
// Token format: base64url(JSON {u, exp}) + "." + base64url(HMAC-SHA256).
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "se_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function secret(): string | null {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (configured && configured.length >= 16) return configured;
  // Local `next dev` works without any setup; production must set a real secret.
  if (process.env.NODE_ENV !== "production") return "dev-only-secret-do-not-use-in-production";
  return null;
}

export function sessionsConfigured(): boolean {
  return secret() !== null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createSessionToken(username: string): string | null {
  const key = secret();
  if (!key) return null;
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })
  ).toString("base64url");
  return `${payload}.${sign(payload, key)}`;
}

function readSessionToken(token: string | undefined): string | null {
  const key = secret();
  if (!key || !token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u?: string; exp?: number };
    if (!data.u || !data.exp || data.exp < Date.now() / 1000) return null;
    return data.u;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<string | null> {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_SECONDS,
};
