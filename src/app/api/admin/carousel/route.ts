import { NextResponse } from "next/server";
import { handle, readJson, requireAdmin } from "@/lib/admin/http";
import { revalidateSite } from "@/lib/admin/revalidate";
import { parseCarouselImages } from "@/lib/admin/validate";
import { getCarousel, listProjects, resetCarousel, saveCarousel } from "@/lib/firebase/admin-server";
import type { CarouselResponse } from "@/lib/admin/types";

export async function GET(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const [saved, projects] = await Promise.all([getCarousel(), listProjects()]);
    const projectPhotos = projects
      .filter((p) => p.published)
      .flatMap((p) =>
        p.rooms.flatMap((r) => r.images.filter((i) => i.kind === "photo").map((i) => ({ src: i.src, alt: i.alt, slug: p.slug }))),
      );
    return NextResponse.json({ saved, projectPhotos } satisfies CarouselResponse);
  });
}

export async function PUT(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    const images = parseCarouselImages(await readJson(request));
    // An empty list would blank the section, so "remove everything" means going back to the default.
    if (images.length === 0) await resetCarousel();
    else await saveCarousel(images);
    revalidateSite({ notify: false });
    return NextResponse.json({ ok: true });
  });
}

export async function DELETE(request: Request) {
  return handle(async () => {
    await requireAdmin(request);
    await resetCarousel();
    revalidateSite({ notify: false });
    return NextResponse.json({ ok: true });
  });
}
