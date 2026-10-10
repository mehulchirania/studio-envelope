import { NextResponse } from "next/server";
import { handle } from "@/lib/admin/http";
import { getSessionUser } from "@/lib/admin/session";

export async function GET() {
  return handle(async () => NextResponse.json({ user: await getSessionUser() }));
}
