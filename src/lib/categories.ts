import type { ProjectScope } from "./types";

/** The studio's two scopes of work, replacing the old four-category model. */
export const categories: { name: ProjectScope; slug: string; description: string }[] = [
  {
    name: "Interior",
    slug: "interior",
    description: "Interiors planned and detailed within an existing shell.",
  },
  {
    name: "Architecture & Interior",
    slug: "architecture-and-interior",
    description: "Projects spanning both the built form and the interiors within it.",
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
