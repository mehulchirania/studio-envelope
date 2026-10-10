// Server-only: turns an untrusted admin form payload into a clean ProjectFields.
import type { Drawing, ProjectScope, Room, RoomImage } from "@/lib/content/types";
import { HttpError } from "@/lib/admin/http";
import type { ProjectFields } from "@/lib/admin/types";

export const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** Only our own Blob host or the bundled /images/* seed files, so next/image never meets an unconfigured host. */
export function isAllowedImageSrc(src: string): boolean {
  if (src.startsWith("/images/") && !src.includes("..")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

function text(value: unknown, label: string, max: number): string {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") throw new HttpError(400, `${label} must be text.`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new HttpError(400, `${label} is too long (max ${max} characters).`);
  return trimmed;
}

function dimension(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 20000
    ? Math.round(value)
    : fallback;
}

function image(raw: unknown, where: string): { src: string; alt: string; width: number; height: number } {
  if (!raw || typeof raw !== "object") throw new HttpError(400, `${where} has an invalid image.`);
  const record = raw as Record<string, unknown>;
  const src = text(record.src, `${where} image`, 600);
  if (!src || !isAllowedImageSrc(src)) throw new HttpError(400, `${where} has an image from an unsupported address.`);
  return {
    src,
    alt: text(record.alt, `${where} image description`, 300),
    width: dimension(record.width, 1600),
    height: dimension(record.height, 1200),
  };
}

function list(value: unknown, label: string, max: number): unknown[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new HttpError(400, `${label} is invalid.`);
  if (value.length > max) throw new HttpError(400, `Too many ${label} (max ${max}).`);
  return value;
}

export function parseProjectFields(body: unknown): ProjectFields {
  if (!body || typeof body !== "object") throw new HttpError(400, "Invalid request.");
  const b = body as Record<string, unknown>;

  const title = text(b.title, "Title", 120);
  if (!title) throw new HttpError(400, "Add a title.");

  const published = b.published === true;
  const location = text(b.location, "Location", 160);
  const summary = text(b.summary, "Summary", 300);
  const description = text(b.description, "Description", 10000);
  const coverImage = text(b.coverImage, "Cover image", 600);
  if (coverImage && !isAllowedImageSrc(coverImage)) {
    throw new HttpError(400, "The cover image comes from an unsupported address.");
  }

  let year: number | null = null;
  if (b.year !== null && b.year !== undefined && b.year !== "") {
    year = Number(b.year);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) throw new HttpError(400, "Enter a valid year, or leave it blank.");
  }

  const rooms: Room[] = list(b.rooms, "rooms", 40).map((rawRoom, index) => {
    if (!rawRoom || typeof rawRoom !== "object") throw new HttpError(400, "A room is invalid.");
    const room = rawRoom as Record<string, unknown>;
    const name = text(room.name, "Room name", 80);
    if (!name) throw new HttpError(400, `Give room ${index + 1} a name.`);
    const images: RoomImage[] = list(room.images, "photos in a room", 60).map((rawImage) => {
      const parsed = image(rawImage, `Room "${name}"`);
      const kind = (rawImage as Record<string, unknown>).kind === "render" ? "render" : "photo";
      return { ...parsed, kind };
    });
    if (published && images.length === 0) {
      throw new HttpError(400, `Room "${name}" has no photos yet. Add some or remove the room.`);
    }
    return { name, images };
  });

  const drawings: Drawing[] = list(b.drawings, "drawings", 60).map((rawDrawing) => image(rawDrawing, "Drawings"));

  if (published) {
    if (!location) throw new HttpError(400, "Add a location before publishing.");
    if (!summary) throw new HttpError(400, "Add a short summary before publishing.");
    if (!description) throw new HttpError(400, "Add a description before publishing.");
    if (!coverImage) throw new HttpError(400, "Add a cover image before publishing.");
  }

  const scope: ProjectScope = text(b.scope, "Type of work", 60) || "Interior";

  const fields: ProjectFields = {
    title,
    location,
    year,
    status: b.status === "Ongoing" ? "Ongoing" : "Completed",
    scope,
    summary,
    description,
    coverImage,
    rooms,
    drawings,
    featured: b.featured === true,
    published,
  };

  const subtitle = text(b.subtitle, "Subtitle", 160);
  const area = text(b.area, "Area", 40);
  const credit = text(b.credit, "Credit", 160);
  if (subtitle) fields.subtitle = subtitle;
  if (area) fields.area = area;
  if (credit) fields.credit = credit;

  return fields;
}
