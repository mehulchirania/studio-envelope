import { NextResponse } from "next/server";
import { HttpError, handle, isSameOrigin, readJson } from "@/lib/admin/http";
import { sessionsConfigured } from "@/lib/admin/session";
import { issueTempPassword } from "@/lib/admin/users";
import { site } from "@/lib/content/site";

// "Forgot password": emails a one-hour temporary password to the studio inbox
// (hello@studioenvelope.com by default; ADMIN_RESET_TO_EMAIL overrides). The reply
// is the same whether or not the username exists, so it can't be used to probe logins.
// Needs RESEND_API_KEY, and CONTACT_FROM_EMAIL on a domain verified in Resend.
export const runtime = "nodejs";

// Best-effort per-instance brake; the real one is the 5-minute cooldown stored with the temp password.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  return handle(async () => {
    if (!isSameOrigin(request, { requireOrigin: true })) throw new HttpError(403, "Cross-site request blocked.");
    if (!sessionsConfigured()) throw new HttpError(503, "Admin sign-in isn't configured on the server.");
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (tooMany(ip)) throw new HttpError(429, "Too many requests. Please wait a few minutes and try again.");

    const body = (await readJson(request)) as { username?: unknown };
    const username = typeof body.username === "string" ? body.username : "";

    const apiKey = process.env.RESEND_API_KEY;
    const temp = await issueTempPassword(username);
    if (temp) {
      if (!apiKey) throw new HttpError(503, "Password reset email isn't set up. Please contact the developers.");
      const to = process.env.ADMIN_RESET_TO_EMAIL || site.contact.email;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Studio Envelope Website <onboarding@resend.dev>",
          to: [to],
          subject: "Studio Envelope admin: temporary password",
          text:
            `Someone asked to reset the admin password for "${username.trim().toLowerCase()}".\n\n` +
            `Temporary password: ${temp}\n\n` +
            `It works for 1 hour. Sign in at /admin with it, then choose a new password straight away. ` +
            `The old password keeps working until you do.\n\n` +
            `If nobody asked for this, you can ignore this email.`,
        }),
      }).catch(() => null);
      if (!res?.ok) {
        console.error("[admin forgot] Resend error", res?.status);
        throw new HttpError(502, "Couldn't send the email. Please try again, or contact the developers.");
      }
    }
    return NextResponse.json({ ok: true });
  });
}
