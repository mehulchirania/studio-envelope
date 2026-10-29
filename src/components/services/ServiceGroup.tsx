import Image from "next/image";

export type ServiceItem = {
  /** Running number across all ten services, e.g. "04". */
  number: string;
  name: string;
  description: string;
  image: { src: string; alt: string };
};

type ServiceGroupProps = {
  /** Anchor id for the stage. */
  id: string;
  /** Stage number, e.g. "01". */
  number: string;
  /** Stage name, e.g. "Design". */
  name: string;
  /** One line on what this stage covers. */
  blurb: string;
  services: ServiceItem[];
};

/** One stage of the services page, drawn as a vertical column marked by a brand
 * line on its left: stage number, name and summary at the top, then its services
 * stacked below, each with a small photo beside the text. */
export default function ServiceGroup({ id, number, name, blurb, services }: ServiceGroupProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-l-2 border-brand pl-6 sm:pl-8">
      <span aria-hidden="true" className="font-display text-5xl font-light leading-none text-brand sm:text-6xl">
        {number}
      </span>
      <h3 id={`${id}-heading`} className="mt-3 font-display text-4xl font-light text-ink">
        {name}
      </h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted">{blurb}</p>

      <ul className="mt-8 flex flex-col">
        {services.map((service) => (
          <li key={service.name} className="flex gap-4 border-t border-hairline py-5">
            <div className="relative aspect-[4/3] w-24 shrink-0 self-start overflow-hidden bg-paper-2 sm:w-28">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="label text-muted">{service.number}</span>
                <h4 className="font-display text-xl leading-tight text-ink">{service.name}</h4>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
