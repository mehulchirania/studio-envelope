import Image from "next/image";

export type ServiceItem = {
  /** Running number across all ten services, e.g. "04". */
  number: string;
  name: string;
  description: string;
  image: { src: string; alt: string };
};

type ServiceGroupProps = {
  /** Anchor id, so the stage chips at the top of the page can link to it. */
  id: string;
  /** Stage number, e.g. "01". */
  number: string;
  /** Stage name, e.g. "Design". */
  name: string;
  /** One line on what this stage covers. */
  blurb: string;
  services: ServiceItem[];
};

/** One stage of the services page: a numbered heading with a short summary,
 * then each service as a card with its own photo, number, name and description. */
export default function ServiceGroup({ id, number, name, blurb, services }: ServiceGroupProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t border-hairline pt-10 sm:pt-14">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span aria-hidden="true" className="font-display text-5xl font-light leading-none text-marigold sm:text-7xl">
            {number}
          </span>
          <h3 id={`${id}-heading`} className="font-display text-4xl font-light text-ink sm:text-5xl">
            {name}
          </h3>
        </div>
        <p className="max-w-md text-base leading-relaxed text-muted">{blurb}</p>
      </div>

      <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.name}>
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="label text-muted">{service.number}</span>
              <h4 className="font-display text-2xl text-ink sm:text-[1.75rem]">{service.name}</h4>
            </div>
            <p className="mt-2 max-w-md text-base leading-relaxed text-muted">{service.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
