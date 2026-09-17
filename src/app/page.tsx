import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/site";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import ServicesAccordion from "@/components/ServicesAccordion";
import StudioJournal from "@/components/StudioJournal";
export const metadata: Metadata = { title: "Home" };
const services = [
  { title: "Architecture", text: "From the first sketch to the final structure, we design homes and places around their surroundings, natural light and the people who use them.", tags: "New builds / Renovations / Spatial planning" },
  { title: "Interior design", text: "A complete interior language, built around your daily rituals. Materials, bespoke joinery, furniture and light come together as one considered whole.", tags: "Residential / Commercial / Hospitality" },
  { title: "Art & installations", text: "Site-specific pieces that give a space its own identity. We explore pattern, craft and material through screens, sculptural elements and installations.", tags: "Sculpture / Screens / Material explorations" },
  { title: "Turnkey & styling", text: "We carry the design through execution, coordinating the details on site and bringing the final layers together for a space that is ready to be lived in.", tags: "Execution / Coordination / Finishing touches" },
];
export default async function Home() {
  const projects = await getProjects();
  const featured = projects.filter(p => p.featured).slice(0, 3);
  const image = site.heroImage ?? projects[0]?.coverImage ?? "";
  const studioImage = "/images/instagram/jaali-dining.jpg";
  return <>
    <Hero image={image} />
    <section id="selected" className="selected-section page-gutter">
      <RevealOnScroll className="section-heading"><div><p className="micro-label">01 / Selected moments</p><h2>A few spaces.<br />Endless possibilities.</h2></div><Link href="/projects" className="line-link">Explore the journal <span>({String(projects.length).padStart(2, "0")})</span><ArrowUpRight size={20} /></Link></RevealOnScroll>
      <div className="selected-grid">{featured.map((project, i) => <RevealOnScroll delay={i * .08} className={i === 0 ? "selected-lead" : "selected-small"} key={project.id}><ProjectCard project={project} /></RevealOnScroll>)}</div>
    </section>
    <section id="studio" className="manifesto-section page-gutter"><div className="manifesto-top"><p className="micro-label">02 / The studio</p><span className="manifesto-star" aria-hidden="true">✳</span></div><div className="manifesto-grid"><RevealOnScroll><h2>Less expected.<br />More <em>you.</em></h2><p className="manifesto-copy">A space should do more than look good.<br />It should feel like it couldn’t belong to anyone else.</p><Link href="/about" className="line-link">Meet Studio Envelope <ArrowUpRight size={20} /></Link></RevealOnScroll><RevealOnScroll delay={.12} className="manifesto-right"><div className="manifesto-photo"><Image src={studioImage} alt="Natural materials and warm textures in a residential interior" fill sizes="(max-width: 700px) 100vw, 35vw" className="object-cover" /></div><p>We’re an independent practice working at the intersection of architecture, interiors and art. Curious by nature. Personal by design.</p><span className="micro-label">Led by {site.principal.name}</span></RevealOnScroll></div></section>
    <section className="services-section page-gutter"><RevealOnScroll className="services-intro"><p className="micro-label">03 / Our practice</p><h2>One vision.<br />Every detail.</h2><p>From the shape of a building to the feel of a handle, we connect the big picture with the smallest moments.</p><Link href="/contact" className="line-link">Find your starting point <ArrowUpRight size={20} /></Link></RevealOnScroll><ServicesAccordion services={services} /></section>
    <StudioJournal />
  </>;
}

