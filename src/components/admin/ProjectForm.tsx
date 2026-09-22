"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { Project, ProjectScope } from "@/lib/types";
import {
  createProject,
  deleteProject,
  listAllProjects,
  slugify,
  triggerRevalidate,
  updateProject,
  type ProjectInput,
} from "@/lib/admin-api";
import ImageUploader from "./ImageUploader";

const SCOPES: ProjectScope[] = ["Interior", "Architecture & Interior"];
const STATUSES: Project["status"][] = ["Completed", "Ongoing"];

const inputClass =
  "w-full bg-[#EDE8E0]/[0.04] border border-[#EDE8E0]/15 rounded-lg px-3 py-2 text-sm text-[#EDE8E0] placeholder:text-[#EDE8E0]/30 focus:outline-none focus:border-[#5E9AA3]/60 transition-colors";
const labelClass = "block text-xs uppercase tracking-wider text-[#EDE8E0]/50 mb-1.5";

function emptyProject(order: number): ProjectInput {
  return {
    slug: "",
    title: "",
    scope: "Interior",
    location: "",
    year: new Date().getFullYear(),
    area: "",
    status: "Completed",
    summary: "",
    description: "",
    coverImage: "",
    rooms: [],
    drawings: [],
    gallery: [],
    featured: false,
    order,
    published: false,
  };
}

export default function ProjectForm({ id, initial }: { id?: string; initial?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<ProjectInput>(() => (initial ? { ...initial } : emptyProject(0)));
  const slugTouched = useRef(isEdit); // in edit mode, don't auto-rewrite an existing slug
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) return;
    listAllProjects()
      .then((projects) => setForm((f) => ({ ...f, order: projects.length })))
      .catch(() => {
        /* non-fatal: order defaults to 0 */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched.current ? f.slug : slugify(title),
    }));
  }

  function handleSlugChange(slug: string) {
    slugTouched.current = true;
    update("slug", slugify(slug));
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Title is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.summary.trim()) return "Summary is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.coverImage) return "A cover image is required.";
    if (form.year !== null && (!Number.isFinite(form.year) || form.year < 1900)) return "Enter a valid year.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      // rooms/drawings editing isn't supported yet — `form` already carries
      // whatever the initial doc had (spread in useState above), untouched.
      const payload: ProjectInput = { ...form };

      if (isEdit && id) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }
      await triggerRevalidate();
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm(`Delete "${form.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProject(id);
      await triggerRevalidate();
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light">{isEdit ? "Edit project" : "New project"}</h1>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <section className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title</label>
          <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Slug</label>
          <input className={inputClass} value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Scope</label>
          <select
            className={inputClass}
            value={form.scope}
            onChange={(e) => update("scope", e.target.value as ProjectScope)}
          >
            {SCOPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={form.location} onChange={(e) => update("location", e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Year</label>
          <input
            type="number"
            className={inputClass}
            value={form.year ?? ""}
            onChange={(e) => update("year", e.target.value === "" ? null : Number(e.target.value))}
          />
        </div>

        <div>
          <label className={labelClass}>Area (optional)</label>
          <input
            className={inputClass}
            placeholder="e.g. 2,400 sq.ft"
            value={form.area ?? ""}
            onChange={(e) => update("area", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => update("status", e.target.value as Project["status"])}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Summary (1–2 sentences, shown on cards)</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description (long-form; separate paragraphs with a blank line)</label>
          <textarea
            className={inputClass}
            rows={8}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-6 border-t border-[#EDE8E0]/10 pt-6">
        <ImageUploader
          slug={form.slug}
          images={form.coverImage ? [form.coverImage] : []}
          onChange={(imgs) => update("coverImage", imgs[0] ?? "")}
          label="Cover image"
        />
        <p className="text-xs text-[#EDE8E0]/40">
          Room-by-room photos and drawings aren&rsquo;t editable here yet — they&rsquo;re kept as-is from the
          existing document.
        </p>
      </section>

      <section className="flex items-center gap-8 border-t border-[#EDE8E0]/10 pt-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="accent-[#5E9AA3]"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="accent-[#5E9AA3]"
          />
          Featured
        </label>
      </section>
    </form>
  );
}
