export type ProjectCategory = "Residential" | "Commercial" | "Hospitality" | "Art & Installations";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  year: number;
  area?: string; // e.g. "2,400 sq.ft"
  status?: "Completed" | "Ongoing" | "Concept";
  summary: string; // 1–2 sentence card text
  description: string; // long-form, paragraphs separated by \n\n
  coverImage: string; // absolute URL
  gallery: string[]; // absolute URLs
  materials?: string[];
  source?: { url: string; publishedAt: string };
  featured: boolean;
  order: number; // ascending sort
  published: boolean;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message: string;
}

