import type { Project } from "@/lib/content/types";

/** What the admin form edits. Slug, order and the derived gallery are managed by the server. */
export type ProjectFields = Omit<Project, "id" | "slug" | "order" | "gallery">;

export interface ProjectsResponse {
  projects: Project[];
  /** "samples" means Firestore is empty and these are the built-in sample projects the site falls back to. */
  source: "database" | "samples";
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message: string;
  read: boolean;
  createdAt: string | null;
}
