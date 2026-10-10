// Server-only: every admin read/write against Firestore goes through here.
//
// The people who log in to /admin ("admin", "prachi") are not Firebase users.
// This server holds ONE private Firebase email/password account (credentials in
// FIREBASE_ADMIN_EMAIL / FIREBASE_ADMIN_PASSWORD, never sent to the browser)
// and signs in as it; firestore.rules only trusts that account for writes and
// for reading drafts and messages. No service-account JSON is needed.
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword, type Auth } from "firebase/auth";
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";
import { del } from "@vercel/blob";
import type { Project } from "@/lib/content/types";
import { seedProjects } from "@/lib/content/seed";
import { normalizeProject } from "@/lib/data";
import { firebaseConfig, isFirebaseConfigured, USE_EMULATORS } from "@/lib/firebase/client";
import { HttpError } from "@/lib/admin/http";
import { slugify } from "@/lib/admin/slug";
import type { AdminMessage, ProjectFields } from "@/lib/admin/types";
import { BLOB_HOST_SUFFIX } from "@/lib/admin/validate";

const APP_NAME = "admin-service";

interface Service {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  signingIn: Promise<void> | null;
}

// Kept on globalThis so dev hot-reloads reuse the same app instead of re-initialising it.
const globalState = globalThis as unknown as { __studioEnvelopeAdmin?: Service };

async function getDb(): Promise<Firestore> {
  if (!isFirebaseConfigured) throw new HttpError(503, "Firebase isn't configured on the server.");

  if (!globalState.__studioEnvelopeAdmin) {
    const app = getApps().find((a) => a.name === APP_NAME) ?? initializeApp(firebaseConfig, APP_NAME);
    const auth = getAuth(app);
    const db = getFirestore(app);
    if (USE_EMULATORS) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
    globalState.__studioEnvelopeAdmin = { app, auth, db, signingIn: null };
  }

  const service = globalState.__studioEnvelopeAdmin;
  if (!service.auth.currentUser) {
    const email = process.env.FIREBASE_ADMIN_EMAIL;
    const password = process.env.FIREBASE_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new HttpError(503, "Admin storage isn't configured (FIREBASE_ADMIN_EMAIL / FIREBASE_ADMIN_PASSWORD).");
    }
    service.signingIn ??= signInWithEmailAndPassword(service.auth, email, password)
      .then(() => undefined)
      .finally(() => {
        service.signingIn = null;
      });
    try {
      await service.signingIn;
    } catch (err) {
      console.error("[admin] Service account sign-in failed:", err);
      throw new HttpError(503, "Admin storage sign-in failed. Check the Firebase service account settings.");
    }
  }
  return service.db;
}

// ---------- Projects ----------

function imageUrls(project: Pick<Project, "coverImage" | "rooms" | "drawings">): string[] {
  return [
    project.coverImage,
    ...project.rooms.flatMap((room) => room.images.map((image) => image.src)),
    ...project.drawings.map((drawing) => drawing.src),
  ].filter(Boolean);
}

/** Best effort: removes our own Blob images that are no longer referenced. Never throws. */
async function deleteBlobImages(urls: string[]): Promise<void> {
  const ours = [
    ...new Set(
      urls.filter((url) => {
        try {
          return new URL(url).hostname.endsWith(BLOB_HOST_SUFFIX);
        } catch {
          return false;
        }
      })
    ),
  ];
  if (ours.length === 0) return;
  try {
    await del(ours);
  } catch (err) {
    console.warn("[admin] Could not delete some images from Blob storage:", err);
  }
}

function toDocument(fields: ProjectFields, slug: string, order: number) {
  return {
    ...fields,
    slug,
    order,
    gallery: fields.rooms.flatMap((room) => room.images.map((image) => image.src)),
  };
}

/** Every project in the database (drafts included), in site order. */
export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  const snapshot = await getDocs(query(collection(db, "projects"), orderBy("order", "asc")));
  return snapshot.docs.map((d) => normalizeProject(d.data(), d.id));
}

export async function getProject(id: string): Promise<Project | null> {
  const db = await getDb();
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? normalizeProject(snap.data(), snap.id) : null;
}

export async function createProject(fields: ProjectFields): Promise<Project> {
  const db = await getDb();
  const existing = await listProjects();
  const taken = new Set(existing.map((p) => p.id));

  const base = slugify(fields.title) || "project";
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  const order = existing.reduce((max, p) => Math.max(max, p.order), -1) + 1;
  const data = toDocument(fields, slug, order);
  await setDoc(doc(db, "projects", slug), data);
  return normalizeProject(data, slug);
}

export async function updateProject(id: string, fields: ProjectFields): Promise<Project> {
  const db = await getDb();
  const ref = doc(db, "projects", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new HttpError(404, "That project no longer exists.");

  const previous = normalizeProject(snap.data(), id);
  // Slug (the page URL) and order are kept stable across edits.
  const data = toDocument(fields, previous.slug, previous.order);
  await setDoc(ref, data);

  const next = normalizeProject(data, id);
  const stillUsed = new Set(imageUrls(next));
  await deleteBlobImages(imageUrls(previous).filter((url) => !stillUsed.has(url)));
  return next;
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  const ref = doc(db, "projects", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const previous = normalizeProject(snap.data(), id);
  await deleteDoc(ref);
  await deleteBlobImages(imageUrls(previous));
}

/** Saves the given order (first id = first on the site). Unknown ids are ignored. */
export async function reorderProjects(ids: string[]): Promise<void> {
  const db = await getDb();
  const existing = new Set((await listProjects()).map((p) => p.id));
  const batch = writeBatch(db);
  ids
    .filter((id) => existing.has(id))
    .forEach((id, index) => batch.update(doc(db, "projects", id), { order: index }));
  await batch.commit();
}

/** Writes the built-in sample projects to Firestore. Refuses if projects already exist. */
export async function importSampleProjects(): Promise<number> {
  const db = await getDb();
  if ((await listProjects()).length > 0) {
    throw new HttpError(409, "There are already projects in the database, so nothing was imported.");
  }
  const batch = writeBatch(db);
  for (const project of seedProjects) {
    const { id: _id, ...rest } = project;
    void _id;
    batch.set(doc(db, "projects", project.slug), rest);
  }
  await batch.commit();
  return seedProjects.length;
}

// ---------- Messages ----------

export async function listMessages(): Promise<AdminMessage[]> {
  const db = await getDb();
  const snapshot = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
  return snapshot.docs.map((d) => {
    const data = d.data();
    const createdAt = data.createdAt as Timestamp | null | undefined;
    return {
      id: d.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      projectType: data.projectType,
      budget: data.budget,
      message: data.message,
      read: Boolean(data.read),
      createdAt: createdAt ? createdAt.toDate().toISOString() : null,
    };
  });
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  const db = await getDb();
  await updateDoc(doc(db, "messages", id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  const db = await getDb();
  await deleteDoc(doc(db, "messages", id));
}
