import type { Project, RoomImage } from "@/lib/types";

/** Turns a room name into an anchor id, e.g. "Kids' Washroom" -> "kids-washroom". */
export function slugifyRoom(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Flattens a project's rooms into a single ordered list of images, each
 * carrying its full RoomImage data (unlike `project.gallery`, which is just
 * src strings). Used to build the shared lightbox's image list. */
export function projectImages(project: Project): RoomImage[] {
  return project.rooms.flatMap((room) => room.images);
}

export type RoomChunk =
  | { type: "wide"; image: RoomImage }
  | { type: "pair"; images: [RoomImage, RoomImage] };

/** Lays a room's images out per the brief: one image goes wide; two sit side
 * by side; three or more are paired up, with a trailing odd image wide. */
export function chunkRoomImages(images: RoomImage[]): RoomChunk[] {
  if (images.length === 0) return [];
  if (images.length === 1) return [{ type: "wide", image: images[0] }];
  if (images.length === 2) return [{ type: "pair", images: [images[0], images[1]] }];

  const chunks: RoomChunk[] = [];
  for (let i = 0; i < images.length; i += 2) {
    if (i + 1 < images.length) {
      chunks.push({ type: "pair", images: [images[i], images[i + 1]] });
    } else {
      chunks.push({ type: "wide", image: images[i] });
    }
  }
  return chunks;
}

/** Finds the full RoomImage metadata (alt/width/height/kind) for a given src,
 * e.g. to look up the cover image's real dimensions for the lead image. */
export function findImageMeta(project: Project, src: string): RoomImage | null {
  for (const room of project.rooms) {
    const match = room.images.find((image) => image.src === src);
    if (match) return match;
  }
  return null;
}
