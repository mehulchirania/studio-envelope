import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";

import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const buildDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
    const projectImages = [
      project.coverImage,
      ...project.rooms.flatMap((r) => r.images.map((img) => img.src)),
    ]
      .filter(Boolean)
      .map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`));

    return {
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.8,
      images: Array.from(new Set(projectImages)),
    };
  });

  return [...staticRoutes, ...projectRoutes];
}
