// Test loader: resolves the "@/" alias to src/ and stubs Next/Firebase modules so server code loads under plain Node.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const stubs = {
  "server-only": "export {};",
  "next/headers": "export async function cookies(){ return { get(){ const v = globalThis.__cookie; return v ? { value: v } : undefined; } }; }",
  "next/server": "export const NextResponse = { json(b, i){ return new Response(JSON.stringify(b), i); } };",
  "@/lib/firebase/admin-server":
    "export async function hasAnyProjects(){ return globalThis.__hasAnyProjects(); }" +
    "export async function getPasswordRecord(n){ return globalThis.__getPasswordRecord(n); }" +
    "export async function setPasswordRecord(){}" +
    "export async function setTempPasswordRecord(n, t){ globalThis.__temp = { n, t }; }",
};

// Firebase / Blob stubs: every export delegates to globalThis.__fs[name], which a test sets up (see tests/storage.test.mts).
const delegate = (names) => names.map((n) => "export const " + n + " = (...a) => globalThis.__fs[" + JSON.stringify(n) + "](...a);").join(" ");
Object.assign(stubs, {
  "firebase/app": delegate(["initializeApp", "getApps"]),
  "firebase/auth": delegate(["connectAuthEmulator", "getAuth", "signInWithEmailAndPassword"]),
  "firebase/firestore":
    delegate(["collection", "connectFirestoreEmulator", "deleteDoc", "doc", "getDoc", "getDocs", "getFirestore", "limit", "orderBy", "serverTimestamp", "query", "addDoc", "where", "setDoc", "updateDoc", "writeBatch", "runTransaction"]) +
    " export const Timestamp = { fromDate: (d) => d };",
  "@vercel/blob": delegate(["del"]),
});

registerHooks({
  resolve(specifier, context, next) {
    if (stubs[specifier]) return { url: "data:text/javascript," + encodeURIComponent(stubs[specifier]), shortCircuit: true };
    if (specifier.startsWith("@/")) {
      const base = path.join(src, specifier.slice(2));
      for (const f of [base + ".ts", base + ".tsx", path.join(base, "index.ts")]) {
        if (existsSync(f)) return { url: pathToFileURL(f).href, shortCircuit: true };
      }
    }
    return next(specifier, context);
  },
});
