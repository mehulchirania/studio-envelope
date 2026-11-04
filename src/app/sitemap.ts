import type { MetadataRoute } from "next";
import { getProjects, getVideos } from "@/lib/data";

import { SITE_URL } from "@/lib/seo";

/** No `lastModified`, `changeFrequency` or `priority`: the content has no real modified dates, and a build
 * timestamp on every URL tells crawlers nothing. Google ignores the other two fields. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, videos] = await Promise.all([getProjects(), getVideos()]);

  // /videos is noindex until the first film is published, so it stays out of the sitemap too.
  const paths = ["", "/projects", ...(videos.length > 0 ? ["/videos"] : []), "/services", "/about", "/contact", "/privacy", "/terms"];
  const staticRoutes: MetadataRoute.Sitemap = paths.map((path) => ({ url: `${SITE_URL}${path}` }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
    const projectImages = [
      project.coverImage,
      ...project.rooms.flatMap((r) => r.images.map((img) => img.src)),
    ]
      .filter(Boolean)
      .map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`));

    return {
      url: `${SITE_URL}/projects/${project.slug}`,
      images: Array.from(new Set(projectImages)),
    };
  });

  return [...staticRoutes, ...projectRoutes];
}
