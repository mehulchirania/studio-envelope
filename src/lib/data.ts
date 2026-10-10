// Public data access. Components must only use these functions.
// Implementation: Firestore when configured, otherwise falls back to local seed data.
// Safe to call from server components and generateStaticParams (uses the
// Firebase client SDK for reads, which works fine server-side against
// Firestore's public read rules and avoids needing admin credentials).
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import type { Project, Room } from "@/lib/content/types";
import { seedProjects } from "@/lib/content/seed";
import { getDb, isFirebaseConfigured } from "@/lib/firebase/client";

/** Fills in fields that may be missing on older Firestore documents written
 * before the room/drawing model existed, so the rest of the app can assume a
 * complete Project shape. */
export function normalizeProject(data: Record<string, unknown>, id: string): Project {
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

export async function getProjects(): Promise<Project[]> {
  if (isFirebaseConfigured) {
    try {
      const projects = await fetchPublishedProjectsFromFirestore();
      // Firestore is reachable but empty (e.g. a fresh project before the
      // admin has imported the sample projects) — don't show a blank site.
      if (projects.length > 0) return projects;
      return fallbackProjects();
    } catch (err) {
      console.warn("[data] Firestore read failed, falling back to seed data:", err);
    }
  }
  return fallbackProjects();
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}
