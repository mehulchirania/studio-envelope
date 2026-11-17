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
import type { Project } from "@/lib/content/types";
import { normalizeProject } from "@/lib/content/normalize";
import { seedProjects } from "@/lib/content/seed";
import { videos as seedVideos, type StudioVideo } from "@/lib/content/videos";
import { getDb, isFirebaseConfigured } from "@/lib/firebase/client";

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
  if (projects.length > 0) return projects;
  // Nothing published. Sample projects are only for a database that has never had projects:
  // if drafts exist (everything was unpublished or deleted down to drafts), stay empty.
  // The public reader can't see drafts, so ask admin storage when it is configured.
  if (process.env.FIREBASE_ADMIN_EMAIL && process.env.FIREBASE_ADMIN_PASSWORD) {
    try {
      const { hasAnyProjects } = await import("@/lib/firebase/admin-server");
      if (await hasAnyProjects()) return [];
    } catch (err) {
      console.warn("[data] Could not check for existing projects; using sample projects:", err);
    }
  }
  return fallbackProjects();
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
