import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HttpError, handle, readJson } from "@/lib/admin/http";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions, sessionsConfigured } from "@/lib/admin/session";
import { verifyCredentials } from "@/lib/admin/users";

// Best-effort brute-force brake: per-instance, per-IP attempt counter.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  return handle(async () => {
    if (!sessionsConfigured()) throw new HttpError(503, "Admin sign-in isn't configured on the server.");

    const ip = clientIp(request);
    const now = Date.now();
    const entry = attempts.get(ip);
    if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
      throw new HttpError(429, "Too many attempts. Please wait a few minutes and try again.");
    }

    const body = (await readJson(request)) as { username?: unknown; password?: unknown };
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = verifyCredentials(username, password);

    if (!user) {
      attempts.set(ip, {
        count: entry && entry.resetAt > now ? entry.count + 1 : 1,
        resetAt: entry && entry.resetAt > now ? entry.resetAt : now + WINDOW_MS,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new HttpError(401, "Wrong username or password.");
    }

    attempts.delete(ip);
    const token = createSessionToken(user);
    if (!token) throw new HttpError(503, "Admin sign-in isn't configured on the server.");
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
    return NextResponse.json({ user });
  });
}
