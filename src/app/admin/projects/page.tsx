"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { hasAnalytics, type ProjectsResponse } from "@/lib/admin/types";
import { deleteProject, importSamples, listProjects, saveOrder } from "@/lib/admin/client";
import { fmt, projectViews, useAnalytics } from "@/components/admin/dashboard/data";

type Filter = "all" | "live" | "draft";

export default function AdminProjectsPage() {
  const [data, setData] = useState<ProjectsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const analytics = useAnalytics(30);
  const views = hasAnalytics(analytics.data) ? analytics.data : null;

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

  function move(id: string, direction: -1 | 1) {
    if (!data) return;
    const index = data.projects.findIndex((p) => p.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= data.projects.length) return;
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
  const liveCount = projects.filter((p) => p.published).length;
  const draftCount = projects.length - liveCount;
  const query = search.trim().toLowerCase();
  const shown = projects.filter((p) => {
    if (filter === "live" && !p.published) return false;
    if (filter === "draft" && p.published) return false;
    return !query || (p.title ?? "").toLowerCase().includes(query);
  });
  // Reordering only makes sense on the full list, since it saves the order of every project.
  const canReorder = editable && filter === "all" && !query;
  const maxViews = views ? Math.max(1, ...projects.map((p) => projectViews(views.pages, p.slug))) : 1;

  return (
    <>
      <div className="a-ph">
        <div>
          <h1>Projects</h1>
          {data && (
            <p>
              {projects.length} on the website, in this order. Changes go live straight away.
            </p>
          )}
        </div>
        {editable && (
          <div className="a-acts">
            <Link href="/admin/projects/new" className="a-btn pri">
              <Plus size={16} aria-hidden="true" />
              Add project
            </Link>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!data && !error && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted py-16">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {data && !editable && (
        <div className="a-panel a-body space-y-3">
          <p className="text-sm text-ink">
            The website is showing its built-in sample projects, listed below. Save them to the database to edit, reorder or delete them, and to add
            new ones.
          </p>
          <button type="button" onClick={saveSamples} disabled={busy} className="a-btn pri">
            {busy && <Loader2 size={14} className="animate-spin" />}
            Save these projects and start editing
          </button>
        </div>
      )}

      {editable && projects.length > 0 && liveCount === 0 && (
        <p className="a-note text-sm">
          Nothing is published right now, so the website falls back to its built-in sample projects. Publish a project to replace them.
        </p>
      )}

      {data && projects.length > 0 && (
        <section className="a-panel">
          <div className="a-toolbar">
            <label className="flex items-center gap-2 h-8 px-2.5 min-w-[200px] rounded-md border border-ink/25 bg-surface text-muted focus-within:border-teal">
              <Search size={14} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects"
                aria-label="Search projects"
                className="flex-1 min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
            </label>
            <div className="a-seg" role="group" aria-label="Status filter">
              {(
                [
                  ["all", `All (${projects.length})`],
                  ["live", `Live (${liveCount})`],
                  ["draft", `Draft (${draftCount})`],
                ] as [Filter, string][]
              ).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>
                  {label}
                </button>
              ))}
            </div>
            {views && <span className="ml-auto text-[12.5px] text-muted">Page views, last 30 days</span>}
          </div>

          {shown.length === 0 ? (
            <div className="a-empty">
              <b>{filter === "draft" && !query ? "No drafts" : "No projects match"}</b>
              {filter === "draft" && !query ? "Projects you save without publishing show up here, hidden from the website." : "Try a different search or filter."}
            </div>
          ) : (
            <div className="a-tw">
              <table className="a-table">
                <thead>
                  <tr>
                    {canReorder && <th style={{ width: 36 }}>#</th>}
                    <th>Project</th>
                    <th>Status</th>
                    <th>On homepage</th>
                    {views && <th>Page views</th>}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((project) => {
                    const count = views ? projectViews(views.pages, project.slug) : 0;
                    const position = projects.findIndex((p) => p.id === project.id);
                    return (
                      <tr key={project.id}>
                        {canReorder && <td className="text-muted">{position + 1}</td>}
                        <td>
                          <div className="a-pj">
                            {project.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail from Blob or /public
                              <img className="a-thumb" src={project.coverImage} alt="" />
                            ) : (
                              <span className="a-thumb empty" aria-hidden="true" />
                            )}
                            <div className="min-w-0">
                              {editable ? (
                                <Link href={`/admin/projects/${project.id}`} className="font-medium hover:underline">
                                  {project.title || "Untitled"}
                                </Link>
                              ) : (
                                <b>{project.title}</b>
                              )}
                              <span>{[project.scope, project.location, project.year ?? "Ongoing"].filter(Boolean).join(" · ")}</span>
                            </div>
                          </div>
                        </td>
                        <td>{project.published ? <span className="a-pill good">Live</span> : <span className="a-pill mute">Draft</span>}</td>
                        <td>{project.featured ? "Yes" : <span className="text-muted">No</span>}</td>
                        {views && (
                          <td>
                            <div className="a-mini">
                              <div className="tr">
                                <i style={{ width: `${(count / maxViews) * 100}%` }} />
                              </div>
                              <span>{fmt(count)}</span>
                            </div>
                          </td>
                        )}
                        <td className="whitespace-nowrap text-right">
                          {canReorder && (
                            <>
                              <button
                                type="button"
                                className="a-ib"
                                onClick={() => move(project.id, -1)}
                                disabled={busy || position === 0}
                                aria-label={`Move ${project.title} up`}
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                type="button"
                                className="a-ib"
                                onClick={() => move(project.id, 1)}
                                disabled={busy || position === projects.length - 1}
                                aria-label={`Move ${project.title} down`}
                              >
                                <ArrowDown size={16} />
                              </button>
                            </>
                          )}
                          {editable && (
                            <Link href={`/admin/projects/${project.id}`} className="a-ib" aria-label={`Edit ${project.title}`}>
                              <Pencil size={16} />
                            </Link>
                          )}
                          {project.published && (
                            <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="a-ib" aria-label={`View ${project.title} on the website`}>
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {editable && (
                            <button type="button" className="a-ib danger" onClick={() => remove(project)} disabled={busy} aria-label={`Delete ${project.title}`}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {data && editable && projects.length === 0 && <p className="text-sm text-muted py-10 text-center">No projects yet. Add your first one.</p>}
    </>
  );
}
