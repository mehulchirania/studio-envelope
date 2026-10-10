import { NextResponse } from "next/server";
import { HttpError, handle, readJson, requireAdmin } from "@/lib/admin/http";
import { revalidateSite } from "@/lib/admin/revalidate";
import { parseProjectFields } from "@/lib/admin/validate";
import { deleteProject, getProject, updateProject } from "@/lib/firebase/admin-server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    const project = await getProject((await params).id);
    if (!project) throw new HttpError(404, "Project not found.");
    return NextResponse.json({ project });
  });
}

export async function PUT(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    const fields = parseProjectFields(await readJson(request));
    const project = await updateProject((await params).id, fields);
    revalidateSite();
    return NextResponse.json({ project });
  });
}

export async function DELETE(request: Request, { params }: Context) {
  return handle(async () => {
    await requireAdmin(request);
    await deleteProject((await params).id);
    revalidateSite();
    return NextResponse.json({ ok: true });
  });
}
