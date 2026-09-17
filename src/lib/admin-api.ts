"use client";
// Admin-only data access: auth, project CRUD (incl. unpublished), image
// uploads, the messages inbox, and the revalidation trigger. Everything here
// assumes the caller has already confirmed `isFirebaseConfigured` and, for
// writes, that the signed-in user passed `checkIsAdmin()` — the actual
// enforcement lives in firestore.rules and the /api/upload* routes regardless.
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { upload } from "@vercel/blob/client";
import type { ContactMessage, Project } from "./types";
import { seedProjects } from "./seed";
import { getDb, getFirebaseAuth } from "./firebase";

// ---------- Auth ----------

export function watchAuthState(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured");
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function signOutAdmin(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

/**
 * Determines admin access with a probe query: `messages` is only readable by
 * admins per firestore.rules (the hardcoded email list at its top), so a
 * successful read *is* proof of admin access. There's no separate allowlist
 * doc to keep in sync client-side — the rules file is the source of truth.
 */
export async function checkIsAdmin(): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    await getDocs(query(collection(db, "messages"), limit(1)));
    return true;
  } catch {
    return false;
  }
}

// ---------- Slug helper ----------

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ---------- Projects ----------

function requireDb() {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  return db;
}

/** All projects (published and unpublished), ordered by `order`. */
export async function listAllProjects(): Promise<Project[]> {
  const db = requireDb();
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...(d.data() as Omit<Project, "id">), id: d.id }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  return { ...(snap.data() as Omit<Project, "id">), id: snap.id };
}

export type ProjectInput = Omit<Project, "id">;

export async function createProject(data: ProjectInput): Promise<string> {
  const db = requireDb();
  const ref = await addDoc(collection(db, "projects"), data);
  return ref.id;
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string): Promise<void> {
  const db = requireDb();
  await deleteDoc(doc(db, "projects", id));
}

/** Persists a new relative order for a list of project ids (drag-reorder). */
export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const db = requireDb();
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "projects", id), { order: index });
  });
  await batch.commit();
}

/**
 * Writes every local seed project (src/lib/seed.ts) into Firestore as the
 * signed-in admin, one doc per project keyed by slug. Used by the "Import
 * sample projects" button on the admin dashboard when `projects` is empty —
 * there's no service account available to seed this from the CLI on a fresh
 * Spark-plan Firebase project, so the import happens through the client SDK
 * (and firestore.rules) instead.
 */
export async function importSeedProjects(): Promise<number> {
  const db = requireDb();
  const batch = writeBatch(db);
  for (const project of seedProjects) {
    const { id: _id, slug, ...rest } = project;
    void _id; // Firestore doc id (below) is the source of truth, not the seed's `id` field.
    batch.set(doc(db, "projects", slug), { ...rest, slug });
  }
  await batch.commit();
  return seedProjects.length;
}

// ---------- Vercel Blob (project images) ----------

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Uploads one image straight from the browser to Vercel Blob at
 * `projects/{slug}/{filename}` (random suffix added server-side) and returns
 * its public URL. Auth: /api/upload verifies the signed-in admin's Firebase
 * ID token, which we pass through `clientPayload`.
 */
export async function uploadProjectImage(
  slug: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) throw new Error("Firebase is not configured");

  const idToken = await user.getIdToken();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const pathname = `projects/${slug}/${safeName}`;

  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ idToken }),
    onUploadProgress: ({ percentage }) => onProgress?.(percentage),
  });

  return { url: blob.url, path: blob.pathname };
}

/**
 * Best-effort delete via /api/upload/delete; failures are swallowed since
 * the URL may be external/seed data (the route itself also ignores non-Blob
 * URLs, e.g. Unsplash placeholders).
 */
export async function deleteProjectImageByUrl(url: string): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) return;
  try {
    const idToken = await user.getIdToken();
    await fetch("/api/upload/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Non-fatal.
  }
}

// ---------- Messages ----------

export interface AdminMessage extends ContactMessage {
  id: string;
  read: boolean;
  createdAt: Timestamp | null;
}

export async function listMessages(): Promise<AdminMessage[]> {
  const db = requireDb();
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      projectType: data.projectType,
      budget: data.budget,
      message: data.message,
      read: Boolean(data.read),
      createdAt: (data.createdAt as Timestamp) ?? null,
    };
  });
}

export async function markMessageRead(id: string, read = true): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, "messages", id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  const db = requireDb();
  await deleteDoc(doc(db, "messages", id));
}

// ---------- Revalidation ----------

/** Calls /api/revalidate (owned by this app) so public pages reflect the latest edit. */
export async function triggerRevalidate(paths?: string[]): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) return;
  try {
    const token = await user.getIdToken();
    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paths }),
    });
  } catch (err) {
    // Non-fatal: the save already succeeded; ISR will still catch up eventually.
    console.warn("[admin-api] Revalidation request failed:", err);
  }
}

// Re-exported so callers don't need to import from firebase/firestore just for this.
export { serverTimestamp };
