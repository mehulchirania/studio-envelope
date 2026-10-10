import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjects } from "@/lib/data";
import ProjectLightboxProvider from "@/components/projects/ProjectLightboxProvider";
import LightboxImage from "@/components/projects/LightboxImage";
import ProjectHero from "@/components/projects/ProjectHero";
import RoomIndex from "@/components/projects/RoomIndex";
import RoomChapter from "@/components/projects/RoomChapter";
import NextProjectBand from "@/components/projects/NextProjectBand";
import { findImageMeta, projectImages, slugifyRoom } from "@/components/projects/roomLayout";

import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getProjectSchema } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) return {};

  const title = `${project.title} — ${project.scope} in ${project.location}`;
  const description = project.summary || project.description.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${title} — Studio Envelope`,
      description,
      url: `/projects/${project.slug}`,
      images: [
        {
          url: project.coverImage,
          alt: project.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Studio Envelope`,
      description,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectDetailPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const [project, allProjects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const roomImages = projectImages(project);
  const lightboxImages = [...roomImages, ...project.drawings.map((d) => ({ ...d, kind: "photo" as const }))];
  const indexBySrc = new Map(lightboxImages.map((image, i) => [image.src, i]));
  const hasRenders = roomImages.some((image) => image.kind === "render");

  const cover = findImageMeta(project, project.coverImage) ?? {
    src: project.coverImage,
    alt: project.title,
    width: 1600,
    height: 1067,
    kind: "photo" as const,
  };

  const statusValue = project.status === "Ongoing" ? "Ongoing" : `Completed · ${project.year}`;
  const datasheetItems = [
    { label: "Location", value: project.location },
    ...(project.area ? [{ label: "Area", value: project.area }] : []),
    { label: "Scope", value: project.scope },
    { label: "Status", value: statusValue },
    ...(project.credit ? [{ label: "Credit", value: project.credit }] : []),
  ];

  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const otherProjects = allProjects.filter((p) => p.slug !== project.slug);
  const nextCandidate = allProjects[(currentIndex + 1) % allProjects.length];
  const nextProject =
    otherProjects.length > 0
      ? nextCandidate && nextCandidate.slug !== project.slug
        ? nextCandidate
        : otherProjects[0]
      : null;

  const seenRoomIds = new Map<string, number>();
  const roomLinks = project.rooms.map((room) => {
    const base = slugifyRoom(room.name) || "room";
    const count = (seenRoomIds.get(base) ?? 0) + 1;
    seenRoomIds.set(base, count);
    const id = count > 1 ? `${base}-${count}` : base;
    return { id, name: room.name };
  });
  const descriptionParagraphs = project.description.split("\n\n");

  const projectSchema = getProjectSchema(project);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: project.title, url: `/projects/${project.slug}` },
  ]);

  return (
    <PageTransition key={project.slug}>
    <ProjectLightboxProvider images={lightboxImages}>
      <JsonLd schema={projectSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <article>
        <ProjectHero
          title={project.title}
          subtitle={project.subtitle}
          cover={cover}
          datasheetItems={datasheetItems}
        />

        <div className="band-dark section-y">
          <div className="container-x max-w-[68ch] space-y-5 sm:space-y-6">
            {descriptionParagraphs.map((para, i) => (
              <p key={i} className="font-display text-2xl italic leading-snug sm:text-3xl">
                {para}
              </p>
            ))}
            {hasRenders && <p className="text-sm text-mist">Some images are design visualisations.</p>}
          </div>
        </div>

        {project.drawings.length > 0 && (
          <div className="band-bone py-10 sm:py-14">
            <div className="container-x">
              <div className="mx-auto max-w-5xl">
                <h2 className="label mb-6 text-muted sm:mb-8">Drawings</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {project.drawings.map((drawing) => (
                    <div key={drawing.src} className="bg-paper-2 p-3">
                      <div className="w-full" style={{ aspectRatio: `${drawing.width} / ${drawing.height}` }}>
                        <LightboxImage
                          image={{ ...drawing, kind: "photo" }}
                          index={indexBySrc.get(drawing.src) ?? 0}
                          sizes="(min-width: 1024px) 32rem, 92vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <RoomIndex rooms={roomLinks} />

        <div>
          {project.rooms.map((room, i) => (
            <RoomChapter
              key={room.name}
              id={roomLinks[i]?.id}
              room={room}
              // Rooms alternate bands; when drawings (a bone band) come first, start on the dark one.
              tone={(i + (project.drawings.length > 0 ? 1 : 0)) % 2 === 0 ? "light" : "dark"}
              indexBySrc={indexBySrc}
            />
          ))}
        </div>
      </article>

      {nextProject && <NextProjectBand project={nextProject} />}
    </ProjectLightboxProvider>
    </PageTransition>
  );
}
