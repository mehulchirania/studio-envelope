import type { MetadataRoute } from "next";
import { site } from "@/lib/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Studio Envelope — Architecture & Interior Design",
    short_name: "Studio Envelope",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#26211c",
    theme_color: "#26211c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
