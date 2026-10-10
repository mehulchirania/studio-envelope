import { NextResponse } from "next/server";
import { handle, requireAdmin } from "@/lib/admin/http";
import { listMessages } from "@/lib/firebase/admin-server";

export async function GET(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    return NextResponse.json({ messages: await listMessages() });
  });
}
