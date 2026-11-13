import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

process.env.ADMIN_SESSION_SECRET = "test-secret-at-least-16-chars";
process.env.ADMIN_USERS = "admin:s3cret";
(globalThis as any).__getPasswordRecord = async () => null;

const { createSessionToken, getSessionUser } = await import("../src/lib/admin/session.ts");
const { verifyCredentials } = await import("../src/lib/admin/users.ts");
const { parseProjectFields, parseVideoFields } = await import("../src/lib/admin/validate.ts");
const { HttpError } = await import("../src/lib/admin/http.ts");

const SECRET = process.env.ADMIN_SESSION_SECRET!;
const sign = (p: string, k = SECRET) => createHmac("sha256", k).update(p).digest("base64url");
const mint = (data: object, k = SECRET) => { const p = Buffer.from(JSON.stringify(data)).toString("base64url"); return ; };
const withCookie = async (v?: string) => { (globalThis as any).__cookie = v; return getSessionUser(); };
const now = () => Math.floor(Date.now() / 1000);

test("valid session token resolves to the user", async () => {
  assert.equal(await withCookie(createSessionToken("admin", "")!), "admin");
});

test("missing, tampered, wrong-key and expired tokens are rejected", async () => {
  assert.equal(await withCookie(undefined), null);
  const good = createSessionToken("admin", "")!;
  assert.equal(await withCookie(good.slice(0, -2) + "xx"), null);
  assert.equal(await withCookie(mint({ u: "admin", v: "", exp: now() + 100 }, "other-secret-0123456789")), null);
  assert.equal(await withCookie(mint({ u: "admin", v: "", exp: now() - 10 })), null);
});

test("token from before a password change is rejected", async () => {
  const token = createSessionToken("admin", "old")!;
  assert.equal(await withCookie(token), null); // stored version is "" now
  (globalThis as any).__getPasswordRecord = async () => ({ updatedAt: "old" });
  assert.equal(await withCookie(token), "admin");
  (globalThis as any).__getPasswordRecord = async () => { throw new Error("down"); };
  assert.equal(await withCookie(token), null); // fails closed
  (globalThis as any).__getPasswordRecord = async () => null;
});

test("verifyCredentials", async () => {
  assert.equal(await verifyCredentials("Admin", "s3cret"), "admin");
  assert.equal(await verifyCredentials("admin", "bad"), null);
  assert.equal(await verifyCredentials("nobody", "s3cret"), null);
});

test("verifyCredentials fails closed when Firestore lookup throws", async () => {
  (globalThis as any).__getPasswordRecord = async () => { throw new Error("down"); };
  await assert.rejects(() => verifyCredentials("admin", "s3cret"), (e: any) => e instanceof HttpError && e.status === 503);
  (globalThis as any).__getPasswordRecord = async () => null;
});

test("video fields reject non-Blob cover images", () => {
  const base = { title: "T", youtubeId: "dQw4w9WgXcQ" };
  assert.throws(() => parseVideoFields({ ...base, poster: "https://evil.com/x.jpg" }), HttpError);
  assert.throws(() => parseVideoFields({ title: "T", src: "https://evil.com/v.mp4" }), HttpError);
  assert.equal(parseVideoFields({ ...base, poster: "https://abc.public.blob.vercel-storage.com/x.jpg" }).poster, "https://abc.public.blob.vercel-storage.com/x.jpg");
});

test("project fields reject non-Blob images", () => {
  assert.throws(() => parseProjectFields({ title: "P", coverImage: "https://evil.com/x.jpg" }), HttpError);
  assert.throws(() => parseProjectFields({ title: "P", coverImage: "https://x.public.blob.vercel-storage.com.evil.com/x.jpg" }), HttpError);
});
