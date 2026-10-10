import { NextResponse } from "next/server";
import { HttpError, handle, readJson, requireAdmin } from "@/lib/admin/http";
import { revalidateSite } from "@/lib/admin/revalidate";
import { reorderProjects } from "@/lib/firebase/admin-server";

export async function PUT(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const body = (await readJson(request)) as { ids?: unknown };
    if (!Array.isArray(body.ids) || !body.ids.every((id) => typeof id === "string")) {
      throw new HttpError(400, "Invalid order.");
    }
    await reorderProjects(body.ids as string[]);
    revalidateSite();
    return NextResponse.json({ ok: true });
  });
}
