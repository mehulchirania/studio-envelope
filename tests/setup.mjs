// Test loader: resolves the "@/" alias to src/ and stubs Next/Firebase modules so server code loads under plain Node.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const stubs = {
  "next/headers": "export async function cookies(){ return { get(){ const v = globalThis.__cookie; return v ? { value: v } : undefined; } }; }",
  "next/server": "export const NextResponse = { json(b, i){ return new Response(JSON.stringify(b), i); } };",
  "@/lib/firebase/admin-server":
    "export async function getPasswordRecord(n){ return globalThis.__getPasswordRecord(n); }" +
    "export async function setPasswordRecord(){}",
};

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
