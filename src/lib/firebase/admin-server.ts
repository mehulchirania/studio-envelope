// Server-only: every admin read/write against Firestore goes through here.
//
// The people who log in to /admin ("admin", "prachi") are not Firebase users.
// This server holds ONE private Firebase email/password account (credentials in
// FIREBASE_ADMIN_EMAIL / FIREBASE_ADMIN_PASSWORD, never sent to the browser)
// and signs in as it; firestore.rules only trusts that account for writes and
// for reading drafts and messages. No service-account JSON is needed.
import "server-only";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword, type Auth } from "firebase/auth";
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  runTransaction,
  orderBy,
  serverTimestamp,
  query,
  addDoc,
  Timestamp as FsTimestamp,
  where,
  setDoc,
  updateDoc,
  writeBatch,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";
import { del } from "@vercel/blob";
import type { ContactMessage, Project } from "@/lib/content/types";
import { seedProjects } from "@/lib/content/seed";
import { normalizeProject } from "@/lib/content/normalize";
import { firebaseConfig, isFirebaseConfigured, USE_EMULATORS } from "@/lib/firebase/client";
import { HttpError } from "@/lib/admin/errors";
import { slugify } from "@/lib/admin/slug";
import type { AdminMessage, CarouselImage, ProjectFields, VideoFields, VideoRecord } from "@/lib/admin/types";
import { BLOB_HOST_SUFFIX } from "@/lib/admin/validate";

const APP_NAME = "admin-service";

interface Service {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  signingIn: Promise<void> | null;
}

// Cached per module instance, not on globalThis: after a dev hot reload the Firebase SDK is
// re-evaluated, and a Firestore object made by the old copy is rejected by the new copy's
// collection()/doc(). A fresh app name per module load avoids reusing such a stale app.
let cachedService: Service | undefined;
const appName = `${APP_NAME}-${Date.now()}`;

async function getDb(): Promise<Firestore> {
  if (!isFirebaseConfigured) throw new HttpError(503, "Firebase isn't configured on the server.");

  if (!cachedService) {
    const app = initializeApp(firebaseConfig, appName);
    const auth = getAuth(app);
    const db = getFirestore(app);
    if (USE_EMULATORS) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
    cachedService = { app, auth, db, signingIn: null };
  }

  const service = cachedService;
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

const CONFLICT_MESSAGE = "Someone else changed this while you were editing. Reload the page and try again.";

/** Throws 409 when the stored save time differs from the one the editor loaded. Skipped for records saved before updatedAt existed. */
function assertNotStale(stored: unknown, expected: string | undefined): void {
  if (typeof stored === "string" && stored && stored !== expected) throw new HttpError(409, CONFLICT_MESSAGE);
}

// ---------- Projects ----------

function imageUrls(project: Pick<Project, "coverImage" | "rooms" | "drawings">): string[] {
  return [
    project.coverImage,
    ...project.rooms.flatMap((room) => room.images.map((image) => image.src)),
    ...project.drawings.map((drawing) => drawing.src),
  ].filter(Boolean);
}

/** Best effort: removes our own Blob files (images or videos) that are no longer referenced. Never throws. */
async function deleteBlobFiles(urls: string[]): Promise<void> {
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
    console.warn("[admin] Could not delete some files from Blob storage:", err);
  }
}

function toDocument(fields: ProjectFields, slug: string, order: number) {
  return {
    ...fields,
    slug,
    order,
    updatedAt: new Date().toISOString(),
    gallery: fields.rooms.flatMap((room) => room.images.map((image) => image.src)),
  };
}

/** Every project in the database (drafts included), in site order. */
export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  const snapshot = await getDocs(query(collection(db, "projects"), orderBy("order", "asc")));
  return snapshot.docs.map((d) => normalizeProject(d.data(), d.id));
}

/** True when the projects collection holds any document at all, drafts included. */
export async function hasAnyProjects(): Promise<boolean> {
  const db = await getDb();
  return !(await getDocs(query(collection(db, "projects"), limit(1)))).empty;
}

export async function getProjectById(id: string): Promise<Project | null> {
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
  // Bump past slugs in the list, then confirm against the document itself so a race can't overwrite one.
  for (let n = 2; ; n++) {
    if (!taken.has(slug) && !(await getDoc(doc(db, "projects", slug))).exists()) break;
    slug = `${base}-${n}`;
  }

  const order = existing.reduce((max, p) => Math.max(max, p.order), -1) + 1;
  const data = toDocument(fields, slug, order);
  await setDoc(doc(db, "projects", slug), data);
  return normalizeProject(data, slug);
}

