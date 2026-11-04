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
  if (msg.phone && msg.phone.trim().length > LIMITS.phone) return "Phone number is too long.";
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
