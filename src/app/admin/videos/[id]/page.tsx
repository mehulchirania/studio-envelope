"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { VideoRecord } from "@/lib/admin/types";
import { getVideo } from "@/lib/admin/client";
import VideoForm from "@/components/admin/VideoForm";

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [video, setVideo] = useState<VideoRecord | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getVideo(id)
      .then((v) => {
        if (!cancelled) setVideo(v);
      })
      .catch(() => {
        if (!cancelled) setVideo(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (video === undefined) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted py-16">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (video === null) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-sm text-muted">That video couldn&rsquo;t be found.</p>
        <Link href="/admin/videos" className="text-sm text-teal-deep hover:underline">
          Back to all videos
        </Link>
      </div>
    );
  }

  return <VideoForm video={video} />;
}
