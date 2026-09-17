import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Calendar, Ruler, CircleCheck } from "lucide-react";
import { getProject, getProjects } from "@/lib/data";
import RevealOnScroll from "@/components/RevealOnScroll";
import GalleryLightbox from "@/components/GalleryLightbox";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">
): Promise<Metadata> {
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

  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const metaItems = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Calendar, label: "Year", value: String(project.year) },
    ...(project.area ? [{ icon: Ruler, label: "Area", value: project.area }] : []),
    { icon: CircleCheck, label: "Status", value: project.status },
  ];

  return (
    <>
      <div className="relative h-[65svh] min-h-[420px] w-full overflow-hidden bg-surface">
        <Image
          src={project.coverImage}
          alt={`${project.title} — cover image`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/0" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 sm:pb-16">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow mb-4">{project.category}</p>
            <h1 className="max-w-3xl font-display text-4xl text-fg sm:text-6xl">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
            <RevealOnScroll>
              <dl className="grid grid-cols-2 gap-8 border-t border-hairline pt-8 sm:grid-cols-1 sm:border-t-0 sm:pt-0">
                {metaItems.map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <dt className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted">
                      <Icon size={14} /> {label}
                    </dt>
                    <dd className="font-display text-xl text-fg">{value}</dd>
                  </div>
                ))}
              </dl>

              {project.materials && project.materials.length > 0 && (
                <div className="mt-10">
                  <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">Materials</p>
                  <div className="flex flex-wrap gap-2">
                    {project.materials.map((m) => (
                      <span
                        key={m}
                        className="border border-hairline px-3 py-1.5 text-xs text-fg/85"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="space-y-5">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-base leading-relaxed text-fg/85 sm:text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {project.gallery.length > 0 && (
        <div className="border-t border-hairline px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <RevealOnScroll>
              <p className="eyebrow mb-10">Gallery</p>
            </RevealOnScroll>
            <GalleryLightbox images={project.gallery} alt={project.title} />
          </div>
        </div>
      )}

      {nextProject && (
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group relative block h-[50svh] min-h-[360px] overflow-hidden border-t border-hairline"
        >
          <Image
            src={nextProject.coverImage}
            alt={`${nextProject.title} — cover image`}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-ink/60 transition-colors duration-500 group-hover:bg-ink/70" />
          <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
            <p className="eyebrow mb-4 text-fg">Next project</p>
            <h2 className="font-display text-4xl text-fg sm:text-6xl">{nextProject.title}</h2>
            <span className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-fg/80">
              View project <ArrowUpRight size={16} />
            </span>
          </div>
        </Link>
      )}
    </>
  );
}
