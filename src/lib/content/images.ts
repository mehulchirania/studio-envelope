import type { Project, RoomImage } from "./types";

/** Finds a room image in a project by filename (e.g. "living.jpg"), used to
 * pick page heroes from the seed/Firestore data without hard-coding paths. */
export function findImage(project: Project | undefined, filename: string): RoomImage | undefined {
  return project?.rooms.flatMap((room) => room.images).find((image) => image.src.endsWith(filename));
}
