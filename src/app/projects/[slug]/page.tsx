import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ScrollWords from "@/components/motion/ScrollWords";
import { getProject, getProjects } from "@/lib/data";
import ProjectLightboxProvider from "@/components/projects/ProjectLightboxProvider";
import LightboxImage from "@/components/projects/LightboxImage";
import ProjectHero from "@/components/projects/ProjectHero";
import RoomIndex from "@/components/projects/RoomIndex";
import RoomChapter from "@/components/projects/RoomChapter";
import NextProjectBand from "@/components/projects/NextProjectBand";
import { findImageMeta, projectImages, slugifyRoom } from "@/components/projects/roomLayout";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.coverImage }],
      type: "article",
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
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const roomLinks = project.rooms.map((room) => ({ id: slugifyRoom(room.name), name: room.name }));
  const descriptionParagraphs = project.description.split("\n\n");

  return (
    <ProjectLightboxProvider images={lightboxImages}>
      <article>
        <ProjectHero
          title={project.title}
          subtitle={project.subtitle}
          scope={project.scope}
          cover={cover}
          datasheetItems={datasheetItems}
        />

        <div className="band-dark section-y">
          <div className="container-x max-w-[68ch] space-y-6">
            {descriptionParagraphs.map((para, i) => (
              <ScrollWords key={i} text={para} className="font-display text-2xl italic leading-snug sm:text-3xl" />
            ))}
            {hasRenders && <p className="text-sm text-mist">Some images are design visualisations.</p>}
          </div>
        </div>

        <RoomIndex rooms={roomLinks} />

        <div>
          {project.rooms.map((room, i) => (
            <RoomChapter
              key={room.name}
              room={room}
              index={i}
              total={project.rooms.length}
              tone={i % 2 === 0 ? "light" : "dark"}
              indexBySrc={indexBySrc}
            />
          ))}
        </div>

        {project.drawings.length > 0 && (
          <div className="band-bone section-y">
            <div className="container-x">
              <p className="label mb-10 text-muted">Drawings</p>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {project.drawings.map((drawing) => (
                  <div key={drawing.src} className="bg-paper-2 p-3 sm:p-4">
                    <div className="w-full" style={{ aspectRatio: `${drawing.width} / ${drawing.height}` }}>
                      <LightboxImage
                        image={{ ...drawing, kind: "photo" }}
                        index={indexBySrc.get(drawing.src) ?? 0}
                        sizes="(min-width: 1024px) 45vw, 92vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      <NextProjectBand project={nextProject} />
    </ProjectLightboxProvider>
  );
}
