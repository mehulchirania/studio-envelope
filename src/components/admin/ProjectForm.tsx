"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { Drawing, Project, ProjectScope } from "@/lib/content/types";
import type { ProjectFields } from "@/lib/admin/types";
import { createProject, deleteProject, updateProject } from "@/lib/admin/client";
import { slugify } from "@/lib/admin/slug";
import { CoverUploader, PhotoGrid } from "@/components/admin/PhotoUploader";
import RoomsEditor from "@/components/admin/RoomsEditor";
import FormSection from "@/components/admin/FormSection";
import Toggle from "@/components/admin/Toggle";

const inputClass =
  "w-full bg-[#EDE8E0]/[0.04] border border-[#EDE8E0]/15 rounded-lg px-3.5 py-2.5 text-[15px] text-[#EDE8E0] placeholder:text-[#EDE8E0]/30 focus:outline-none focus:border-[#5E9AA3]/60 transition-colors";
const labelClass = "block text-xs uppercase tracking-wider text-[#EDE8E0]/50 mb-1.5";

function emptyFields(): ProjectFields {
  return {
    title: "",
    location: "",
    year: new Date().getFullYear(),
    status: "Completed",
    scope: "Interior",
    summary: "",
    description: "",
    coverImage: "",
    rooms: [],
    drawings: [],
    featured: false,
    published: false,
  };
}

function fieldsOf(project: Project): ProjectFields {
  return {
    title: project.title,
    subtitle: project.subtitle,
    location: project.location,
    year: project.year,
    area: project.area,
    status: project.status,
    scope: project.scope,
    summary: project.summary,
    description: project.description,
    credit: project.credit,
    coverImage: project.coverImage,
    rooms: project.rooms,
    drawings: project.drawings,
    featured: project.featured,
    published: project.published,
  };
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFields>(() => (project ? fieldsOf(project) : emptyFields()));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = saving || deleting;
  // Images for a saved project stay under its slug; a new one uses the title typed so far.
  const folder = project?.slug ?? (slugify(form.title) || "draft");

  function set<K extends keyof ProjectFields>(key: K, value: ProjectFields[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (project) await updateProject(project.id, form);
      else await createProject(form);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!project) return;
    if (!window.confirm(`Delete "${project.title}"? It disappears from the website straight away and can't be undone.`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProject(project.id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-3xl mx-auto space-y-12 pb-40">
      <h1 className="text-xl font-light">{project ? "Edit project" : "New project"}</h1>

      <FormSection title="Details">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>Title</label>
            <input
              id="title"
              className={inputClass}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. James Residence"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input
              id="location"
              className={inputClass}
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Hennur, Bangalore"
            />
          </div>
          <div>
            <label htmlFor="scope" className={labelClass}>Type of work</label>
            <select
              id="scope"
              className={inputClass}
              value={form.scope}
              onChange={(e) => set("scope", e.target.value as ProjectScope)}
            >
              <option value="Interior">Interior</option>
              <option value="Architecture & Interior">Architecture & Interior</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select
              id="status"
              className={inputClass}
              value={form.status}
              onChange={(e) => set("status", e.target.value as Project["status"])}
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
            </select>
          </div>
          <div>
            <label htmlFor="year" className={labelClass}>Year (blank if ongoing)</label>
            <input
              id="year"
              type="number"
              className={inputClass}
              value={form.year ?? ""}
              onChange={(e) => set("year", e.target.value === "" ? null : Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>Area (optional)</label>
            <input
              id="area"
              className={inputClass}
              value={form.area ?? ""}
              onChange={(e) => set("area", e.target.value)}
              placeholder="e.g. 1,600 sq ft"
            />
          </div>
          <div>
            <label htmlFor="credit" className={labelClass}>Credit (optional)</label>
            <input
              id="credit"
              className={inputClass}
              value={form.credit ?? ""}
              onChange={(e) => set("credit", e.target.value)}
              placeholder="e.g. In association with …"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="subtitle" className={labelClass}>Tagline (optional)</label>
            <input
              id="subtitle"
              className={inputClass}
              value={form.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="e.g. A three-bedroom home for three generations"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="About the project">
        <div className="space-y-5">
          <div>
            <label htmlFor="summary" className={labelClass}>Short summary (one or two sentences, shown on cards)</label>
            <textarea
              id="summary"
              rows={2}
              className={inputClass}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Full description (leave a blank line between paragraphs)</label>
            <textarea
              id="description"
              rows={8}
              className={inputClass}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Cover photo" hint="Shown on the project card and at the top of the project page.">
        <CoverUploader folder={folder} value={form.coverImage} onChange={(src) => set("coverImage", src)} />
      </FormSection>

      <FormSection title="Rooms and photos" hint="Group photos by room. Use the star on a photo to make it the cover.">
        <RoomsEditor
          folder={folder}
          rooms={form.rooms}
          onChange={(rooms) => set("rooms", rooms)}
          coverSrc={form.coverImage}
          onSetCover={(src) => set("coverImage", src)}
        />
      </FormSection>

      <FormSection title="Drawings and plans" hint="Optional. Floor plans, elevations, sketches.">
        <PhotoGrid<Drawing>
          folder={folder}
          items={form.drawings}
          onItemsChange={(drawings) => set("drawings", drawings)}
          onAdd={(uploaded) => set("drawings", [...form.drawings, ...uploaded.map((u) => ({ ...u, alt: "" }))])}
          addLabel="Add drawings"
        />
      </FormSection>

      <FormSection title="On the website">
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle
            checked={form.published}
            onChange={(v) => set("published", v)}
            label="Published"
            hint="Visible on the website. Switch off to keep it as a draft."
          />
          <Toggle
            checked={form.featured}
            onChange={(v) => set("featured", v)}
            label="Show on the homepage"
            hint="Featured projects appear on the home page."
          />
        </div>
      </FormSection>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#EDE8E0]/10 bg-[#0B0C0C]/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 space-y-2">
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <div className="flex items-center gap-2">
            {project && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            )}
            <Link
              href="/admin"
              className="ml-auto text-sm px-4 py-2.5 rounded-full text-[#EDE8E0]/70 hover:bg-[#EDE8E0]/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {form.published ? "Save" : "Save as draft"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
