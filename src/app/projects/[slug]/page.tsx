import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Datasheet from "@/components/Datasheet";
import { getProject, getProjects } from "@/lib/data";
import ProjectLightboxProvider from "@/components/projects/ProjectLightboxProvider";
import LightboxImage from "@/components/projects/LightboxImage";
import RoomIndex from "@/components/projects/RoomIndex";
import NextProjectBand from "@/components/projects/NextProjectBand";
import { chunkRoomImages, findImageMeta, projectImages, slugifyRoom } from "@/components/projects/roomLayout";

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

  return (
    <ProjectLightboxProvider images={lightboxImages}>
      <article>
        <div className="container-x py-20 sm:py-28">
          <p className="label mb-6">{project.scope}</p>
          <h1 className="display-xl max-w-4xl text-ink">{project.title}</h1>
          {project.subtitle && (
            <p className="mt-6 max-w-2xl font-display text-2xl italic text-muted sm:text-3xl">{project.subtitle}</p>
          )}
          <Datasheet items={datasheetItems} className="mt-12" />
        </div>

        <div className="container-x">
          <div
            className="relative mx-auto w-full overflow-hidden bg-paper-2"
            style={{ maxHeight: "80vh", aspectRatio: `${cover.width} / ${cover.height}` }}
          >
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 1440px) 1296px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="container-x py-16 sm:py-24">
          <div className="max-w-[62ch] space-y-6 text-[17px] leading-[1.75] text-ink sm:text-[18px]">
            {project.description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {hasRenders && (
            <p className="mt-6 max-w-[62ch] text-sm text-muted">Some images are design visualisations.</p>
          )}
        </div>

        <div className="container-x grid gap-12 pb-4 lg:grid-cols-[220px_1fr] lg:gap-16">
          <RoomIndex rooms={roomLinks} />

          <div className="space-y-24 sm:space-y-32">
            {project.rooms.map((room, i) => {
              const chunks = chunkRoomImages(room.images);
              return (
                <section key={room.name} id={slugifyRoom(room.name)} className="scroll-mt-28">
                  <p className="label mb-3">
                    Room {String(i + 1).padStart(2, "0")} / {String(project.rooms.length).padStart(2, "0")}
                  </p>
                  <h2 className="font-display text-3xl italic text-ink sm:text-4xl">{room.name}</h2>
                  <div className="mt-8 space-y-4 sm:space-y-6">
                    {chunks.map((chunk, ci) =>
                      chunk.type === "wide" ? (
                        <div
                          key={ci}
                          className="w-full"
                          style={{ aspectRatio: `${chunk.image.width} / ${chunk.image.height}` }}
                        >
                          <LightboxImage
                            image={chunk.image}
                            index={indexBySrc.get(chunk.image.src) ?? 0}
                            sizes="(min-width: 1024px) 70vw, 92vw"
                          />
                        </div>
                      ) : (
                        <div key={ci} className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-6">
                          {chunk.images.map((image) => (
                            <div
                              key={image.src}
                              className="w-full"
                              style={{ aspectRatio: `${image.width} / ${image.height}` }}
                            >
                              <LightboxImage
                                image={image}
                                index={indexBySrc.get(image.src) ?? 0}
                                sizes="(min-width: 1024px) 35vw, 92vw"
                              />
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {project.drawings.length > 0 && (
          <div className="container-x py-24 sm:py-32">
            <p className="label mb-10">Drawings</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {project.drawings.map((drawing) => (
                <div key={drawing.src} className="bg-paper-2 p-4 sm:p-6">
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
        )}
      </article>

      <NextProjectBand project={nextProject} />
    </ProjectLightboxProvider>
  );
}
