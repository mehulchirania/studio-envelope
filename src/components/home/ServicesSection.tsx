import Marquee from "@/components/motion/Marquee";
import Seal from "@/components/Seal";
import SectionHeader from "@/components/SectionHeader";
import { services } from "@/lib/site";

const ALL_SERVICES = [...services.design, ...services.furnishAndStyle, ...services.deliver];

const GROUPS = [
  { title: "Design", items: services.design },
  { title: "Furnish & Style", items: services.furnishAndStyle },
  { title: "Deliver", items: services.deliver },
];

/** Night marquee ribbon of all 10 services (separated by the seal glyph),
 * followed by a bone 3-column breakdown by group. */
export default function ServicesSection() {
  return (
    <>
      <section className="band-dark border-y border-hairline-light py-8 sm:py-10">
        <Marquee speed={30}>
          {ALL_SERVICES.map((item) => (
            <span key={item} className="flex items-center gap-6">
              <span className="whitespace-nowrap font-display text-[clamp(22px,3.4vw,40px)] font-light text-marigold">
                {item}
              </span>
              <Seal tone="dark" />
            </span>
          ))}
        </Marquee>
      </section>

      <section className="band-bone">
        <div className="container-x section-y">
          <SectionHeader
            label="What is included"
            heading="From first sketch to final styling."
            action={{ href: "/services", label: "Our services" }}
          />

          <div className="mt-14 grid gap-12 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <p className="label border-b border-hairline pb-4">{group.title}</p>
                <ul className="mt-4 flex flex-col">
                  {group.items.map((item) => (
                    <li key={item} className="border-b border-hairline py-4 font-display text-xl text-ink last:border-b-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
