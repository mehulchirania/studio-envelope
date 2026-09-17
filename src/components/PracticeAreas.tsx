import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/categories";
import type { Project } from "@/lib/types";
import RevealOnScroll from "./RevealOnScroll";

export default function PracticeAreas({ projects }: { projects: Project[] }) {
  return (
    <section id="practice-areas" className="practice-section page-gutter">
      <RevealOnScroll className="section-heading">
        <div>
          <p className="micro-label">04 / Practice areas</p>
          <h2>
            Where we
            <br />
            work.
          </h2>
        </div>
        <Link href="/contact" className="line-link">
          Discuss your project <ArrowUpRight size={20} />
        </Link>
      </RevealOnScroll>

      <div className="practice-grid">
        {categories.map((category, i) => {
          const count = projects.filter((p) => p.category === category.name).length;
          return (
            <RevealOnScroll key={category.slug} delay={(i % 2) * 0.08}>
              <Link href={`/projects/category/${category.slug}`} className="practice-card">
                <div className="practice-visual">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="practice-numeral" aria-hidden="true">
                      0{i + 1}
                    </span>
                  )}
                </div>
                <div className="practice-body">
                  <div className="practice-head">
                    <h3>{category.name}</h3>
                    <span className="practice-count">
                      {count > 0 ? `${String(count).padStart(2, "0")} published` : "Enquire"}
                    </span>
                  </div>
                  <p className="practice-tagline">{category.tagline}</p>
                  <p className="practice-scope">{category.scope}</p>
                  <span className="practice-cta">
                    View {category.name.toLowerCase()} <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
