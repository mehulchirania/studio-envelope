import { NextResponse } from "next/server";
import type { ContactMessage } from "@/lib/content/types";
import { site } from "@/lib/content/site";
import { sanitizeContact, validateContact } from "@/lib/contact-validate";

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
];

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email isn't configured." }, { status: 503 });

  let body: ContactMessage;
  try {
    body = (await request.json()) as ContactMessage;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || typeof body.name !== "string" || typeof body.email !== "string" || typeof body.message !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const invalid = validateContact(body);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const msg = sanitizeContact(body);
  const rows = FIELDS.filter(([key]) => msg[key]).map(([key, label]) => [label, msg[key] as string] as const);

  const text = [...rows.map(([l, v]) => `${l}: ${v}`), "", msg.message].join("\n");
  const html =
    `<table>${rows.map(([l, v]) => `<tr><td><b>${l}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>` +
    `<p style="white-space:pre-wrap">${escapeHtml(msg.message)}</p>`;

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
    return NextResponse.json({ error: "Couldn't send email." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
