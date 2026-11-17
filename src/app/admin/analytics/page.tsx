"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { hasAnalytics, type AnalyticsRange, type AnalyticsRow } from "@/lib/admin/types";
import { dateKeys, enquiriesPerDay, fmt, useAnalytics, useMessages } from "@/components/admin/dashboard/data";
import { BarList, ConnectNote, Delta, KpiStrip, PagesTable, RangeSelect, TrafficPanel, type Kpi } from "@/components/admin/dashboard/widgets";

type Dim = "pages" | "sources" | "countries" | "devices";
const dims: { id: Dim; label: string }[] = [
  { id: "pages", label: "Pages" },
  { id: "sources", label: "Sources" },
  { id: "countries", label: "Countries" },
  { id: "devices", label: "Devices" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>(30);
  const [dim, setDim] = useState<Dim>("pages");
  const analytics = useAnalytics(range);
  const messages = useMessages();

  const a = hasAnalytics(analytics.data) ? analytics.data : null;
  const both = messages.data ? enquiriesPerDay(messages.data, dateKeys(range * 2)) : null;
  const enquiries = both ? both.slice(range) : null;
  const enquiryTotal = enquiries ? enquiries.reduce((s, n) => s + n, 0) : null;
  const enquiriesBefore = both ? both.slice(0, range).reduce((s, n) => s + n, 0) : null;

  const views = a?.days.reduce((s, d) => s + d.pageviews, 0) ?? 0;
  const visitors = a?.days.reduce((s, d) => s + d.visitors, 0) ?? 0;
  const rate = enquiryTotal !== null && visitors ? (enquiryTotal / visitors) * 100 : null;
  const rateBefore = enquiriesBefore !== null && a?.previous?.visitors ? (enquiriesBefore / a.previous.visitors) * 100 : null;

  const kpis: Kpi[] = a
    ? [
        { label: "Page views", value: fmt(views), delta: <Delta current={views} previous={a.previous?.pageviews} /> },
        { label: "Visitors", value: fmt(visitors), delta: <Delta current={visitors} previous={a.previous?.visitors} /> },
        { label: "Enquiries", value: enquiryTotal === null ? "…" : fmt(enquiryTotal), delta: enquiryTotal === null || enquiriesBefore === null ? undefined : <Delta current={enquiryTotal} previous={enquiriesBefore} unit="n" /> },
        {
          label: "Enquiry rate",
          value: rate === null ? "…" : (<>{rate.toFixed(2)}<small>%</small></>),
          delta: rate === null ? undefined : <Delta current={rate} previous={rateBefore} unit="pt" />,
        },
      ]
    : [];

  const breakdown = (rows: AnalyticsRow[]) => <div className="a-body"><BarList rows={rows.map((r) => ({ name: r.name, value: r.visitors }))} /></div>;

  return (
    <>
      <div className="a-ph">
        <div>
          <h1>Analytics</h1>
          <p>Production traffic, last {range} days</p>
        </div>
        <div className="a-acts">
          <RangeSelect range={range} onChange={setRange} />
        </div>
      </div>

      {!a ? (
        <ConnectNote response={analytics.data} loading={analytics.loading} />
      ) : (
        <>
          <KpiStrip items={kpis} vs={a.previous ? `vs previous ${range} days` : undefined} />
          <TrafficPanel analytics={a} enquiries={enquiries} range={range} height={300} both />
          <section className="a-panel">
            <header className="a-panel-h tabs">
              <div className="a-tabs" role="tablist">
                {dims.map((d) => (
                  <button key={d.id} type="button" role="tab" aria-selected={dim === d.id} onClick={() => setDim(d.id)}>
                    {d.label}
                  </button>
                ))}
              </div>
            </header>
            {dim === "pages" && <PagesTable rows={a.pages} />}
            {dim === "sources" && breakdown(a.sources)}
            {dim === "countries" && breakdown(a.countries)}
            {dim === "devices" && breakdown(a.devices)}
          </section>
          <section className="a-panel">
            <header className="a-panel-h">
              <h2>Data sources</h2>
              <span className="sub">Where these numbers come from</span>
            </header>
            <div className="a-body" style={{ display: "grid", gap: 14 }}>
              <p className="text-sm text-muted max-w-[70ch]">
                <Link2 size={13} className="inline mr-1.5 -mt-0.5" aria-hidden="true" />
                Page views, visitors, sources, countries and devices come from Vercel Web Analytics (production traffic only), read on the server so the
                access token never reaches the browser. They refresh about every 15 minutes; last read {new Date(a.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}.
              </p>
              <p className="text-sm text-muted max-w-[70ch]">Enquiries are counted from the messages saved by the contact form, so they match the inbox exactly. Vercel counts visitors without cookies or personal data.</p>
            </div>
          </section>
        </>
      )}
    </>
  );
}
