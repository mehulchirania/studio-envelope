/**
 * Films shown on /videos, one per row. To add one, push an entry onto `videos`:
 *
 *   {
 *     title: "James Residence",
 *     projectSlug: "james-residence",      // optional: links the film to a project in the portfolio
 *     credits: "Design Team: …",           // optional: one line under the title
 *     // facts: [{ label: "Client", value: "…" }],  // optional: overrides the derived row
 *     youtubeId: "dQw4w9WgXcQ",            // the part after `v=` in a YouTube link, OR
 *     // src: "/videos/james-residence.mp4", // an .mp4 placed in public/videos/
 *     // poster: "/videos/james-residence.jpg", // optional poster frame (YouTube falls back to its thumbnail)
 *   }
 *
 * When `projectSlug` is set and `facts` is not, the fact row is built from that project's
 * real data (Location, Type of work, Area, Year). Only state facts that are true: never
 * invent clients, credits or numbers. The page shows "Coming soon" while the list is empty.
 */
export interface VideoFact {
  label: string;
  value: string;
}

export interface StudioVideo {
  title: string;
  /** Slug of a project in the portfolio; used to derive `facts` when none are given. */
  projectSlug?: string;
  /** e.g. "Design Team: …". Shown as-is under the title. */
  credits?: string;
  facts?: VideoFact[];
  /** Source: a YouTube id or an mp4 path under /videos. */
  youtubeId?: string;
  src?: string;
  poster?: string;
}

export const videos: StudioVideo[] = [];
