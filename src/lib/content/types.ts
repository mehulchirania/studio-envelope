export type ProjectScope = "Interior" | "Architecture & Interior";

export type ProjectImageKind = "photo" | "render";

export interface RoomImage {
  src: string; // absolute path under /public
  kind: ProjectImageKind;
  alt: string; // concrete description, e.g. "Kitchen with blue-grey cabinetry..."
  width: number; // real pixel width of the source file
  height: number; // real pixel height of the source file
}

export interface Room {
  name: string;
  images: RoomImage[];
}

export interface Drawing {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string; // short factual descriptor, e.g. "A three-bedroom home for three generations"
  location: string;
  year: number | null; // null for ongoing projects without a completion year
  area?: string; // e.g. "1,600 sq ft"
  status: "Completed" | "Ongoing";
  scope: ProjectScope;
  summary: string; // one short sentence, used on cards
  description: string; // long-form, paragraphs separated by \n\n
  credit?: string; // e.g. "In association with Cadence Architects"
  coverImage: string; // absolute path under /public
  rooms: Room[]; // room-by-room chapters, in display order
  drawings: Drawing[];
  /** Derived flat list of every room image src, in room order — computed in
   * the data layer for back-compat with code that just needs a gallery. */
  gallery: string[];
  featured: boolean;
  order: number; // ascending sort
  published: boolean;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  city?: string;
  area?: string;
  budget?: string;
  timeline?: string;
  hearAbout?: string;
  message: string;
}
