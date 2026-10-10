import { NextResponse } from "next/server";
import { handle, requireAdmin } from "@/lib/admin/http";
import { revalidateSite } from "@/lib/admin/revalidate";
import { importSampleProjects } from "@/lib/firebase/admin-server";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const count = await importSampleProjects();
    revalidateSite();
    return NextResponse.json({ imported: count });
  });
}
