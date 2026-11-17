import { NextResponse } from "next/server";
import { handle } from "@/lib/admin/http";
import { getSession } from "@/lib/admin/session";

export async function GET() {
  return handle(async () => {
    const session = await getSession();
    return NextResponse.json({ user: session?.user ?? null, mustChange: session?.mustChange ?? false });
  });
}
