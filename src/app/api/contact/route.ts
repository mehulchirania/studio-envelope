import { NextResponse } from "next/server";
import type { ContactMessage } from "@/lib/content/types";
import { site } from "@/lib/content/site";
import { sanitizeContact, validateContact } from "@/lib/contact-validate";
import { privacy } from "@/lib/content/site";
import { createMessage } from "@/lib/firebase/admin-server";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { isSameOrigin } from "@/lib/admin/http";

// Emails each contact-form enquiry to the studio through Resend's REST API.
// Env: RESEND_API_KEY (required), CONTACT_TO_EMAIL (default: site email),
// CONTACT_FROM_EMAIL (default: Resend's shared test sender; set a sender on a
// verified domain, e.g. "Studio Envelope <enquiries@studioenvelope.com>").
export const runtime = "nodejs";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FIELDS: [keyof ContactMessage, string][] = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["projectType", "Project type"],
  ["city", "City"],
  ["area", "Area"],
  ["budget", "Budget"],
  ["timeline", "Timeline"],
  ["hearAbout", "Heard about us via"],
  ["ageDeclaration", "Age declaration"],
];

// Best-effort abuse brake: per-instance, per-IP counter (serverless instances don't share it).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 16 * 1024;
const hits = new Map<string, { count: number; resetAt: number }>();

function tooManyRequests(ip: string): boolean {
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

/** The one door for public enquiries: validates, saves to the inbox (server-side only), and emails the studio. */
export async function POST(request: Request) {
  if (!isSameOrigin(request, { requireOrigin: true })) return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooManyRequests(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ error: "Request too large." }, { status: 413 });

  let body: ContactMessage & { website?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || typeof body.name !== "string" || typeof body.email !== "string" || typeof body.message !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const invalid = validateContact(body);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const msg = sanitizeContact(body);

  let saved = false;
  if (isFirebaseConfigured) {
    try {
      await createMessage(msg, privacy.policyVersion);
      saved = true;
    } catch (err) {
      console.error("[contact] Failed to save message:", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Saved to the inbox is enough; with neither configured (local preview) just accept.
    if (saved || !isFirebaseConfigured) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Couldn't send your message." }, { status: 503 });
  }

  const rows = FIELDS.filter(([key]) => msg[key]).map(([key, label]) => [label, key === "ageDeclaration" ? (msg[key] === "guardian" ? "Parent/guardian writing for someone under 18" : "18 or older") : (msg[key] as string)] as const);

  const text = [...rows.map(([l, v]) => `${l}: ${v}`), "", msg.message].join("\n");
  const html =
    `<table>${rows.map(([l, v]) => `<tr><td><b>${l}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>` +
    `<p style="white-space:pre-wrap">${escapeHtml(msg.message)}</p>`;

  // Not lost if it reached the inbox.
  const emailFailed = () =>
    saved ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Couldn't send email." }, { status: 502 });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Studio Envelope Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || site.contact.email],
        reply_to: msg.email,
        subject: `New enquiry from ${msg.name.replace(/[\r\n]+/g, " ")}`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
      return emailFailed();
    }
  } catch (err) {
    console.error("[contact] Resend request failed:", err);
    return emailFailed();
  }
  return NextResponse.json({ ok: true });
}
