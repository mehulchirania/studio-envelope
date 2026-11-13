import { NextResponse } from "next/server";
import { HttpError, handle, readJson, requireAdmin } from "@/lib/admin/http";
import { revalidateSite } from "@/lib/admin/revalidate";
import { parseExpectedUpdatedAt, parseVideoFields } from "@/lib/admin/validate";
import { deleteVideo, getVideo, updateVideo } from "@/lib/firebase/admin-server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    const video = await getVideo((await params).id);
    if (!video) throw new HttpError(404, "Video not found.");
    return NextResponse.json({ video });
  });
}

export async function PUT(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    const body = await readJson(request);
    const video = await updateVideo((await params).id, parseVideoFields(body), parseExpectedUpdatedAt(body));
    revalidateSite();
    return NextResponse.json({ video });
  });
}

export async function DELETE(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    await deleteVideo((await params).id);
    revalidateSite();
    return NextResponse.json({ ok: true });
  });
}
