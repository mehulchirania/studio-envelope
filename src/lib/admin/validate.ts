// Server-only: turns an untrusted admin form payload into a clean ProjectFields.
import type { Drawing, ProjectScope, Room, RoomImage } from "@/lib/content/types";
import { HttpError } from "@/lib/admin/http";
import type { ProjectFields, VideoFields } from "@/lib/admin/types";
import { parseYouTubeId } from "@/lib/admin/youtube";

export const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** Only our own Blob host or the bundled /images/* seed files, so next/image never meets an unconfigured host. */
function isAllowedImageSrc(src: string): boolean {
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
    const label = name ? `Room "${name}"` : `Room ${index + 1}`;
    const images: RoomImage[] = list(room.images, "photos in a room", 60).map((rawImage) => {
      const parsed = image(rawImage, label);
      const kind = (rawImage as Record<string, unknown>).kind === "render" ? "render" : "photo";
      return { ...parsed, kind };
    });
    if (published && images.length === 0) {
      throw new HttpError(400, `${label} has no photos yet. Add some or remove the room.`);
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

/** Uploaded films live only on our own Blob host. */
function isAllowedVideoSrc(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

export function parseVideoFields(body: unknown): VideoFields {
  if (!body || typeof body !== "object") throw new HttpError(400, "Invalid request.");
  const b = body as Record<string, unknown>;

  const title = text(b.title, "Title", 120);
  if (!title) throw new HttpError(400, "Add a title.");
  const published = b.published === true;

  const fields: VideoFields = { title, published };

  const credits = text(b.credits, "Credits", 300);
  const projectSlug = text(b.projectSlug, "Linked project", 120);
  if (credits) fields.credits = credits;
  if (projectSlug) fields.projectSlug = projectSlug;

  // One source only: a YouTube link wins over an uploaded file.
  const youtube = text(b.youtubeId, "YouTube link", 300);
  const src = text(b.src, "Video file", 600);
  if (youtube) {
    const id = parseYouTubeId(youtube);
    if (!id) throw new HttpError(400, "That doesn't look like a YouTube link. Paste the video's address from YouTube.");
    fields.youtubeId = id;
  } else if (src) {
    if (!isAllowedVideoSrc(src)) throw new HttpError(400, "The video file comes from an unsupported address.");
    fields.src = src;
  }
  if (published && !fields.youtubeId && !fields.src) {
    throw new HttpError(400, "Add a YouTube link or upload a video file before publishing.");
  }

  const poster = text(b.poster, "Cover image", 600);
  if (poster) {
    if (!isAllowedImageSrc(poster)) throw new HttpError(400, "The cover image comes from an unsupported address.");
    fields.poster = poster;
  }
  return fields;
}

/** The `updatedAt` the admin form loaded, sent back on PUT so the server can spot a concurrent edit. */
export function parseExpectedUpdatedAt(body: unknown): string | undefined {
  const value = body && typeof body === "object" ? (body as Record<string, unknown>).expectedUpdatedAt : undefined;
  return typeof value === "string" && value.length <= 40 ? value : undefined;
}
