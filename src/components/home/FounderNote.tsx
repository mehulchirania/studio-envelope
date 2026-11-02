import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/content/site";

/** Short note on the founder for the home page: portrait, role, name, one paragraph and a link to /about. */
export default function FounderNote() {
  return (
    <section className="band-bone">
      <div className="container-x grid gap-10 py-14 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-2 lg:max-w-md">
          <Image
            src="/images/site/prachi-chirania.jpg"
            alt="Portrait of Prachi Chirania"
            fill
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="object-cover object-[50%_30%]"
          />
        </div>

        <div>
          <p className="label text-muted">{site.principal.role}</p>
          <h2 className="mt-4 font-display text-[clamp(32px,3.4vw,52px)] font-light leading-tight text-ink">{site.principal.name}</h2>
          <p className="mt-6 max-w-[62ch] text-base leading-7 text-muted [hyphens:manual] [text-wrap:pretty]">{site.principal.bio[1]}</p>
          <Link href="/about" className="link-arrow mt-8 inline-flex">
            About the studio <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
