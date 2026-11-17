"use client";

import { useEffect, useRef, useState } from "react";
import { dayLabel, fmt } from "@/components/admin/dashboard/data";

export interface ChartSeries {
  key: string;
  name: string;
  /** A CSS colour, normally a var(--a-*) token so the chart follows the theme. */
  color: string;
  values: number[];
}

const PAD = { l: 40, r: 10, t: 10, b: 26 };

function niceMax(value: number): number {
  if (value <= 0) return 4;
  const p = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

/** Daily line chart drawn from real numbers: first series gets an area fill, hover shows every series for the day. */
export default function TrafficChart({ dates, series, height = 260, label }: { dates: string[]; series: ChartSeries[]; height?: number; label: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const n = dates.length;
  const iw = Math.max(0, width - PAD.l - PAD.r);
  const ih = height - PAD.t - PAD.b;
  const max = Math.max(0, ...series.flatMap((s) => s.values));
  const top = niceMax(max * 1.06);
  const x = (i: number) => PAD.l + (n > 1 ? (i * iw) / (n - 1) : iw / 2);
  const y = (v: number) => PAD.t + ih - (v / top) * ih;

  const ticks = [0, 1, 2, 3, 4].map((t) => (top * t) / 4);
  const labelCount = Math.max(1, Math.min(6, Math.floor(iw / 90)));
  const labelIndexes = Array.from({ length: labelCount + 1 }, (_, k) => Math.round((k * (n - 1)) / labelCount));

  function onMove(event: React.PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const i = Math.round(((event.clientX - box.left - PAD.l) / iw) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  }

  const tipLeft = hover === null ? 0 : x(hover) + 14 > width - 150 ? x(hover) - 154 : x(hover) + 14;

  return (
    <div ref={hostRef} className="a-chart" style={{ height }} role="img" aria-label={label}>
      {width > 0 && n > 0 && (
        <svg viewBox={`0 0 ${width} ${height}`} height={height} onPointerMove={onMove} onPointerLeave={() => setHover(null)} aria-hidden="true">
          {ticks.map((value) => (
            <g key={value}>
              <line x1={PAD.l} x2={width - PAD.r} y1={y(value)} y2={y(value)} style={{ stroke: "var(--a-line)" }} />
              <text x={PAD.l - 8} y={y(value) + 4} textAnchor="end">
                {value >= 1000 ? `${value / 1000}k` : Number.isInteger(value) ? value : value.toFixed(1)}
              </text>
            </g>
          ))}
          {labelIndexes.map((index, k) => (
            <text key={`${index}-${k}`} x={x(index)} y={height - 6} textAnchor={k === 0 ? "start" : k === labelIndexes.length - 1 ? "end" : "middle"}>
              {dayLabel(dates[index])}
            </text>
          ))}
          {series.map((s, si) => {
            const line = s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
            return (
              <g key={s.key}>
                {si === 0 && <path d={`${line}L${x(n - 1)} ${y(0)}L${x(0)} ${y(0)}Z`} style={{ fill: s.color, fillOpacity: 0.09 }} />}
                <path d={line} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" style={{ stroke: s.color }} />
                <circle cx={x(n - 1)} cy={y(s.values[n - 1] ?? 0)} r={3.5} style={{ fill: s.color }} />
              </g>
            );
          })}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} strokeDasharray="3 3" style={{ stroke: "var(--a-line-strong)" }} />
              {series.map((s) => (
                <circle key={s.key} cx={x(hover)} cy={y(s.values[hover] ?? 0)} r={4} strokeWidth={2} style={{ fill: "var(--a-surface)", stroke: s.color }} />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover !== null && (
        <div className="a-tip" style={{ left: Math.max(0, tipLeft) }}>
          <b>{dayLabel(dates[hover], true)}</b>
          {series.map((s) => (
            <div key={s.key}>
              <i style={{ background: s.color }} />
              {s.name}: <b>{fmt(s.values[hover] ?? 0)}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
