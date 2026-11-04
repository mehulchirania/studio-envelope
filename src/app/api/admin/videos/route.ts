import { NextResponse } from "next/server";
import { handle, readJson, requireAdmin } from "@/lib/admin/http";
import { revalidateSite } from "@/lib/admin/revalidate";
import { parseVideoFields } from "@/lib/admin/validate";
import { createVideo, listVideos } from "@/lib/firebase/admin-server";

export async function GET(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    return NextResponse.json({ videos: await listVideos() });
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const video = await createVideo(parseVideoFields(await readJson(request)));
    revalidateSite();
    return NextResponse.json({ video }, { status: 201 });
  });
}
