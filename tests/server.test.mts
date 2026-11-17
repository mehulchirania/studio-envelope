/* eslint-disable @typescript-eslint/no-explicit-any -- test stubs are loosely typed */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

process.env.ADMIN_SESSION_SECRET = "test-secret-at-least-16-chars";
process.env.ADMIN_USERS = "admin:s3cret";
(globalThis as any).__getPasswordRecord = async () => null;

const { createSessionToken, getSession, getSessionUser } = await import("../src/lib/admin/session.ts");
const { issueTempPassword, verifyCredentials, verifyLogin } = await import("../src/lib/admin/users.ts");
const { parseProjectFields, parseVideoFields } = await import("../src/lib/admin/validate.ts");
const { HttpError } = await import("../src/lib/admin/errors.ts");

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

test("emailed temporary password signs in as temporary; the real password still works", async () => {
  const g = globalThis as any;
  g.__temp = undefined;
  const temp = await issueTempPassword("Prachi");
  assert.ok(temp && temp.length === 12);
  assert.equal(g.__temp.n, "prachi");
  const { salt, hash } = g.__temp.t;
  const record = (expiresAt: string) => async () => ({ salt: "", hash: "", updatedAt: "", temp: { salt, hash, createdAt: new Date().toISOString(), expiresAt } });

  g.__getPasswordRecord = record(new Date(Date.now() + 60_000).toISOString());
  assert.deepEqual(await verifyLogin("prachi", temp), { user: "prachi", temporary: true });
  assert.equal(await verifyLogin("prachi", "wrong"), null);

  g.__getPasswordRecord = record(new Date(Date.now() - 1000).toISOString()); // expired
  assert.equal(await verifyLogin("prachi", temp), null);
  g.__getPasswordRecord = async () => null;
});

test("temporary passwords: only resettable users, and a cooldown between requests", async () => {
  const g = globalThis as any;
  assert.equal(await issueTempPassword("admin"), null);
  assert.equal(await issueTempPassword("nobody"), null);
  g.__getPasswordRecord = async () => ({ salt: "", hash: "", updatedAt: "", temp: { salt: "s", hash: "h", createdAt: new Date().toISOString(), expiresAt: "" } });
  assert.equal(await issueTempPassword("prachi"), null);
  g.__getPasswordRecord = async () => null;
});

test("a temporary-password session counts as signed out for normal routes", async () => {
  const g = globalThis as any;
  g.__cookie = createSessionToken("prachi", "", true)!;
  assert.equal(await getSessionUser(), null);
  assert.deepEqual(await getSession(), { user: "prachi", mustChange: true });
  g.__cookie = createSessionToken("prachi", "", false)!;
  assert.equal(await getSessionUser(), "prachi");
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
