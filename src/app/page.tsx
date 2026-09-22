import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";
import Seal from "@/components/Seal";
import SectionHeader from "@/components/SectionHeader";
import Datasheet from "@/components/Datasheet";
import ProjectImage from "@/components/ProjectImage";
import RevealOnScroll from "@/components/RevealOnScroll";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import InstagramStrip from "@/components/home/InstagramStrip";
import { getProjects } from "@/lib/data";
import { site, services } from "@/lib/site";
import type { Project, RoomImage } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "Studio Envelope — Architecture & Interior Design, Bangalore" },
  description: site.description,
};

/** Finds a room image by matching the end of its filename, e.g. "kitchen-dining.jpg". */
function findImage(project: Project, filename: string): RoomImage {
  const image = project.rooms
    .flatMap((room) => room.images.map((img) => ({ ...img, room: room.name })))
    .find((img) => img.src.endsWith(filename));
  if (!image) throw new Error(`Home page: expected image "${filename}" on ${project.slug}`);
  return image;
}

function datasheetFor(project: Project) {
  return [
    { label: "Location", value: project.location },
    { label: "Area", value: project.area ?? "—" },
    { label: "Scope", value: project.scope },
    { label: "Year", value: project.status === "Ongoing" ? "Ongoing" : String(project.year ?? "—") },
  ];
}

