// Server-only helpers shared by every /api/admin/* route.
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin/session";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

/** Throws 401 unless the request carries a valid admin session. Mutations must also come from our own origin. */
export async function requireAdmin(request: Request): Promise<string> {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (origin && host) {
      let originHost = "";
      try {
        originHost = new URL(origin).host;
      } catch {
        /* treated as mismatch below */
      }
      if (originHost !== host) throw new HttpError(403, "Cross-site request blocked.");
    }
  }
  const user = await getSessionUser();
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
