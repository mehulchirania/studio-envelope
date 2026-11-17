/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "k";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "p";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "a";
process.env.FIREBASE_ADMIN_EMAIL = "svc@example.com";
process.env.FIREBASE_ADMIN_PASSWORD = "x";

// Tiny in-memory Firestore: docs by "collection/id"; limit(1) queries are the hasAnyProjects check.
const docs = new Map<string, Record<string, unknown>>();
const snap = (path: string) => ({ exists: () => docs.has(path), data: () => docs.get(path), id: path.split("/")[1] });
(globalThis as any).__fs = {
  initializeApp: () => ({}),
  getApps: () => [],
  getAuth: () => ({ currentUser: {} }),
  getFirestore: () => ({}),
  collection: (_db: unknown, path: string) => ({ path }),
  doc: (_db: unknown, ...seg: string[]) => ({ path: seg.join("/") }),
  query: (...args: any[]) => ({ args }),
  limit: (n: number) => ({ limit: n }),
  where: () => ({}),
  orderBy: () => ({}),
  getDoc: async (ref: any) => snap(ref.path),
  getDocs: async (q: any) => {
    const col = q.args[0].path;
    const limited = q.args.some((a: any) => a && "limit" in a);
    const published = q.args.some((a: any) => a && !("limit" in a) && !("path" in a) && Object.keys(a).length === 0);
    let found = [...docs].filter(([p]) => p.startsWith(col + "/"));
    if (published) found = found.filter(([, d]) => d.published === true);
    if (limited) found = found.slice(0, 1);
    return { empty: found.length === 0, size: found.length, docs: found.map(([p, d]) => ({ id: p.split("/")[1], data: () => d })) };
  },
  runTransaction: async (_db: unknown, cb: (tx: unknown) => unknown) =>
    cb({ get: async (ref: any) => snap(ref.path), set: (ref: any, d: any) => void docs.set(ref.path, d) }),
  del: async () => undefined,
};

const { updateProject, updateVideo, hasAnyProjects } = await import("../src/lib/firebase/admin-server.ts");
// data.ts imports admin storage through the stubbed alias; point the stub at the real function.
(globalThis as any).__hasAnyProjects = hasAnyProjects;
const { getProjects } = await import("../src/lib/data.ts");
const { seedProjects } = await import("../src/lib/content/seed.ts");
const { HttpError } = await import("../src/lib/admin/errors.ts");

const projectFields: any = { title: "T", location: "", scope: "Interior", status: "Completed", summary: "", description: "", coverImage: "", rooms: [], drawings: [], featured: false, published: false };

test("updateProject: matching updatedAt saves, stale one is 409, missing is 404", async () => {
  docs.set("projects/p1", { slug: "p1", title: "Old", order: 3, updatedAt: "2026-01-01T00:00:00.000Z" });
  const saved = await updateProject("p1", projectFields, "2026-01-01T00:00:00.000Z");
  assert.equal(saved.title, "T");
  assert.equal(saved.order, 3);
  await assert.rejects(() => updateProject("p1", projectFields, "2026-01-01T00:00:00.000Z"), (e: any) => e instanceof HttpError && e.status === 409);
  await assert.rejects(() => updateProject("nope", projectFields), (e: any) => e instanceof HttpError && e.status === 404);
});

test("updateVideo: stale updatedAt is 409", async () => {
  docs.set("videos/v1", { title: "V", order: 0, published: false, updatedAt: "2026-02-02T00:00:00.000Z" });
  await assert.rejects(() => updateVideo("v1", { title: "V2", published: false } as any, "old"), (e: any) => e instanceof HttpError && e.status === 409);
  await assert.rejects(() => updateVideo("nope", { title: "V2", published: false } as any), (e: any) => e instanceof HttpError && e.status === 404);
});

test("getProjects: seeds only for a database that never had projects", async () => {
  docs.clear();
  const seeded = await getProjects();
  assert.ok(seeded.length > 0 && seeded.length <= seedProjects.length);

  // Only drafts remain: the owner unpublished everything, so the site must not fall back to samples.
  docs.set("projects/draft", { slug: "draft", title: "Draft", order: 0, published: false });
  const fresh = await import("../src/lib/data.ts?drafts-only");
  assert.deepEqual(await fresh.getProjects(), []);
});
