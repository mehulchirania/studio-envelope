import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/data";
import { categories, categoryBySlug } from "@/lib/categories";
import ProjectCard from "@/components/ProjectCard";
import PageHero from "@/components/PageHero";
import RevealOnScroll from "@/components/RevealOnScroll";

export const revalidate = 60;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const match = categoryBySlug(category);
  if (!match) return { title: "Work" };
  return {
    title: `${match.name} projects`,
    description: match.description,
  };
}

export default async function CategoryPage({ params }: PageProps<"/projects/category/[category]">) {
  const { category } = await params;
  const match = categoryBySlug(category);
  if (!match) notFound();

  const projects = (await getProjects()).filter((p) => p.category === match.name);

  return (
    <>
      <PageHero eyebrow={`${match.name} / Practice area`} title={match.tagline}>
        {match.description}
      </PageHero>

      <section className="category-page page-gutter">
        <RevealOnScroll className="category-meta">
          <p className="micro-label">What it covers</p>
          <p>{match.scope}</p>
        </RevealOnScroll>

        {projects.length > 0 ? (
          <div className="category-grid">
            {projects.map((project, i) => (
              <RevealOnScroll key={project.id} delay={(i % 3) * 0.08}>
                <ProjectCard project={project} priority={i < 3} />
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <RevealOnScroll className="category-empty">
            <h2>
              {match.name} work isn&rsquo;t published here yet.
            </h2>
            <p>
              We&rsquo;re preparing this part of the portfolio. If you have a {match.name.toLowerCase()} project in mind,
              we&rsquo;d love to hear about it — early conversations are the best ones.
            </p>
            <Link href="/contact" className="line-link">
              Start a conversation <ArrowUpRight size={20} />
            </Link>
          </RevealOnScroll>
        )}

        <nav className="category-switch" aria-label="Other practice areas">
          <p className="micro-label">Other practice areas</p>
          <div>
            {categories
              .filter((c) => c.slug !== match.slug)
              .map((c) => (
                <Link key={c.slug} href={`/projects/category/${c.slug}`} className="line-link">
                  {c.name} <ArrowUpRight size={18} />
                </Link>
              ))}
          </div>
        </nav>
      </section>
    </>
  );
}
