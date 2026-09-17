// Public data access. Components must only use these functions.
// Implementation: Firestore when configured, otherwise falls back to local seed data.
// Safe to call from server components and generateStaticParams (uses the
// Firebase client SDK for reads, which works fine server-side against
// Firestore's public read rules and avoids needing admin credentials).
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import type { Project } from "./types";
import { seedProjects } from "./seed";
import { getDb, isFirebaseConfigured } from "./firebase";

async function fetchPublishedProjectsFromFirestore(): Promise<Project[]> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");

  const q = query(
    collection(db, "projects"),
    where("published", "==", true),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return { ...(data as Omit<Project, "id">), id: docSnap.id };
  });
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
