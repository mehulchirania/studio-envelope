import { NextResponse } from "next/server";
import { handle, readJson, requireAdmin } from "@/lib/admin/http";
import { deleteMessage, markMessageRead } from "@/lib/firebase/admin-server";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    const body = (await readJson(request)) as { read?: unknown };
    await markMessageRead((await params).id, body.read !== false);
    return NextResponse.json({ ok: true });
  });
}

export async function DELETE(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    await deleteMessage((await params).id);
    return NextResponse.json({ ok: true });
  });
}
