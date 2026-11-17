// Server-only: reads page views from the Vercel Web Analytics API
// (https://vercel.com/docs/analytics/web-analytics-api). The access token never leaves the server.
import "server-only";
import type { AnalyticsData, AnalyticsDay, AnalyticsRange, AnalyticsResponse, AnalyticsRow } from "@/lib/admin/types";

const ENDPOINT = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
/** Vercel's numbers move slowly; 15 minutes keeps the dashboard quick and the API calls few. */
const REVALIDATE_SECONDS = 900;

type Row = Record<string, unknown>;

function config() {
  const token = process.env.VERCEL_ANALYTICS_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();
  if (!token || !projectId) return null;
  return { token, projectId, teamId: process.env.VERCEL_TEAM_ID?.trim() || undefined };
}

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

function daysAgo(n: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - n));
}

async function query(by: string, since: string, until: string, limit?: number): Promise<Row[]> {
  const cfg = config();
  if (!cfg) throw new Error("Analytics is not set up.");
  const url = new URL(ENDPOINT);
  url.searchParams.set("projectId", cfg.projectId);
  if (cfg.teamId) url.searchParams.set("teamId", cfg.teamId);
  url.searchParams.set("by", by);
  url.searchParams.set("since", since);
  url.searchParams.set("until", until);
  if (limit) url.searchParams.set("limit", String(limit));

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error("Vercel rejected the analytics token. Check VERCEL_ANALYTICS_TOKEN and VERCEL_TEAM_ID.");
    if (response.status === 404) throw new Error("Vercel could not find that project. Check VERCEL_PROJECT_ID.");
    if (response.status === 402) throw new Error("Web Analytics is not available for this Vercel plan or project.");
    throw new Error(`Vercel Analytics returned an error (${response.status}).`);
  }
  const body = (await response.json()) as { data?: Row[] };
  return Array.isArray(body.data) ? body.data : [];
}

const num = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

function rows(data: Row[], field: string, label: (raw: string) => string): AnalyticsRow[] {
  return data
    .map((row) => ({
      name: label(typeof row[field] === "string" ? (row[field] as string) : ""),
      pageviews: num(row.pageviews),
      visitors: num(row.visitors),
    }))
    .sort((a, b) => b.pageviews - a.pageviews);
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
function countryName(code: string): string {
  if (!code || code === "Others") return code || "Unknown";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

const capitalise = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : "Unknown");

export async function getAnalytics(range: AnalyticsRange): Promise<AnalyticsResponse> {
  if (!config()) return { configured: false };

  const until = dayKey(daysAgo(0));
  const since = dayKey(daysAgo(range - 1));

  try {
    // Current period and the one before it, in one daily query. If Vercel's reporting window is shorter
    // than twice the range, fall back to the current period alone (no comparison).
    let daily: Row[];
    let hasPrevious = true;
    try {
      daily = await query("day", dayKey(daysAgo(range * 2 - 1)), until);
    } catch {
      hasPrevious = false;
      daily = await query("day", since, until);
    }

    const byDay = new Map<string, { pageviews: number; visitors: number }>();
    for (const row of daily) {
      if (typeof row.timestamp !== "string") continue;
      byDay.set(row.timestamp.slice(0, 10), { pageviews: num(row.pageviews), visitors: num(row.visitors) });
    }
    const days: AnalyticsDay[] = [];
    for (let i = range - 1; i >= 0; i--) {
      const date = dayKey(daysAgo(i));
      days.push({ date, ...(byDay.get(date) ?? { pageviews: 0, visitors: 0 }) });
    }
    let previous: AnalyticsData["previous"] = null;
    if (hasPrevious) {
      previous = { pageviews: 0, visitors: 0 };
      for (let i = range * 2 - 1; i >= range; i--) {
        const entry = byDay.get(dayKey(daysAgo(i)));
        if (entry) {
          previous.pageviews += entry.pageviews;
          previous.visitors += entry.visitors;
        }
      }
    }

    // The breakdowns are nice to have: one failing must not hide the rest.
    const [pages, sources, countries, devices] = await Promise.allSettled([
      query("requestPath", since, until, 10),
      query("referrerHostname", since, until, 8),
      query("country", since, until, 8),
      query("deviceType", since, until, 5),
    ]);
    const ok = (result: PromiseSettledResult<Row[]>) => (result.status === "fulfilled" ? result.value : []);

    return {
      configured: true,
      range,
      days,
      previous,
      pages: rows(ok(pages), "requestPath", (raw) => raw || "/"),
      sources: rows(ok(sources), "referrerHostname", (raw) => (raw ? raw.replace(/^www\./, "") : "Direct")),
      countries: rows(ok(countries), "country", countryName),
      devices: rows(ok(devices), "deviceType", capitalise),
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[admin analytics]", err);
    return { configured: true, error: err instanceof Error ? err.message : "Couldn't load analytics from Vercel." };
  }
}