export async function updateProject(id: string, fields: ProjectFields, expectedUpdatedAt?: string): Promise<Project> {
  const db = await getDb();
  const ref = doc(db, "projects", id);
  // Read, stale check and write in one transaction so a concurrent save can't slip between them.
  const { previous, data } = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new HttpError(404, "That project no longer exists.");
    assertNotStale(snap.data().updatedAt, expectedUpdatedAt);
    const previous = normalizeProject(snap.data(), id);
    // Slug (the page URL) and order are kept stable across edits.
    const data = toDocument(fields, previous.slug, previous.order);
    tx.set(ref, data);
    return { previous, data };
  });

  const next = normalizeProject(data, id);
  const stillUsed = new Set(imageUrls(next));
  await deleteBlobFiles(imageUrls(previous).filter((url) => !stillUsed.has(url)));
  return next;
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  const ref = doc(db, "projects", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const previous = normalizeProject(snap.data(), id);
  await deleteDoc(ref);
  await deleteBlobFiles(imageUrls(previous));
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

// ---------- Videos ----------

function normalizeVideo(data: Record<string, unknown>, id: string): VideoRecord {
  const video: VideoRecord = {
    id,
    title: (data.title as string) ?? "",
    order: typeof data.order === "number" ? data.order : 0,
    published: Boolean(data.published),
  };
  if (typeof data.updatedAt === "string" && data.updatedAt) video.updatedAt = data.updatedAt;
  for (const key of ["projectSlug", "credits", "youtubeId", "src", "poster"] as const) {
    if (typeof data[key] === "string" && data[key]) video[key] = data[key] as string;
  }
  return video;
}

const videoFiles = (video: Pick<VideoRecord, "src" | "poster">) =>
  [video.src, video.poster].filter((url): url is string => Boolean(url));

/** Every video in the database (drafts included), in site order. */
export async function listVideos(): Promise<VideoRecord[]> {
  const db = await getDb();
  const snapshot = await getDocs(query(collection(db, "videos"), orderBy("order", "asc")));
  return snapshot.docs.map((d) => normalizeVideo(d.data(), d.id));
}

export async function getVideoById(id: string): Promise<VideoRecord | null> {
  const db = await getDb();
  const snap = await getDoc(doc(db, "videos", id));
  return snap.exists() ? normalizeVideo(snap.data(), snap.id) : null;
}

export async function createVideo(fields: VideoFields): Promise<VideoRecord> {
  const db = await getDb();
  const existing = await listVideos();
  const order = existing.reduce((max, v) => Math.max(max, v.order), -1) + 1;
  const ref = doc(collection(db, "videos"));
  const data = { ...fields, order, updatedAt: new Date().toISOString() };
  await setDoc(ref, data);
  return normalizeVideo(data, ref.id);
}

export async function updateVideo(id: string, fields: VideoFields, expectedUpdatedAt?: string): Promise<VideoRecord> {
  const db = await getDb();
  const ref = doc(db, "videos", id);
  const { previous, data } = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new HttpError(404, "That video no longer exists.");
    assertNotStale(snap.data().updatedAt, expectedUpdatedAt);
    const previous = normalizeVideo(snap.data(), id);
    const data = { ...fields, order: previous.order, updatedAt: new Date().toISOString() };
    tx.set(ref, data);
    return { previous, data };
  });

  const next = normalizeVideo(data, id);
  const stillUsed = new Set(videoFiles(next));
  await deleteBlobFiles(videoFiles(previous).filter((url) => !stillUsed.has(url)));
  return next;
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await getDb();
  const ref = doc(db, "videos", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const previous = normalizeVideo(snap.data(), id);
  await deleteDoc(ref);
  await deleteBlobFiles(videoFiles(previous));
}

/** Saves the given order (first id = first on the site). Unknown ids are ignored. */
export async function reorderVideos(ids: string[]): Promise<void> {
  const db = await getDb();
  const existing = new Set((await listVideos()).map((v) => v.id));
  const batch = writeBatch(db);
  ids
    .filter((id) => existing.has(id))
    .forEach((id, index) => batch.update(doc(db, "videos", id), { order: index }));
  await batch.commit();
}

// ---------- Home carousel ----------

