import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatementBand from "@/components/home/StatementBand";
import StatsStrip from "@/components/home/StatsStrip";
import ShowcaseGallery from "@/components/home/ShowcaseGallery";
import ProjectsIndex from "@/components/home/ProjectsIndex";
import ServicesSection from "@/components/home/ServicesSection";
import PrincipalBand from "@/components/home/PrincipalBand";
import InstagramStrip from "@/components/home/InstagramStrip";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/site";
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

function findRoom(project: Project, filename: string): { image: RoomImage; room: string } {
  const image = findImage(project, filename);
  const room = project.rooms.find((r) => r.images.some((img) => img.src.endsWith(filename)));
  return { image, room: room?.name ?? "" };
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

  if (!james) {
    // Seed data always includes James Residence; guards TypeScript below.
    return null;
  }

  const heroFilenames = ["kitchen-dining.jpg", "living.jpg", "master-bedroom-1.jpg", "kids-room.jpg", "tv-dining.jpg"];
  const heroSlides = heroFilenames.map((filename) => findRoom(james, filename));

  const showcaseFilenames = [
    "kitchen-dining.jpg",
    "office-desk.jpg",
    "living.jpg",
    "tv-dining.jpg",
    "crockery-unit.jpg",
    "parents-bedroom.jpg",
    "master-bedroom-1.jpg",
    "master-bath-vanity.jpg",
  ];
  const showcaseRooms = showcaseFilenames.map((filename) => findRoom(james, filename));

  const projectRows = projects.map((project) => {
    const coverRoomImage = project.rooms.flatMap((r) => r.images).find((img) => img.src === project.coverImage);
    return {
      project,
      cover: {
        src: project.coverImage,
        alt: coverRoomImage?.alt ?? project.title,
        width: coverRoomImage?.width ?? 1600,
        height: coverRoomImage?.height ?? 1100,
      },
    };
  });

  return (
    <>
      <Hero slides={heroSlides} />
      <StatementBand />
      <StatsStrip />
      <ShowcaseGallery project={james} datasheet={datasheetFor(james)} rooms={showcaseRooms} />
      <ProjectsIndex rows={projectRows} />
      <ServicesSection />
      <PrincipalBand />
      <InstagramStrip />
    </>
  );
}
