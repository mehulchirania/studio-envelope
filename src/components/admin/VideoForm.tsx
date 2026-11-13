"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Loader2, Save, Trash2, Upload } from "lucide-react";
import type { Project } from "@/lib/content/types";
import type { VideoFields, VideoRecord } from "@/lib/admin/types";
import { createVideo, deleteVideo, listProjects, updateVideo, uploadVideo } from "@/lib/admin/client";
import { parseYouTubeId } from "@/lib/admin/youtube";
import { CoverUploader } from "@/components/admin/PhotoUploader";
import FormSection from "@/components/admin/FormSection";
import Toggle from "@/components/admin/Toggle";

const inputClass =
  "w-full bg-ink/[0.05] border border-ink/25 rounded-lg px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-teal transition-colors";
const labelClass = "block text-xs uppercase tracking-wider text-muted mb-1.5";
const MAX_BYTES = 500 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

type Source = "youtube" | "file";

function fieldsOf(video?: VideoRecord): VideoFields {
  return {
    title: video?.title ?? "",
    credits: video?.credits,
    projectSlug: video?.projectSlug,
    youtubeId: video?.youtubeId,
    src: video?.src,
    poster: video?.poster,
    published: video?.published ?? false,
  };
}

export default function VideoForm({ video }: { video?: VideoRecord }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<VideoFields>(() => fieldsOf(video));
  const [source, setSource] = useState<Source>(video?.src && !video.youtubeId ? "file" : "youtube");
  // What's typed in the YouTube box: a full link or an id. Cleaned up on the server too.
  const [link, setLink] = useState(video?.youtubeId ? `https://youtu.be/${video.youtubeId}` : "");
  const [projects, setProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = saving || deleting || progress !== null;
  const youtubeId = link.trim() ? parseYouTubeId(link) : null;

  useEffect(() => {
    let cancelled = false;
    listProjects()
      .then(({ projects }) => {
        if (!cancelled) setProjects(projects);
      })
      .catch(() => undefined); // the link is optional, so a failed lookup just leaves the list empty
    return () => {
      cancelled = true;
    };
  }, []);

  function set<K extends keyof VideoFields>(key: K, value: VideoFields[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (fileInput.current) fileInput.current.value = "";
    if (!file) return;
    setError(null);
    if (!VIDEO_TYPES.includes(file.type)) {
      setError(`"${file.name}" isn't an mp4, webm or mov video.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`"${file.name}" is larger than 500MB. Upload it to YouTube and paste the link instead.`);
      return;
    }
    setProgress(0);
    try {
      set("src", await uploadVideo(file, setProgress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setProgress(null);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (source === "youtube" && link.trim() && !youtubeId) {
      setError("That doesn't look like a YouTube link. Paste the video's address from YouTube.");
      return;
    }
    // Only the chosen source is sent; the other is cleared.
    const payload: VideoFields =
      source === "youtube" ? { ...form, youtubeId: youtubeId ?? undefined, src: undefined } : { ...form, youtubeId: undefined };
    setSaving(true);
    try {
      if (video) await updateVideo(video.id, payload, video.updatedAt);
      else await createVideo(payload);
      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!video) return;
    if (!window.confirm(`Delete "${video.title}"? It disappears from the website straight away and can't be undone.`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteVideo(video.id);
      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete. Please try again.");
      setDeleting(false);
    }
  }

  const sourceButton = (value: Source, label: string) => (
    <button
      type="button"
      onClick={() => setSource(value)}
      aria-pressed={source === value}
      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
        source === value ? "bg-night text-bone border-night" : "border-ink/25 text-muted hover:text-ink hover:bg-ink/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={save} className="max-w-3xl mx-auto space-y-12 pb-40">
      <h1 className="text-xl font-light">{video ? "Edit video" : "New video"}</h1>

      <FormSection title="Details">
        <div className="space-y-5">
          <div>
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
            <label htmlFor="project" className={labelClass}>Project (optional)</label>
            <select
              id="project"
              className={inputClass}
              value={form.projectSlug ?? ""}
              onChange={(e) => set("projectSlug", e.target.value || undefined)}
            >
              <option value="">Not linked to a project</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted mt-1.5">
              Linking shows the project&rsquo;s location, type of work, area and year under the title, and links the title to the project.
            </p>
          </div>
          <div>
            <label htmlFor="credits" className={labelClass}>Credits (optional)</label>
            <input
              id="credits"
              className={inputClass}
              value={form.credits ?? ""}
              onChange={(e) => set("credits", e.target.value)}
              placeholder="e.g. Design Team: …"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Video" hint="Paste a YouTube link, or upload a file. YouTube is best for long films.">
        <div className="flex gap-2">
          {sourceButton("youtube", "YouTube link")}
          {sourceButton("file", "Upload a file")}
        </div>

        {source === "youtube" ? (
          <div>
            <label htmlFor="youtube" className={labelClass}>YouTube link</label>
            <input
              id="youtube"
              className={inputClass}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              inputMode="url"
            />
            {youtubeId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                alt=""
                className="mt-3 w-full max-w-xs aspect-video object-cover rounded-lg border border-hairline"
              />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              ref={fileInput}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(e) => void handleFile(e.target.files)}
            />
            {form.src && progress === null && (
              <video src={form.src} controls preload="metadata" className="w-full max-w-md aspect-video rounded-lg border border-hairline bg-ink" />
            )}
            {progress !== null && (
              <div className="max-w-md space-y-2" role="status">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 size={14} className="animate-spin" /> Uploading… <span className="ml-auto tabular-nums">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-ink/15 overflow-hidden">
                  <div className="h-full bg-night transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={progress !== null}
              className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border border-ink/25 hover:bg-ink/10 transition-colors disabled:opacity-50"
            >
              {form.src ? <Film size={14} /> : <Upload size={14} />}
              {form.src ? "Replace video" : "Choose video file"}
            </button>
            <p className="text-xs text-muted">mp4, webm or mov, up to 500MB. Keep this page open until the upload finishes.</p>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Cover image"
        hint="Optional. Shown before the video plays. YouTube videos use their own thumbnail if you skip this."
      >
        <CoverUploader folder="videos" value={form.poster ?? ""} onChange={(src) => set("poster", src || undefined)} />
      </FormSection>

      <FormSection title="On the website">
        <Toggle
          checked={form.published}
          onChange={(v) => set("published", v)}
          label="Published"
          hint="Visible on the Videos page. Switch off to keep it as a draft."
        />
      </FormSection>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-bone/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 space-y-2">
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="flex items-center gap-2">
            {video && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-full border border-red-500/30 text-red-700 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            )}
            <Link
              href="/admin/videos"
              className="ml-auto text-sm px-4 py-2.5 rounded-full text-ink hover:bg-ink/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-full bg-night text-bone font-medium hover:bg-abyss transition-colors disabled:opacity-60"
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
