// Browser-side helpers for the admin panel. Everything goes through
// /api/admin/* (cookie-authenticated); the browser never talks to Firebase.
import { upload } from "@vercel/blob/client";
import type { Project } from "@/lib/content/types";
import { slugify } from "@/lib/admin/slug";
import type { AdminMessage, ProjectFields, ProjectsResponse } from "@/lib/admin/types";

export const UNAUTHORIZED_EVENT = "admin:unauthorized";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json", ...init.headers } : init?.headers,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    // A 401 from login itself just means "wrong password"; anywhere else it means the session ended.
    if (response.status === 401 && !path.endsWith("/login")) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

const json = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });

// ---------- Session ----------

export async function getSessionUser(): Promise<string | null> {
  return (await request<{ user: string | null }>("/api/admin/session")).user;
}

export async function login(username: string, password: string): Promise<string> {
  return (await request<{ user: string }>("/api/admin/login", json("POST", { username, password }))).user;
}

export async function logout(): Promise<void> {
  await request("/api/admin/logout", json("POST"));
}

// ---------- Projects ----------

export const listProjects = () => request<ProjectsResponse>("/api/admin/projects");

export async function getProject(id: string): Promise<Project> {
  return (await request<{ project: Project }>(`/api/admin/projects/${encodeURIComponent(id)}`)).project;
}

export async function createProject(fields: ProjectFields): Promise<Project> {
  return (await request<{ project: Project }>("/api/admin/projects", json("POST", fields))).project;
}

export async function updateProject(id: string, fields: ProjectFields): Promise<Project> {
  return (await request<{ project: Project }>(`/api/admin/projects/${encodeURIComponent(id)}`, json("PUT", fields))).project;
}

export async function deleteProject(id: string): Promise<void> {
  await request(`/api/admin/projects/${encodeURIComponent(id)}`, json("DELETE"));
}

export async function saveOrder(ids: string[]): Promise<void> {
  await request("/api/admin/projects/order", json("PUT", { ids }));
}

export async function importSamples(): Promise<void> {
  await request("/api/admin/projects/import", json("POST"));
}

// ---------- Messages ----------

export async function listMessages(): Promise<AdminMessage[]> {
  return (await request<{ messages: AdminMessage[] }>("/api/admin/messages")).messages;
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await request(`/api/admin/messages/${encodeURIComponent(id)}`, json("PATCH", { read }));
}

export async function deleteMessage(id: string): Promise<void> {
  await request(`/api/admin/messages/${encodeURIComponent(id)}`, json("DELETE"));
}

// ---------- Images ----------

export interface UploadedImage {
  src: string;
  width: number;
  height: number;
}

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 1600, height: 1200 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/** Uploads straight from the browser to Vercel Blob (the server only hands out a token to signed-in admins). */
export async function uploadImage(
  folder: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedImage> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const [size, blob] = await Promise.all([
    readImageSize(file),
    upload(`projects/${slugify(folder) || "draft"}/${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      onUploadProgress: ({ percentage }) => onProgress?.(percentage),
    }),
  ]);
  return { src: blob.url, ...size };
}
