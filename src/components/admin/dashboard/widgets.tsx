"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Link2, Plug } from "lucide-react";
import type { AnalyticsData, AnalyticsRange, AnalyticsResponse, AnalyticsRow } from "@/lib/admin/types";
import { RANGES, dateKeys, fmt } from "@/components/admin/dashboard/data";
import TrafficChart, { type ChartSeries } from "@/components/admin/dashboard/TrafficChart";

export function RangeSelect({ range, onChange }: { range: AnalyticsRange; onChange: (range: AnalyticsRange) => void }) {
  return (
    <div className="a-seg" role="group" aria-label="Date range">
      {RANGES.map((r) => (
        <button key={r} type="button" aria-pressed={range === r} onClick={() => onChange(r)}>
          {r} days
        </button>
      ))}
    </div>
  );
}

/** A change chip. `unit` "pct" shows a percentage change; "n" shows an absolute difference. */
export function Delta({ current, previous, unit = "pct", goodWhenUp = true }: { current: number; previous: number | null | undefined; unit?: "pct" | "n" | "pt"; goodWhenUp?: boolean }) {
  if (previous === null || previous === undefined) return null;
  const diff = current - previous;
  if (unit === "pct" && previous === 0) return null;
  const value = unit === "pct" ? (diff / previous) * 100 : diff;
  if (Math.abs(value) < 0.005) return <span className="a-chip flat">No change</span>;
  const up = value > 0;
  const tone = up === goodWhenUp ? "up" : "down";
  const text = unit === "pct" ? `${Math.abs(value).toFixed(1)}%` : unit === "pt" ? `${Math.abs(value).toFixed(2)} pt` : String(Math.abs(value));
  return (
    <span className={`a-chip ${tone}`}>
      {up ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />}
      {text}
    </span>
  );
}

export interface Kpi {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  note?: string;
}

export function KpiStrip({ items, vs }: { items: Kpi[]; vs?: string }) {
  return (
    <section className="a-kpis" aria-label="Key figures">
      {items.map((item) => (
        <div className="a-kpi" key={item.label}>
          <div className="l">{item.label}</div>
          <div className="v">{item.value}</div>
          <div className="d">
            {item.delta}
            {(item.delta && vs) || item.note ? <span className="vs">{item.note ?? vs}</span> : null}
          </div>
        </div>
      ))}
    </section>
  );
}

export function BarList({ rows, empty = "No data for this period yet." }: { rows: { name: string; value: number; detail?: string }[]; empty?: string }) {
  if (!rows.length) return <div className="a-empty">{empty}</div>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  return (
    <div className="a-bars">
      {rows.map((row) => (
        <div className="a-bar" key={row.name}>
          <div className="row">
            <b title={row.name}>{row.name}</b>
            <span>
              {fmt(row.value)} · {Math.round((row.value / total) * 100)}%
            </span>
          </div>
          <div className="tr">
            <i style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PagesTable({ rows, limit }: { rows: AnalyticsRow[]; limit?: number }) {
  const shown = rows.slice(0, limit);
  if (!shown.length) return <div className="a-empty">No page views for this period yet.</div>;
  const max = Math.max(...shown.map((r) => r.pageviews), 1);
  return (
    <div className="a-tw">
      <table className="a-table">
        <thead>
          <tr>
            <th>Page</th>
            <th className="n">Visitors</th>
            <th>Page views</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td className="n">{fmt(row.visitors)}</td>
              <td>
                <div className="a-mini">
                  <div className="tr">
                    <i style={{ width: `${(row.pageviews / max) * 100}%` }} />
                  </div>
                  <span>{fmt(row.pageviews)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Shown wherever Vercel numbers would be, when the token is missing or Vercel returned an error. */
export function ConnectNote({ response, loading }: { response: AnalyticsResponse | null; loading?: boolean }) {
  if (loading) return <div className="a-skel" style={{ height: 120 }} aria-label="Loading analytics" />;
  const error = response && response.configured && "error" in response ? response.error : null;
  return (
    <div className="a-note">
      <span className={`ic ${error ? "ic-w" : "ic-b"}`}>
        <Plug size={15} aria-hidden="true" />
      </span>
      <p>
        {error ? (
          <>
            <b>Vercel Analytics did not answer</b>
            {error}
          </>
        ) : (
          <>
            <b>Connect Vercel Analytics to see page views here</b>
            Add <code>VERCEL_ANALYTICS_TOKEN</code> and <code>VERCEL_PROJECT_ID</code> (and <code>VERCEL_TEAM_ID</code> for a team project) to the
            Vercel environment variables, then redeploy. Enable Web Analytics on the project first. Enquiries below already work without it.
          </>
        )}
      </p>
    </div>
  );
}

type Metric = "views" | "visitors" | "enquiries";

/** Tabs + chart + legend. Page views and visitors need analytics; enquiries come from the inbox. */
export function TrafficPanel({
  analytics,
  enquiries,
  range,
  height = 260,
  both = false,
}: {
  analytics: AnalyticsData | null;
  enquiries: number[] | null;
  range: AnalyticsRange;
  height?: number;
  /** On the Analytics page the page-views tab also draws visitors. */
  both?: boolean;
}) {
  const tabs: { id: Metric; label: string }[] = [];
  if (analytics) tabs.push({ id: "views", label: "Page views" }, { id: "visitors", label: "Visitors" });
  if (enquiries) tabs.push({ id: "enquiries", label: "Enquiries" });
  const [picked, setPicked] = useState<Metric>("views");
  const active = tabs.find((t) => t.id === picked)?.id ?? tabs[0]?.id;

  const dates = analytics ? analytics.days.map((d) => d.date) : dateKeys(range);
  const series: ChartSeries[] = [];
  if (active === "views" && analytics) {
    series.push({ key: "views", name: "Page views", color: "var(--a-brand)", values: analytics.days.map((d) => d.pageviews) });
    if (both) series.push({ key: "visitors", name: "Visitors", color: "var(--a-amber-line)", values: analytics.days.map((d) => d.visitors) });
  } else if (active === "visitors" && analytics) {
    series.push({ key: "visitors", name: "Visitors", color: "var(--a-brand)", values: analytics.days.map((d) => d.visitors) });
  } else if (active === "enquiries" && enquiries) {
    series.push({ key: "enquiries", name: "Enquiries", color: "var(--a-brand)", values: enquiries });
  }

  return (
    <section className="a-panel">
      <header className="a-panel-h tabs">
        <div className="a-tabs" role="tablist">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" role="tab" aria-selected={active === tab.id} onClick={() => setPicked(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="r">
          <span className="a-src">
            <Link2 size={13} aria-hidden="true" />
            {analytics && active !== "enquiries" ? "Vercel Web Analytics" : "Contact form"}
          </span>
        </div>
      </header>
      <div className="a-body">
        {series.length ? (
          <>
            <TrafficChart dates={dates} series={series} height={height} label={`Daily ${series.map((s) => s.name.toLowerCase()).join(" and ")} for the last ${range} days`} />
            <div className="a-legend">
              {series.map((s) => (
                <span key={s.key}>
                  <i style={{ background: s.color }} />
                  {s.name}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="a-skel" style={{ height }} aria-label="Loading chart" />
        )}
      </div>
    </section>
  );
}
