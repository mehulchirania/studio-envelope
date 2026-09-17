import type { ProjectCategory } from "./types";

/** The studio's practice areas. `image` is only set where verified studio photography exists;
 *  categories without published work show a typographic card and an enquiry link instead. */
export const categories: {
  name: ProjectCategory;
  slug: string;
  tagline: string;
  description: string;
  scope: string;
  image?: string;
}[] = [
  {
    name: "Residential",
    slug: "residential",
    tagline: "Homes that hold a life.",
    description:
      "Apartments and houses designed around daily rituals — pooja corners, kitchens that gather people, bedrooms that slow the morning down. Layered materials, considered light and joinery made to measure.",
    scope: "Apartments / Villas / Renovations / Turnkey interiors",
    image: "/images/instagram/warm-living.jpg",
  },
  {
    name: "Commercial",
    slug: "commercial",
    tagline: "Spaces that work as hard as you do.",
    description:
      "Offices, studios, clinics and retail designed to carry a brand through every surface — planned for how people move, meet and concentrate through the day.",
    scope: "Offices / Studios / Retail / Clinics",
  },
  {
    name: "Hospitality",
    slug: "hospitality",
    tagline: "Rooms that welcome you in.",
    description:
      "Cafés, restaurants and stays where atmosphere does the work. Lighting, texture and flow composed so a guest feels the place before they can name why.",
    scope: "Cafés / Restaurants / Boutique stays",
  },
  {
    name: "Art & Installations",
    slug: "art-and-installations",
    tagline: "One gesture, well placed.",
    description:
      "Site-specific pieces — jaali screens, sculptural partitions and material studies — made in collaboration with craftspeople to give a space its focal moment.",
    scope: "Screens / Sculptural elements / Material studies",
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
