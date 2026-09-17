"use client";
// Client-side contact submission. Writes to Firestore `messages` when
// Firebase is configured; otherwise logs locally so the form still "works"
// during local preview without any env vars set.
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { ContactMessage } from "./types";
import { getDb, isFirebaseConfigured } from "./firebase";

const LIMITS = {
  name: 100,
  email: 200,
  phone: 30,
  projectType: 60,
  budget: 60,
  message: 3000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(msg: ContactMessage): string | null {
  const name = msg.name?.trim() ?? "";
  const email = msg.email?.trim() ?? "";
  const message = msg.message?.trim() ?? "";

  if (!name) return "Please enter your name.";
  if (name.length > LIMITS.name) return "Name is too long.";
  if (!email) return "Please enter your email.";
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) return "Please enter a valid email address.";
  if (!message) return "Please enter a message.";
  if (message.length > LIMITS.message) return "Message is too long.";
  if (msg.phone && msg.phone.trim().length > LIMITS.phone) return "Phone number is too long.";
  if (msg.projectType && msg.projectType.trim().length > LIMITS.projectType) return "Project type is too long.";
  if (msg.budget && msg.budget.trim().length > LIMITS.budget) return "Budget is too long.";
  return null;
}

function sanitize(msg: ContactMessage): ContactMessage {
  const clean: ContactMessage = {
    name: msg.name.trim(),
    email: msg.email.trim(),
    message: msg.message.trim(),
  };
  const phone = msg.phone?.trim();
  const projectType = msg.projectType?.trim();
  const budget = msg.budget?.trim();
  if (phone) clean.phone = phone;
  if (projectType) clean.projectType = projectType;
  if (budget) clean.budget = budget;
  return clean;
}

export async function submitContact(msg: ContactMessage): Promise<{ ok: boolean; error?: string }> {
  const validationError = validate(msg);
  if (validationError) return { ok: false, error: validationError };

  const clean = sanitize(msg);

  if (!isFirebaseConfigured) {
    console.info("[contact] Firebase not configured; message not stored", clean);
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true };
  }

  try {
    const db = getDb();
    if (!db) throw new Error("Firestore unavailable");
    await addDoc(collection(db, "messages"), {
      ...clean,
      read: false,
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (err) {
    console.error("[contact] Failed to submit message:", err);
    return { ok: false, error: "Something went wrong sending your message. Please try again or reach out directly." };
  }
}
