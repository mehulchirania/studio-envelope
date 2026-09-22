import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import Seal from "@/components/Seal";
import { site } from "@/lib/site";

/** Night principal band: the principal's name as a giant reveal, a short
 * factual note (no fabricated claims), and a link to the studio page. */
export default function PrincipalBand() {
  return (
    <section className="band-dark">
      <div className="container-x section-y">
        <Seal tone="dark" />
        <p className="label mt-6 text-mist">{site.principal.role}</p>
        <h2 className="display-xl mt-4 max-w-5xl text-bone">
          <RevealText as="span" text={site.principal.name} />
        </h2>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-mist">
          {site.principal.name} leads the Bangalore studio. Her work spans residential interiors and
          architecture across Bangalore, Ballari and Pune.
        </p>
        <Link href="/about" className="link-arrow mt-8 text-bone">
          About the studio <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