/** The saved carousel list, or null when none has been saved yet. */
export async function getCarousel(): Promise<CarouselImage[] | null> {
  const db = await getDb();
  const data = (await getDoc(doc(db, "settings", "homeCarousel"))).data();
  if (!data || !Array.isArray(data.images)) return null;
  return data.images
    .filter((i: unknown): i is Record<string, unknown> => Boolean(i) && typeof (i as { src?: unknown }).src === "string")
    .map((i: Record<string, unknown>) => ({
      src: i.src as string,
      alt: typeof i.alt === "string" ? i.alt : "",
      ...(typeof i.slug === "string" && i.slug ? { slug: i.slug } : {}),
    }));
}

/** Only files uploaded through the carousel editor are deleted from storage when removed; project photos are never touched. */
function isCarouselUpload(url: string): boolean {
  try {
    return new URL(url).pathname.startsWith("/projects/carousel/");
  } catch {
    return false;
  }
}

export async function saveCarousel(images: CarouselImage[]): Promise<void> {
  const db = await getDb();
  const previous = (await getCarousel()) ?? [];
  await setDoc(doc(db, "settings", "homeCarousel"), { images, updatedAt: new Date().toISOString() });
  const keep = new Set(images.map((i) => i.src));
  await deleteBlobFiles(previous.map((i) => i.src).filter((src) => !keep.has(src) && isCarouselUpload(src)));
}

/** Forgets the saved list so the site goes back to using every published project photograph. */
export async function resetCarousel(): Promise<void> {
  const db = await getDb();
  const previous = (await getCarousel()) ?? [];
  await deleteDoc(doc(db, "settings", "homeCarousel"));
  await deleteBlobFiles(previous.map((i) => i.src).filter(isCarouselUpload));
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

/** Saves a public enquiry. Called only by /api/contact after server-side validation; the rules allow no browser writes. */
export async function createMessage(msg: ContactMessage, consentVersion: string): Promise<void> {
  const db = await getDb();
  await addDoc(collection(db, "messages"), {
    ...msg,
    consent: true,
    consentVersion,
    read: false,
    createdAt: serverTimestamp(),
  });
}

/** Deletes enquiries created before `cutoff` (data retention). Returns how many were removed. */
export async function purgeMessagesBefore(cutoff: Date): Promise<number> {
  const db = await getDb();
  const snapshot = await getDocs(query(collection(db, "messages"), where("createdAt", "<", FsTimestamp.fromDate(cutoff))));
  for (let i = 0; i < snapshot.docs.length; i += 400) {
    const batch = writeBatch(db);
    snapshot.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  return snapshot.size;
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  const db = await getDb();
  await updateDoc(doc(db, "messages", id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  const db = await getDb();
  await deleteDoc(doc(db, "messages", id));
}

// ---------- Admin passwords ----------
// Passwords changed from the admin panel: hashed (scrypt) in `adminUsers/{username}`.

// A reset adds a short-lived `temp` password beside the real one (the real one keeps working,
// so a stranger requesting resets can't lock the owner out). Saving a new password clears it.

export interface PasswordRecord {
  /** Empty when the user has no stored password yet (the one from ADMIN_USERS applies). */
  salt: string;
  hash: string;
  updatedAt: string;
  temp: { salt: string; hash: string; createdAt: string; expiresAt: string } | null;
}

export async function getPasswordRecord(username: string): Promise<PasswordRecord | null> {
  const db = await getDb();
  const data = (await getDoc(doc(db, "adminUsers", username))).data();
  if (!data) return null;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const t = data.temp as Record<string, unknown> | undefined;
  const temp = t && str(t.salt) && str(t.hash) ? { salt: str(t.salt), hash: str(t.hash), createdAt: str(t.createdAt), expiresAt: str(t.expiresAt) } : null;
  if (!(str(data.salt) && str(data.hash)) && !temp) return null;
  return { salt: str(data.salt), hash: str(data.hash), updatedAt: str(data.updatedAt), temp };
}

/** Replaces the stored password and drops any temporary one. */
export async function setPasswordRecord(username: string, salt: string, hash: string): Promise<void> {
  const db = await getDb();
  await setDoc(doc(db, "adminUsers", username), { salt, hash, updatedAt: new Date().toISOString() });
}

/** Adds a temporary password without touching the real one or its version stamp. */
export async function setTempPasswordRecord(username: string, temp: { salt: string; hash: string; expiresAt: string }): Promise<void> {
  const db = await getDb();
  await setDoc(doc(db, "adminUsers", username), { temp: { ...temp, createdAt: new Date().toISOString() } }, { merge: true });
}
