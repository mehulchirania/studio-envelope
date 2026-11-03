import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjects } from "@/lib/data";
import ProjectLightboxProvider from "@/components/projects/ProjectLightboxProvider";
import ProjectHero from "@/components/projects/ProjectHero";
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

  const title = `${project.title}, ${project.scope}${project.location ? ` in ${project.location}` : ""}`;
  const description = project.summary || project.description.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${title} | Studio Envelope`,
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
      title: `${title} | Studio Envelope`,
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
  const lightboxImages = roomImages;
  const indexBySrc = new Map(lightboxImages.map((image, i) => [image.src, i]));
  const hasRenders = roomImages.some((image) => image.kind === "render");

  const cover = findImageMeta(project, project.coverImage) ?? {
    src: project.coverImage,
    alt: project.title,
    width: 1600,
    height: 1067,
    kind: "photo" as const,
  };

  const datasheetItems = [
    ...(project.location ? [{ label: "Location", value: project.location }] : []),
    ...(project.area ? [{ label: "Area", value: project.area }] : []),
    { label: "Scope", value: project.scope },
    ...(project.year ? [{ label: "Year", value: String(project.year) }] : []),
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

        {hasRenders && (
          <div className="band-dark py-6">
            <div className="container-x">
              <p className="text-sm text-mist">Some images are design visualisations.</p>
            </div>
          </div>
        )}

        <div>
          {project.rooms.map((room, i) => (
            <RoomChapter
              key={i}
              id={roomLinks[i]?.id}
              room={room}
              tone={i % 2 === 0 ? "light" : "dark"}
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
