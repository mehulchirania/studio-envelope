import type { Project } from "@/lib/content/types";
import type { StudioVideo } from "@/lib/content/videos";

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

/** A video as stored in the database: the public shape plus what the admin manages. */
export interface VideoRecord extends StudioVideo {
  id: string;
  order: number;
  published: boolean;
}

/** What the admin video form edits. Order is managed by the server. */
export type VideoFields = Omit<VideoRecord, "id" | "order" | "facts">;
