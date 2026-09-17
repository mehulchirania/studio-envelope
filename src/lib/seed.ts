import type { Project } from "./types";
import { instagramPosts } from "./instagram";

// Verified public imagery replaces the previous fictional sample portfolio.
// Each entry is a visual journal item, not a claimed separate commission.
export const seedProjects: Project[] = instagramPosts.map((post, i) => ({
  id: `instagram-${post.slug}`,
  slug: post.slug,
  title: post.title,
  category: "Residential",
  location: "",
  year: Number(post.date.slice(0, 4)),
  summary: post.description,
  description: post.description,
  coverImage: post.image,
  gallery: [post.image],
  featured: [0, 3, 5].includes(i),
  order: i,
  published: true,
  source: { url: post.url, publishedAt: post.date },
}));
