import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handle } from "@/lib/admin/http";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/session";

export async function POST() {
  return handle(async () => {
    (await cookies()).set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
    return NextResponse.json({ ok: true });
  });
}
