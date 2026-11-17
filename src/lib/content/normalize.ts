import type { Project, Room } from "@/lib/content/types";

/** Fills in fields that may be missing on older Firestore documents written
 * before the room/drawing model existed, so the rest of the app can assume a
 * complete Project shape. */
export function normalizeProject(data: Record<string, unknown>, id: string): Project & { updatedAt?: string } {
  const legacyGallery = Array.isArray(data.gallery) ? (data.gallery as string[]) : [];
  const rooms: Room[] = Array.isArray(data.rooms) && data.rooms.length > 0
    ? (data.rooms as Room[])
    : legacyGallery.length > 0
      ? [{ name: "Gallery", images: legacyGallery.map((src) => ({ src, kind: "photo", alt: (data.title as string) ?? "", width: 1600, height: 1200 })) }]
      : [];

  return {
    id,
    slug: (data.slug as string) ?? id,
    title: (data.title as string) ?? "",
    subtitle: data.subtitle as string | undefined,
    location: (data.location as string) ?? "",
    year: (data.year as number | null | undefined) ?? null,
    area: data.area as string | undefined,
    status: (data.status as Project["status"]) ?? "Completed",
    scope: (data.scope as Project["scope"]) ?? "Interior",
    summary: (data.summary as string) ?? "",
    description: (data.description as string) ?? "",
    credit: data.credit as string | undefined,
    coverImage: (data.coverImage as string) ?? legacyGallery[0] ?? "",
    rooms,
    drawings: Array.isArray(data.drawings) ? (data.drawings as Project["drawings"]) : [],
    gallery: rooms.flatMap((room) => room.images.map((image) => image.src)),
    featured: Boolean(data.featured),
    order: typeof data.order === "number" ? data.order : 0,
    published: Boolean(data.published),
    ...(typeof data.updatedAt === "string" && data.updatedAt ? { updatedAt: data.updatedAt } : {}),
  };
}
