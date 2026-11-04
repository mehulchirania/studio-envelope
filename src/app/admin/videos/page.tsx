"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, Film, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { VideoRecord } from "@/lib/admin/types";
import { deleteVideo, listVideos, saveVideoOrder } from "@/lib/admin/client";

const iconButton =
  "p-2.5 rounded-full text-muted hover:text-ink hover:bg-ink/10 transition-colors disabled:opacity-25 disabled:pointer-events-none";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setVideos(await listVideos());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load videos.");
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
    if (!videos) return;
    const target = index + direction;
    if (target < 0 || target >= videos.length) return;
    const next = [...videos];
    [next[index], next[target]] = [next[target], next[index]];
    setVideos(next);
    void run(async () => {
      try {
        await saveVideoOrder(next.map((v) => v.id));
      } catch (err) {
        await load();
        throw err;
      }
    });
  }

  function remove(video: VideoRecord) {
    if (!window.confirm(`Delete "${video.title}"? It disappears from the website straight away and can't be undone.`)) return;
    void run(async () => {
      await deleteVideo(video.id);
      await load();
    });
  }

  const list = videos ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-light">Videos</h1>
          {videos && (
            <p className="text-sm text-muted mt-1">
              {list.filter((v) => v.published).length} on the website, in this order. Changes go live straight away.
            </p>
          )}
        </div>
        <Link
          href="/admin/videos/new"
          className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-night text-bone font-medium hover:bg-abyss transition-colors shrink-0"
        >
          <Plus size={16} />
          Add video
        </Link>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!videos && !error && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted py-16">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {videos && list.length > 0 && (
        <ol className="rounded-2xl border border-hairline divide-y divide-hairline overflow-hidden">
          {list.map((video, index) => {
            const thumb = video.poster ?? (video.youtubeId ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` : undefined);
            return (
              <li key={video.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 sm:px-4 py-3">
                <span className="w-6 text-center text-sm text-muted/60 tabular-nums">{index + 1}</span>

                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="w-20 h-12 rounded-md object-cover border border-hairline bg-ink/10" />
                ) : (
                  <span className="w-20 h-12 rounded-md border border-dashed border-ink/25 flex items-center justify-center text-muted" aria-hidden>
                    <Film size={16} />
                  </span>
                )}

                <div className="min-w-0 flex-1 basis-48">
                  <Link href={`/admin/videos/${video.id}`} className="block truncate text-[15px] hover:text-teal-deep transition-colors">
                    {video.title || "Untitled"}
                  </Link>
                  <p className="text-xs text-muted truncate mt-0.5">
                    {video.youtubeId ? "YouTube" : video.src ? "Uploaded file" : "No video yet"}
                  </p>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    video.published ? "border-teal/60 text-teal-deep" : "border-ink/25 text-muted"
                  }`}
                >
                  {video.published ? "Live" : "Draft"}
                </span>

                <div className="flex items-center">
                  <button
                    type="button"
                    className={iconButton}
                    onClick={() => move(index, -1)}
                    disabled={busy || index === 0}
                    aria-label={`Move ${video.title} up`}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    className={iconButton}
                    onClick={() => move(index, 1)}
                    disabled={busy || index === list.length - 1}
                    aria-label={`Move ${video.title} down`}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <Link href={`/admin/videos/${video.id}`} className={iconButton} aria-label={`Edit ${video.title}`}>
                    <Pencil size={16} />
                  </Link>
                  {video.published && (
                    <a href="/videos" target="_blank" rel="noreferrer" className={iconButton} aria-label="View the Videos page">
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    type="button"
                    className={`${iconButton} hover:!text-red-700`}
                    onClick={() => remove(video)}
                    disabled={busy}
                    aria-label={`Delete ${video.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {videos && list.length === 0 && (
        <p className="text-sm text-muted py-10 text-center">No videos yet. Add your first one.</p>
      )}
    </div>
  );
}
