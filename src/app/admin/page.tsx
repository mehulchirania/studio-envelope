"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, ImageIcon, Mail, Plug, Plus } from "lucide-react";
import { hasAnalytics, type AnalyticsRange } from "@/lib/admin/types";
import { useAdminUser } from "@/components/admin/AdminShell";
import { dateKeys, enquiriesPerDay, fmt, projectViews, timeAgo, useAnalytics, useMessages, useProjects } from "@/components/admin/dashboard/data";
import { BarList, ConnectNote, Delta, KpiStrip, PagesTable, RangeSelect, TrafficPanel, type Kpi } from "@/components/admin/dashboard/widgets";

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

interface Attention {
  tone: "w" | "b" | "g";
  icon: ReactNode;
  title: string;
  detail: string;
  href: string;
  action: string;
}

export default function OverviewPage() {
  const user = useAdminUser();
  const [range, setRange] = useState<AnalyticsRange>(30);
  const analytics = useAnalytics(range);
  const messages = useMessages();
  const projects = useProjects();

  const a = hasAnalytics(analytics.data) ? analytics.data : null;
  const both = messages.data ? enquiriesPerDay(messages.data, dateKeys(range * 2)) : null;
  const enquiries = both ? both.slice(range) : null;
  const enquiriesBefore = both ? both.slice(0, range).reduce((s, n) => s + n, 0) : null;
  const enquiryTotal = enquiries ? enquiries.reduce((s, n) => s + n, 0) : null;

  const unread = messages.data?.filter((m) => !m.read) ?? [];
  const list = projects.data?.projects ?? [];
  const editable = projects.data?.source === "database";
  const live = list.filter((p) => p.published);
  const drafts = list.filter((p) => !p.published);

  // What needs a human, most urgent first. Everything here is computed from real data.
  const attention: Attention[] = [];
  if (unread.length) {
    const oldest = [...unread].sort((x, y) => (x.createdAt ?? "").localeCompare(y.createdAt ?? ""))[0];
    attention.push({
      tone: "w",
      icon: <Mail size={15} aria-hidden="true" />,
      title: `${unread.length} new ${unread.length === 1 ? "enquiry" : "enquiries"}`,
      detail: `The oldest arrived ${timeAgo(oldest.createdAt).toLowerCase()}.`,
      href: "/admin/messages",
      action: "Open inbox",
    });
  }
  if (projects.data && !editable) {
    attention.push({
      tone: "b",
      icon: <ImageIcon size={15} aria-hidden="true" />,
      title: "The website is showing sample projects",
      detail: "Save them to the database to edit, reorder or add your own.",
      href: "/admin/projects",
      action: "Open projects",
    });
  }
  if (editable && drafts.length) {
    attention.push({
      tone: "b",
      icon: <FileText size={15} aria-hidden="true" />,
      title: `${drafts.length} draft ${drafts.length === 1 ? "project is" : "projects are"} not on the website`,
      detail: drafts
        .slice(0, 3)
        .map((p) => p.title || "Untitled")
        .join(", "),
      href: "/admin/projects",
      action: "Review",
    });
  }
  if (analytics.data && !analytics.data.configured) {
    attention.push({
      tone: "b",
      icon: <Plug size={15} aria-hidden="true" />,
      title: "Page views are not connected yet",
      detail: "Add the Vercel Analytics token to see visitors and top pages here.",
      href: "/admin/analytics",
      action: "See how",
    });
  }

  const kpis: Kpi[] = a
    ? [
        { label: "Page views", value: fmt(a.days.reduce((s, d) => s + d.pageviews, 0)), delta: <Delta current={a.days.reduce((s, d) => s + d.pageviews, 0)} previous={a.previous?.pageviews} /> },
        { label: "Visitors", value: fmt(a.days.reduce((s, d) => s + d.visitors, 0)), delta: <Delta current={a.days.reduce((s, d) => s + d.visitors, 0)} previous={a.previous?.visitors} /> },
        { label: "Enquiries", value: enquiryTotal === null ? "…" : fmt(enquiryTotal), delta: enquiryTotal === null || enquiriesBefore === null ? undefined : <Delta current={enquiryTotal} previous={enquiriesBefore} unit="n" /> },
        (() => {
          const visitors = a.days.reduce((s, d) => s + d.visitors, 0);
          const rate = enquiryTotal !== null && visitors ? (enquiryTotal / visitors) * 100 : null;
          const before = enquiriesBefore !== null && a.previous?.visitors ? (enquiriesBefore / a.previous.visitors) * 100 : null;
          return {
            label: "Enquiry rate",
            value: rate === null ? "…" : (<>{rate.toFixed(2)}<small>%</small></>),
            delta: rate === null ? undefined : <Delta current={rate} previous={before} unit="pt" />,
          };
        })(),
      ]
    : [
        { label: "Enquiries", value: enquiryTotal === null ? "…" : fmt(enquiryTotal), delta: enquiryTotal === null || enquiriesBefore === null ? undefined : <Delta current={enquiryTotal} previous={enquiriesBefore} unit="n" /> },
        { label: "New enquiries", value: messages.data ? fmt(unread.length) : "…", note: "Waiting for a reply" },
        { label: "Projects on the website", value: projects.data ? fmt(live.length) : "…", note: editable ? "Published" : "Built-in samples" },
        { label: "Drafts", value: projects.data ? fmt(drafts.length) : "…", note: "Not on the website" },
      ];

  const views = (slug: string) => (a ? projectViews(a.pages, slug) : null);
  const recent = (messages.data ?? []).slice(0, 5);

  return (
    <>
      <div className="a-ph">
        <div>
          <h1>
            {greeting()}, <span className="capitalize">{user}</span>
          </h1>
          <p>
            {a ? "Production traffic and enquiries" : "Enquiries and projects"}, last {range} days
          </p>
        </div>
        <div className="a-acts">
          <RangeSelect range={range} onChange={setRange} />
          <Link href="/admin/projects/new" className="a-btn pri">
            <Plus size={16} aria-hidden="true" />
            Add project
          </Link>
        </div>
      </div>

      <section className="a-panel" aria-label="Needs your attention">
        <header className="a-panel-h">
          <h2>Needs your attention</h2>
          {attention.length > 0 && <span className="sub">{attention.length} {attention.length === 1 ? "item" : "items"}</span>}
        </header>
        {attention.length ? (
          <ul className="a-attn">
            {attention.map((item) => (
              <li key={item.title}>
                <span className={`ic ic-${item.tone}`}>{item.icon}</span>
                <div className="t">
                  <b>{item.title}</b>
                  <span>{item.detail}</span>
                </div>
                <Link href={item.href} className="a-btn sm">
                  {item.action}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="a-attn">
            <li>
              <span className="ic ic-g">
                <CheckCircle2 size={15} aria-hidden="true" />
              </span>
              <div className="t">
                <b>{messages.loading || projects.loading ? "Checking…" : "Nothing needs your attention"}</b>
                <span>{messages.loading || projects.loading ? "Looking at your inbox and projects." : "No unread enquiries and no drafts waiting."}</span>
              </div>
            </li>
          </ul>
        )}
      </section>

      <KpiStrip items={kpis} vs={`vs previous ${range} days`} />

      <div className="a-grid a-g-main">
        <TrafficPanel analytics={a} enquiries={enquiries} range={range} />
        {a ? (
          <section className="a-panel">
            <header className="a-panel-h">
              <h2>Where visitors come from</h2>
            </header>
            <div className="a-body">
              <BarList rows={a.sources.map((s) => ({ name: s.name, value: s.visitors }))} />
            </div>
          </section>
        ) : (
          <ConnectNote response={analytics.data} loading={analytics.loading} />
        )}
      </div>

      <div className={a ? "a-grid a-g-2" : undefined}>
        {a && (
          <section className="a-panel">
            <header className="a-panel-h">
              <h2>Top pages</h2>
              <div className="r">
                <Link href="/admin/analytics" className="text-sm text-teal-deep hover:underline">
                  All analytics
                </Link>
              </div>
            </header>
            <PagesTable rows={a.pages} limit={6} />
          </section>
        )}
        <section className="a-panel">
          <header className="a-panel-h">
            <h2>Recent enquiries</h2>
            <div className="r">
              <Link href="/admin/messages" className="text-sm text-teal-deep hover:underline">
                Open inbox
              </Link>
            </div>
          </header>
          {messages.loading ? (
            <div className="a-body">
              <div className="a-skel" style={{ height: 120 }} aria-label="Loading enquiries" />
            </div>
          ) : recent.length ? (
            <div className="a-tw">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Looking for</th>
                    <th>Received</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{m.projectType || "Not said"}</td>
                      <td className="whitespace-nowrap">{timeAgo(m.createdAt)}</td>
                      <td>{m.read ? <span className="a-pill mute">Read</span> : <span className="a-pill new">New</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="a-empty">
              <b>No enquiries yet</b>
              They appear here as soon as someone uses the contact form.
            </div>
          )}
        </section>
      </div>

      <section className="a-panel">
        <header className="a-panel-h">
          <h2>Projects</h2>
          {a && <span className="sub">Page views, last {range} days</span>}
          <div className="r">
            <Link href="/admin/projects" className="text-sm text-teal-deep hover:underline">
              Manage projects
            </Link>
          </div>
        </header>
        {projects.loading ? (
          <div className="a-body">
            <div className="a-skel" style={{ height: 120 }} aria-label="Loading projects" />
          </div>
        ) : list.length ? (
          <div className="a-tw">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  {a && <th className="n">Page views</th>}
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="a-pj">
                        {p.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail from Blob or /public
                          <img className="a-thumb" src={p.coverImage} alt="" />
                        ) : (
                          <span className="a-thumb empty" aria-hidden="true" />
                        )}
                        <div>
                          <b>{p.title || "Untitled"}</b>
                          <span>{[p.scope, p.year ?? "Ongoing", p.area].filter(Boolean).join(" · ")}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.published ? <span className="a-pill good">Live</span> : <span className="a-pill mute">Draft</span>}</td>
                    {a && <td className="n">{fmt(views(p.slug) ?? 0)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="a-empty">
            <b>No projects yet</b>
            Add your first project to show it on the website.
          </div>
        )}
      </section>
    </>
  );
}
