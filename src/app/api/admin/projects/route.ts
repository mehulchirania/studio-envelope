import { NextResponse } from "next/server";
import { handle, readJson, requireAdmin } from "@/lib/admin/http";
import { revalidateSite } from "@/lib/admin/revalidate";
import type { ProjectsResponse } from "@/lib/admin/types";
import { parseProjectFields } from "@/lib/admin/validate";
import { seedProjects } from "@/lib/content/seed";
import { createProject, listProjects } from "@/lib/firebase/admin-server";

/** Everything the site shows, drafts included. Falls back to the sample projects while the database is empty. */
export async function GET(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const projects = await listProjects();
    const body: ProjectsResponse =
      projects.length > 0
        ? { projects, source: "database" }
        : { projects: [...seedProjects].sort((a, b) => a.order - b.order), source: "samples" };
    return NextResponse.json(body);
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const fields = parseProjectFields(await readJson(request));
    const project = await createProject(fields);
    revalidateSite();
    return NextResponse.json({ project }, { status: 201 });
  });
}
