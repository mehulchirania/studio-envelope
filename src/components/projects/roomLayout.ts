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

function orientation(image: RoomImage): "landscape" | "portrait" {
  return image.width >= image.height ? "landscape" : "portrait";
}

export type RoomChunk =
  | { type: "single"; image: RoomImage }
  | { type: "pair"; images: [RoomImage, RoomImage] }
  | { type: "mixed"; wide: RoomImage; narrow: RoomImage };

/**
 * Lays a room's images out per the v2 direction: a lone landscape image goes
 * full-bleed; two portraits sit side by side as a pair; a landscape next to
 * a portrait splits 2/3 + 1/3 (landscape wide); two adjacent landscapes each
 * go full-bleed in turn. Greedy left-to-right over the room's image list.
 */
export function layoutRoom(images: RoomImage[]): RoomChunk[] {
  const chunks: RoomChunk[] = [];
  let i = 0;
  while (i < images.length) {
    const a = images[i];
    const b = images[i + 1];
    if (!b) {
      chunks.push({ type: "single", image: a });
      i += 1;
      continue;
    }
    const oa = orientation(a);
    const ob = orientation(b);
    if (oa === "portrait" && ob === "portrait") {
      chunks.push({ type: "pair", images: [a, b] });
      i += 2;
    } else if (oa === "landscape" && ob === "landscape") {
      chunks.push({ type: "single", image: a });
      i += 1;
    } else {
      const wide = oa === "landscape" ? a : b;
      const narrow = oa === "landscape" ? b : a;
      chunks.push({ type: "mixed", wide, narrow });
      i += 2;
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
