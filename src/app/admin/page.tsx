"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { Project } from "@/lib/content/types";
import type { ProjectsResponse } from "@/lib/admin/types";
import { deleteProject, importSamples, listProjects, saveOrder } from "@/lib/admin/client";

const iconButton =
  "p-2.5 rounded-full text-[#EDE8E0]/50 hover:text-[#EDE8E0] hover:bg-[#EDE8E0]/10 transition-colors disabled:opacity-25 disabled:pointer-events-none";

export default function AdminProjectsPage() {
  const [data, setData] = useState<ProjectsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await listProjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load projects.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void load();
  }, [load]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    if (!data) return;
    const target = index + direction;
    if (target < 0 || target >= data.projects.length) return;
    const projects = [...data.projects];
    [projects[index], projects[target]] = [projects[target], projects[index]];
    setData({ ...data, projects });
    void run(async () => {
      try {
        await saveOrder(projects.map((p) => p.id));
      } catch (err) {
        await load();
        throw err;
      }
    });
  }

  function remove(project: Project) {
    if (!window.confirm(`Delete "${project.title}"? It disappears from the website straight away and can't be undone.`)) return;
    void run(async () => {
      await deleteProject(project.id);
      await load();
    });
  }

  function saveSamples() {
    void run(async () => {
      await importSamples();
      await load();
    });
  }

  const projects = data?.projects ?? [];
  const editable = data?.source === "database";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-light">Projects</h1>
          {data && (
            <p className="text-sm text-[#EDE8E0]/45 mt-1">
              {projects.length} on the website, in this order. Changes go live straight away.
            </p>
          )}
        </div>
        {editable && (
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors shrink-0"
          >
            <Plus size={16} />
            Add project
          </Link>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!data && !error && (
        <div className="flex items-center justify-center gap-2 text-sm text-[#EDE8E0]/50 py-16">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {data && !editable && (
        <div className="rounded-2xl border border-[#5E9AA3]/30 bg-[#5E9AA3]/5 p-5 space-y-3">
          <p className="text-sm text-[#EDE8E0]/80">
            The website is showing its built-in sample projects, listed below. Save them to the database to edit,
            reorder or delete them, and to add new ones.
          </p>
          <button
            type="button"
            onClick={saveSamples}
            disabled={busy}
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors disabled:opacity-60"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            Save these projects and start editing
          </button>
        </div>
      )}

      {editable && projects.length > 0 && !projects.some((p) => p.published) && (
        <p className="text-sm text-[#EDE8E0]/70 rounded-2xl border border-[#EDE8E0]/15 px-5 py-4">
          Nothing is published right now, so the website falls back to its built-in sample projects. Publish a project
          to replace them.
        </p>
      )}

      {data && projects.length > 0 && (
        <ol className="rounded-2xl border border-[#EDE8E0]/10 divide-y divide-[#EDE8E0]/10 overflow-hidden">
          {projects.map((project, index) => (
            <li key={project.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 sm:px-4 py-3">
              <span className="w-6 text-center text-sm text-[#EDE8E0]/35 tabular-nums">{index + 1}</span>

              {project.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.coverImage} alt="" className="w-16 h-12 rounded-md object-cover border border-[#EDE8E0]/10 bg-black/30" />
              ) : (
                <span className="w-16 h-12 rounded-md border border-dashed border-[#EDE8E0]/15" aria-hidden />
              )}

              <div className="min-w-0 flex-1 basis-48">
                {editable ? (
                  <Link href={`/admin/projects/${project.id}`} className="block truncate text-[15px] hover:text-[#5E9AA3] transition-colors">
                    {project.title || "Untitled"}
                  </Link>
                ) : (
                  <p className="truncate text-[15px]">{project.title}</p>
                )}
                <p className="text-xs text-[#EDE8E0]/40 truncate mt-0.5">
                  {[project.scope, project.location, project.year ?? "Ongoing"].filter(Boolean).join(" · ")}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`px-2.5 py-1 rounded-full border ${
                    project.published ? "border-[#5E9AA3]/50 text-[#5E9AA3]" : "border-[#EDE8E0]/15 text-[#EDE8E0]/45"
                  }`}
                >
                  {project.published ? "Live" : "Draft"}
                </span>
                {project.featured && <span className="px-2.5 py-1 rounded-full border border-[#EDE8E0]/15 text-[#EDE8E0]/55">Homepage</span>}
              </div>

              <div className="flex items-center">
                {editable && (
                  <>
                    <button
                      type="button"
                      className={iconButton}
                      onClick={() => move(index, -1)}
                      disabled={busy || index === 0}
                      aria-label={`Move ${project.title} up`}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      className={iconButton}
                      onClick={() => move(index, 1)}
                      disabled={busy || index === projects.length - 1}
                      aria-label={`Move ${project.title} down`}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <Link href={`/admin/projects/${project.id}`} className={iconButton} aria-label={`Edit ${project.title}`}>
                      <Pencil size={16} />
                    </Link>
                  </>
                )}
                {project.published && (
                  <a
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className={iconButton}
                    aria-label={`View ${project.title} on the website`}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                {editable && (
                  <button
                    type="button"
                    className={`${iconButton} hover:!text-red-400`}
                    onClick={() => remove(project)}
                    disabled={busy}
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {data && editable && projects.length === 0 && (
        <p className="text-sm text-[#EDE8E0]/50 py-10 text-center">No projects yet. Add your first one.</p>
      )}
    </div>
  );
}
