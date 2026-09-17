"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/types";
import { categories as allCategories } from "@/lib/categories";
import ProjectCard from "./ProjectCard";

const ALL = "All" as const;

export default function ProjectsFilter({ projects }: { projects: Project[] }) {
  // Every practice area is listed, including ones without published work yet, so the
  // range of the practice is visible; empty ones link through to their enquiry page.
  const tabs = useMemo(() => [ALL, ...allCategories.map((c) => c.name)], []);

  const [active, setActive] = useState<ProjectCategory | typeof ALL>(ALL);

  const filtered = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [active, projects]
  );

  return (
    <div>
      <div
        className="mb-12 flex flex-wrap gap-x-8 gap-y-3 border-b border-hairline pb-6"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {tabs.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`eyebrow relative pb-1 transition-colors ${
              active === cat ? "text-fg" : "text-muted hover:text-fg/80"
            }`}
          >
            {cat}
            {active === cat && (
              <motion.span
                layoutId="active-category"
                className="absolute inset-x-0 -bottom-[25px] h-[1.5px] bg-brass"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>

      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} priority={i < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && active !== ALL && (
        <div className="py-16 text-center">
          <p className="text-muted">
            No {active.toLowerCase()} work is published here yet — it&rsquo;s on its way.
          </p>
          <Link
            href={`/projects/category/${allCategories.find((c) => c.name === active)?.slug ?? ""}`}
            className="line-link mt-6 inline-flex"
          >
            About our {active.toLowerCase()} work <ArrowUpRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
