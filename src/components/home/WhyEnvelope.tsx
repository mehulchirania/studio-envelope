import Image from "next/image";
import clsx from "clsx";
import { site } from "@/lib/content/site";

type WhyEnvelopeProps = {
  image: { src: string; alt: string };
  /** Hide the section heading where the page already has an h1 with the same words. */
  hideHeading?: boolean;
  tone?: "dark" | "bone";
  /** Stacked (mobile) layout: show the copy before the photo, so it isn't pushed a full screen down. */
  textFirstOnMobile?: boolean;
};

/** "Why an Envelope?": the studio's approach beside one photograph. Two columns from lg, stacked below.
 * The paragraphs sit in ONE left aligned column (never CSS multi columns, which split them unevenly). */
export default function WhyEnvelope({ image, hideHeading = false, tone = "dark", textFirstOnMobile = false }: WhyEnvelopeProps) {
  const dark = tone === "dark";
  return (
    <section className={dark ? "band-dark" : "band-bone"}>
      <div className={clsx("container-x grid gap-10 lg:grid-cols-2 lg:gap-20", textFirstOnMobile ? "py-10 sm:py-14 lg:items-start" : "py-14 sm:py-24 lg:items-center")}>
        <div className={clsx("relative aspect-[4/5] overflow-hidden bg-paper-2", textFirstOnMobile && "order-last lg:order-none")}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>

        <div>
          {!hideHeading && (
            <h2 className={clsx("font-display text-[clamp(36px,4vw,56px)] font-light leading-none", dark ? "text-bone" : "text-ink")}>
              {site.whyEnvelope.heading}
            </h2>
          )}
          <div
            className={clsx(
              "max-w-[62ch] space-y-6 text-justify text-base leading-7 [hyphens:auto] sm:text-left sm:[hyphens:manual] sm:[text-wrap:pretty]",
              !hideHeading && "mt-8 sm:mt-10",
              dark ? "text-mist" : "text-muted",
            )}
          >
            {site.whyEnvelope.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
