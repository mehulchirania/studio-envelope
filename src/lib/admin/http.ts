// Server-only helpers shared by every /api/admin/* route.
import "server-only";
import { NextResponse } from "next/server";
import { HttpError } from "@/lib/admin/errors";
import { getSession, getSessionUser } from "@/lib/admin/session";

/** True when the request's Origin matches its host. A missing Origin passes unless `requireOrigin` is set. */
export function isSameOrigin(request: Request, { requireOrigin = false }: { requireOrigin?: boolean } = {}): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin) return !requireOrigin;
  if (!host) return !requireOrigin;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Throws 401 unless the request carries a valid admin session. Mutations must also come from our own origin. */
export async function requireAdmin(request: Request, { allowTemporary = false }: { allowTemporary?: boolean } = {}): Promise<string> {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    if (!isSameOrigin(request)) throw new HttpError(403, "Cross-site request blocked.");
  }
  // A session opened with an emailed temporary password only works where allowTemporary is set (changing the password).
  const user = allowTemporary ? (await getSession())?.user : await getSessionUser();
  if (!user) throw new HttpError(401, "Please sign in.");
  return user;
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Invalid request.");
  }
}

/** Wraps a handler so thrown HttpErrors become JSON errors and anything else becomes a generic 500. */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[admin]", err);
    return NextResponse.json({ error: "Something went wrong on the server. Please try again." }, { status: 500 });
  }
}
