import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
export default function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return <Link href={`/projects/${project.slug}`} className="project-tile" aria-label={`View ${project.title}`}><div className="project-tile-image"><Image src={project.coverImage} alt={`${project.title} — ${project.category} project in ${project.location}`} fill priority={priority} sizes="(max-width: 700px) 100vw, 55vw" className="object-cover" /><span className="project-pill">{project.category}</span><span className="project-arrow"><ArrowUpRight size={23} /></span></div><div className="project-tile-caption"><h3>{project.title}</h3><p>{project.location}<span>{project.year}</span></p></div></Link>;
}
