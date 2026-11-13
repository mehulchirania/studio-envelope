// Public data access. Components must only use these functions.
// Implementation: Firestore when configured (an empty Firestore falls back to seed data);
// local seed data when Firebase is not configured at all. A Firestore read ERROR is
// rethrown, never papered over with seed data, so ISR keeps the last good page and
// a build fails loudly instead of publishing stale sample content.
// Safe to call from server components and generateStaticParams (uses the
// Firebase client SDK for reads, which works fine server-side against
// Firestore's public read rules and avoids needing admin credentials).
import { cache } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import type { Project, Room } from "@/lib/content/types";
import { seedProjects } from "@/lib/content/seed";
import { videos as seedVideos, type StudioVideo } from "@/lib/content/videos";
import { getDb, isFirebaseConfigured } from "@/lib/firebase/client";

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

async function fetchPublishedProjectsFromFirestore(): Promise<Project[]> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");

  const q = query(
    collection(db, "projects"),
    where("published", "==", true),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => normalizeProject(docSnap.data(), docSnap.id));
}

function fallbackProjects(): Project[] {
  return seedProjects.filter((p) => p.published).sort((a, b) => a.order - b.order);
}

/** Published projects in site order. Cached per render so one request runs one query. */
export const getProjects = cache(async (): Promise<Project[]> => {
  if (!isFirebaseConfigured) return fallbackProjects();
  // Errors propagate on purpose (see the header comment).
  const projects = await fetchPublishedProjectsFromFirestore();
  // Firestore is reachable but empty (e.g. a fresh project before the
  // admin has imported the sample projects): don't show a blank site.
  return projects.length > 0 ? projects : fallbackProjects();
});

export async function getProject(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

/** Published films in site order: Firestore when it has any, otherwise the built-in list in content/videos.ts (also used when Firebase isn't configured). Read errors are rethrown. */
export const getVideos = cache(async (): Promise<StudioVideo[]> => {
  if (!isFirebaseConfigured) return seedVideos;
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  // Filter only, then sort here: a where + orderBy pair would need a composite index.
  const snapshot = await getDocs(query(collection(db, "videos"), where("published", "==", true)));
  const found = snapshot.docs
    .map((d) => ({ data: d.data(), id: d.id }))
    .sort((a, b) => Number(a.data.order ?? 0) - Number(b.data.order ?? 0))
    .map(({ data, id }): StudioVideo => {
      const video: StudioVideo = { id, title: (data.title as string) ?? "" };
      for (const key of ["projectSlug", "credits", "youtubeId", "src", "poster"] as const) {
        if (typeof data[key] === "string" && data[key]) video[key] = data[key] as string;
      }
      return video;
    });
  return found.length > 0 ? found : seedVideos;
});
