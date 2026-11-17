"use client";

import { useEffect, useState } from "react";
import { getAnalytics, listMessages, listProjects } from "@/lib/admin/client";
import type { AdminMessage, AnalyticsRange, AnalyticsResponse, ProjectsResponse } from "@/lib/admin/types";

export const RANGES: AnalyticsRange[] = [7, 30, 90];

export const fmt = (n: number) => n.toLocaleString("en-IN");

/** The last `range` UTC calendar days as YYYY-MM-DD, oldest first, ending today. */
export function dateKeys(range: number): string[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = range - 1; i >= 0; i--) {
    keys.push(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)).toISOString().slice(0, 10));
  }
  return keys;
}

export function dayLabel(key: string, long = false): string {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(long ? { weekday: "short" as const } : {}),
    timeZone: "UTC",
  });
}

/** Enquiries received per day for the given day keys. */
export function enquiriesPerDay(messages: AdminMessage[], keys: string[]): number[] {
  const counts = new Map<string, number>(keys.map((k) => [k, 0]));
  for (const message of messages) {
    if (!message.createdAt) continue;
    const key = message.createdAt.slice(0, 10);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return keys.map((k) => counts.get(k) ?? 0);
}

interface Loaded<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

function useLoaded<T>(load: () => Promise<T>, key: string): Loaded<T> {
  const [state, setState] = useState<{ key: string; data: T | null; error: string | null }>({ key, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setState({ key, data, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ key, data: null, error: err instanceof Error ? err.message : "Couldn't load." });
      });
    return () => {
      cancelled = true;
    };
    // `load` is recreated each render; `key` identifies what is being loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = state.key === key;
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: !current || (!state.data && !state.error),
  };
}

export const useAnalytics = (range: AnalyticsRange): Loaded<AnalyticsResponse> => useLoaded(() => getAnalytics(range), `analytics-${range}`);
export const useMessages = (): Loaded<AdminMessage[]> => useLoaded(listMessages, "messages");
export const useProjects = (): Loaded<ProjectsResponse> => useLoaded(listProjects, "projects");

/** Page views for one project page, from the analytics "pages" rows. */
export function projectViews(pages: { name: string; pageviews: number }[], slug: string): number {
  return pages.filter((p) => p.name === `/projects/${slug}` || p.name === `/projects/${slug}/`).reduce((sum, p) => sum + p.pageviews, 0);
}

/** "2 h ago", "Yesterday", "4 days ago", then the date. */
export function timeAgo(iso: string | null): string {
  if (!iso) return "Just now";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
