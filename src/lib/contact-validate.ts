// Shared by the browser (src/lib/firebase/contact.ts) and the server (src/app/api/contact/route.ts).
import type { ContactMessage } from "@/lib/content/types";

const LIMITS = {
  name: 100,
  email: 200,
  phone: 30,
  projectType: 60,
  city: 100,
  area: 40,
  budget: 60,
  timeline: 60,
  hearAbout: 60,
  message: 3000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactField = "name" | "phone" | "email" | "message";

/** 10 to 15 digits (Indian mobiles, or a number with a country code); spaces, dashes, brackets and a leading + are fine. */
export function isValidPhone(phone: string): boolean {
  const v = phone.trim();
  if (!/^\+?[\d\s\-()]+$/.test(v) || v.length > LIMITS.phone) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** One field's friendly error, or undefined when it's fine. Shared by the form (live) and validateContact. */
export function fieldError(field: ContactField, raw: string, opts: { messageRequired?: boolean } = {}): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (value.length < 2) return "Please share your name.";
      if (value.length > LIMITS.name) return "Name is too long.";
      return undefined;
    case "phone":
      if (!value) return "Please add a phone number so we can reach you.";
      if (!isValidPhone(value)) return "Enter a valid phone number, e.g. 98765 43210.";
      return undefined;
    case "email":
      if (!value) return "Please enter your email.";
      if (!EMAIL_RE.test(value) || value.length > LIMITS.email) return "Enter a valid email address, e.g. name@example.com.";
      return undefined;
    case "message":
      if (opts.messageRequired && value.length < 10) return "Tell us a little more (10+ characters).";
      if (value.length > 2000) return "Please keep this under 2000 characters.";
      return undefined;
  }
}

export function validateContact(msg: ContactMessage): string | null {
  const name = msg.name?.trim() ?? "";
  const email = msg.email?.trim() ?? "";
  const message = msg.message?.trim() ?? "";

  if (!name) return "Please enter your name.";
  if (name.length > LIMITS.name) return "Name is too long.";
  if (!email) return "Please enter your email.";
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) return "Please enter a valid email address.";
  if (!message) return "Please enter a message.";
  if (message.length > LIMITS.message) return "Message is too long.";
  if (msg.phone && !isValidPhone(msg.phone)) return "Please enter a valid phone number.";
  if (msg.projectType && msg.projectType.trim().length > LIMITS.projectType) return "Project type is too long.";
  if (msg.city && msg.city.trim().length > LIMITS.city) return "City is too long.";
  if (msg.area && msg.area.trim().length > LIMITS.area) return "Area is too long.";
  if (msg.budget && msg.budget.trim().length > LIMITS.budget) return "Budget is too long.";
  if (msg.timeline && msg.timeline.trim().length > LIMITS.timeline) return "Timeline is too long.";
  if (msg.hearAbout && msg.hearAbout.trim().length > LIMITS.hearAbout) return "That field is too long.";
  return null;
}

export function sanitizeContact(msg: ContactMessage): ContactMessage {
  const clean: ContactMessage = {
    name: msg.name.trim(),
    email: msg.email.trim(),
    message: msg.message.trim(),
  };
  const optional = ["phone", "projectType", "city", "area", "budget", "timeline", "hearAbout"] as const;
  for (const key of optional) {
    const value = msg[key]?.trim();
    if (value) clean[key] = value;
  }
  return clean;
}