export default async function Home() {
  const projects = await getProjects();
  const james = projects.find((p) => p.slug === "james-residence");
  const others = projects.filter((p) => p.slug !== "james-residence");

  if (!james) {
    // Seed data always includes James Residence; guards TypeScript below.
    return null;
  }

  const slideFilenames = ["kitchen-dining.jpg", "kids-room.jpg", "living.jpg", "tv-dining.jpg", "office-desk.jpg"];
  const slides = slideFilenames.map((filename) => {
    const room = james.rooms.find((r) => r.images.some((img) => img.src.endsWith(filename)));
    const image = findImage(james, filename);
    return { image, room: room?.name ?? "" };
  });

  const featuredHero = findImage(james, "kitchen-dining.jpg");
  const featuredRow = [
    findImage(james, "kitchen-island.jpg"),
    findImage(james, "parents-bedroom.jpg"),
    findImage(james, "master-bath-vanity.jpg"),
  ];

  return (
    <>
      {/* 1. Opening */}
      <section className="section-y">
        <div className="container-x flex flex-col items-center text-center">
          <RevealOnScroll>
            <Logo variant="teal" showWordmark className="flex-col items-center gap-4 [&_svg]:h-[70px] [&_svg]:w-[70px] [&_span]:items-center [&_span]:text-center [&_span]:text-2xl" />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="label mt-6">Architecture &amp; Interiors · Bangalore</p>
          </RevealOnScroll>
        </div>

        <div className="container-x mt-14">
          <RevealOnScroll delay={0.15}>
            <HeroSlideshow slides={slides} />
          </RevealOnScroll>
        </div>
      </section>

      {/* 2. Statement */}
      <section className="section-y border-t border-hairline">
        <div className="container-x">
          <RevealOnScroll>
            <Seal />
            <p className="display-xl mt-8 max-w-[16ch] text-ink">
              Spaces that feel like <em className="font-normal italic">heartfelt messages</em> — crafted with
              care.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="mt-10 max-w-xl">
              <p className="text-base leading-relaxed text-muted">
                The name &ldquo;Studio Envelope&rdquo; evokes warmth, authenticity, and intentionality. We
                create cohesive spaces with innovative design solutions that blend creativity, precision, and
                purpose — wrapped with love and passion, reflecting your unique personality and needs.
              </p>
              <Link href="/about" className="link-arrow mt-8">
                Our story <ArrowUpRight size={16} />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 3. Featured project */}
      <section className="section-y border-t border-hairline">
        <div className="container-x">
          <RevealOnScroll>
            <SectionHeader label="Featured project" heading={james.title} />
          </RevealOnScroll>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <RevealOnScroll className="lg:col-span-7">
              <ProjectImage
                image={featuredHero}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-[4/3] w-full"
              />
            </RevealOnScroll>

            <RevealOnScroll delay={0.1} className="lg:col-span-5">
              <p className="label">{james.location}</p>
              <h3 className="h2 mt-4 text-ink">{james.subtitle}</h3>
              <Datasheet items={datasheetFor(james)} className="mt-8" />
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted">{james.summary}</p>
              <Link href={`/projects/${james.slug}`} className="link-arrow mt-8">
                View project <ArrowUpRight size={16} />
              </Link>
            </RevealOnScroll>
          </div>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end">
            <RevealOnScroll className="w-full sm:w-[38%]">
              <ProjectImage image={featuredRow[0]} sizes="(max-width: 640px) 100vw, 38vw" className="aspect-[3/4] w-full" />
            </RevealOnScroll>
            <RevealOnScroll delay={0.08} className="w-full sm:w-[30%] sm:translate-y-8">
              <ProjectImage image={featuredRow[1]} sizes="(max-width: 640px) 100vw, 30vw" className="aspect-[3/4] w-full" />
            </RevealOnScroll>
            <RevealOnScroll delay={0.16} className="w-full sm:w-[26%]">
              <ProjectImage image={featuredRow[2]} sizes="(max-width: 640px) 100vw, 26vw" className="aspect-[3/4] w-full" />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 4. More projects */}
      <section className="section-y border-t border-hairline">
        <div className="container-x">
          <RevealOnScroll>
            <SectionHeader label="Projects" heading="Selected work" action={{ href: "/projects", label: "All projects" }} />
          </RevealOnScroll>

          <div className="mt-14 flex flex-col gap-20">
            {others.map((project, i) => {
              const reversed = i % 2 === 1;
              const coverImage = project.rooms[0]?.images[0];
              return (
                <div key={project.id} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  <RevealOnScroll className={reversed ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                    <ProjectImage
                      image={{
                        src: project.coverImage,
                        alt: coverImage?.alt ?? project.title,
                        width: coverImage?.width ?? 1600,
                        height: coverImage?.height ?? 1100,
                        kind: coverImage?.kind,
                      }}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="aspect-[4/3] w-full"
                    />
                  </RevealOnScroll>

                  <RevealOnScroll delay={0.1} className={`flex flex-col justify-center lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
                    <p className="label">{project.location}</p>
                    <h3 className="h2 mt-4 text-ink">{project.title}</h3>
                    <Datasheet items={datasheetFor(project)} className="mt-8" />
                    <p className="mt-8 max-w-md text-base leading-relaxed text-muted">{project.summary}</p>
                    <Link href={`/projects/${project.slug}`} className="link-arrow mt-8">
                      View project <ArrowUpRight size={16} />
                    </Link>
                  </RevealOnScroll>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Services teaser */}
      <section className="section-y border-t border-hairline">
        <div className="container-x">
          <RevealOnScroll>
            <SectionHeader label="What is included" heading="From first sketch to final styling." />
          </RevealOnScroll>

          <div className="mt-14 grid gap-12 sm:grid-cols-3">
            {[
              { title: "Design", items: services.design },
              { title: "Furnish & Style", items: services.furnishAndStyle },
              { title: "Deliver", items: services.deliver },
            ].map((group, i) => (
              <RevealOnScroll key={group.title} delay={i * 0.08}>
                <p className="label border-b border-hairline pb-4">{group.title}</p>
                <ul className="mt-4 flex flex-col">
                  {group.items.map((item) => (
                    <li key={item} className="border-b border-hairline py-4 font-display text-xl text-ink last:border-b-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.1}>
            <Link href="/services" className="link-arrow mt-14">
              Our services <ArrowUpRight size={16} />
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* 6. Principal */}
      <section className="section-y bg-paper-2">
        <div className="container-x">
          <RevealOnScroll>
            <Seal />
            <p className="label mt-6">Principal Architect</p>
            <h2 className="h1 mt-4 max-w-2xl text-ink">{site.principal.name}</h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
              {site.principal.name} leads the Bangalore studio. Her work spans residential interiors and
              architecture across Bangalore, Ballari and Pune.
            </p>
            <Link href="/about" className="link-arrow mt-8">
              About the studio <ArrowUpRight size={16} />
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* 7. Instagram strip */}
      <section className="section-y border-t border-hairline">
        <div className="container-x">
          <RevealOnScroll>
            <InstagramStrip />
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
