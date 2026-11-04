"use client";
// Client-side contact submission. Each message is (1) saved to Firestore
// `messages` (the admin inbox) when Firebase is configured, and (2) emailed to
// the studio through /api/contact. The submission counts as sent if either
// worked, so one outage never loses an enquiry. With neither configured (local
// preview with no env vars) it logs and pretends, so the form still works.
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { ContactMessage } from "@/lib/content/types";
import { getDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { sanitizeContact, validateContact } from "@/lib/contact-validate";

async function saveToInbox(clean: ContactMessage): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const db = getDb();
    if (!db) throw new Error("Firestore unavailable");
    await addDoc(collection(db, "messages"), { ...clean, read: false, createdAt: serverTimestamp() });
    return true;
  } catch (err) {
    console.error("[contact] Failed to save message:", err);
    return false;
  }
}

/** "sent" = emailed, "not-configured" = server has no email provider set up, "failed" = provider error. */
async function sendEmail(clean: ContactMessage): Promise<"sent" | "not-configured" | "failed"> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clean),
    });
    if (res.ok) return "sent";
    return res.status === 503 ? "not-configured" : "failed";
  } catch (err) {
    console.error("[contact] Failed to email message:", err);
    return "failed";
  }
}

export async function submitContact(msg: ContactMessage): Promise<{ ok: boolean; error?: string }> {
  const validationError = validateContact(msg);
  if (validationError) return { ok: false, error: validationError };

  const clean = sanitizeContact(msg);
  const [saved, emailed] = await Promise.all([saveToInbox(clean), sendEmail(clean)]);

  if (saved || emailed === "sent") return { ok: true };

  if (!isFirebaseConfigured && emailed === "not-configured") {
    console.info("[contact] Neither Firebase nor email is configured; message not stored", clean);
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true };
  }

  return { ok: false, error: "Something went wrong sending your message. Please try again or reach out directly." };
}
