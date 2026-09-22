import Counter from "@/components/motion/Counter";

const STATS: { to: number; suffix?: string; label: string }[] = [
  { to: 4, label: "Featured projects" },
  { to: 12400, label: "Sq ft designed" },
  { to: 3, label: "Cities — Bangalore, Ballari, Pune" },
  { to: 10, label: "Services under one roof" },
];

/** Teal stats band: four counters that tick up once in view. */
export default function StatsStrip() {
  return (
    <section className="band-teal">
      <div className="container-x section-y grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="border-t border-hairline-light pt-6">
            <Counter
              to={stat.to}
              suffix={stat.suffix}
              className="block font-display text-[clamp(40px,5vw,72px)] font-light leading-none text-bone"
            />
            <p className="label mt-4 text-marigold">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
