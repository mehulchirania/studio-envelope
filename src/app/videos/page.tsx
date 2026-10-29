import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import PageTransition from "@/components/layout/PageTransition";
import VideoFeature from "@/components/videos/VideoFeature";
import { videos, type VideoFact } from "@/lib/content/videos";
import type { Project } from "@/lib/content/types";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/content/site";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Videos",
  description: "Films of Studio Envelope's architecture and interior design projects in Bangalore.",
  path: "/videos",
});

/** Fact row for a film, taken from the linked project's real data; anything missing is omitted. */
function factsFromProject(project?: Project): VideoFact[] | undefined {
  if (!project) return undefined;
  const facts: VideoFact[] = [];
  if (project.location) facts.push({ label: "Location", value: project.location });
  if (project.scope) facts.push({ label: "Type of work", value: project.scope });
  if (project.area) facts.push({ label: "Area", value: project.area });
  const year = project.year ?? (project.status === "Ongoing" ? "Ongoing" : null);
  if (year) facts.push({ label: "Year", value: String(year) });
  return facts;
}

export default async function VideosPage() {
  const bySlug = new Map<string, Project>();
  if (videos.some((video) => video.projectSlug)) {
    for (const project of await getProjects()) bySlug.set(project.slug, project);
  }

  return (
    <PageTransition>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Videos", url: "/videos" },
        ])}
      />
      <section className="band-dark flex min-h-[48svh] items-end pt-28 sm:min-h-[54svh] sm:pt-40">
        <div className="container-x w-full pb-10 sm:pb-16">
          <h1 className="h1 max-w-4xl text-bone">Videos</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-mist sm:mt-8 sm:text-lg">
            Walk-throughs and films of our completed spaces.
          </p>
        </div>
      </section>

      <section className="band-bone">
        <div className="container-x py-14 sm:py-24">
          {videos.length === 0 ? (
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
              <h2 className="font-display text-[clamp(44px,5.5vw,80px)] font-light leading-none text-ink">Coming soon</h2>
              <div className="max-w-[65ch]">
                <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
                  Our films are on their way. Meanwhile, follow the studio on Instagram.
                </p>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow mt-8 text-base sm:text-lg"
                >
                  {site.socials.instagramHandle}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          ) : (
            <ul className="space-y-20 sm:space-y-32">
              {videos.map((video) => (
                <li key={video.title}>
                  <VideoFeature
                    title={video.title}
                    credits={video.credits}
                    facts={video.facts ?? factsFromProject(video.projectSlug ? bySlug.get(video.projectSlug) : undefined)}
                    youtubeId={video.youtubeId}
                    src={video.src}
                    poster={video.poster}
                    href={video.projectSlug && bySlug.has(video.projectSlug) ? `/projects/${video.projectSlug}` : undefined}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
