"use client";
// Client-side contact submission. Everything goes through /api/contact, which
// validates the enquiry (consent and age declaration included), saves it to the
// private inbox and emails the studio. The browser never writes to Firestore.
import type { ContactMessage } from "@/lib/content/types";
import { validateContact } from "@/lib/contact-validate";

export async function submitContact(msg: ContactMessage & { website?: string }): Promise<{ ok: boolean; error?: string }> {
  const validationError = validateContact(msg);
  if (validationError) return { ok: false, error: validationError };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? "Something went wrong sending your message. Please try again or reach out directly." };
  } catch (err) {
    console.error("[contact] Failed to send message:", err);
    return { ok: false, error: "Something went wrong sending your message. Please try again or reach out directly." };
  }
}
