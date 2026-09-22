import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Seal from "@/components/Seal";
import ScrollWords from "@/components/motion/ScrollWords";

const STATEMENT =
  "Our studio delivers spaces that are thoughtful and personal, much like the cherished messages enclosed in an envelope — cohesive spaces with innovative design solutions that blend creativity, precision and purpose, wrapped with love and passion.";

/** Night statement band: the studio's conceptual note as a scroll-linked
 * paragraph, each word brightening from mist to bone as it passes through
 * the viewport (see ScrollWords). */
export default function StatementBand() {
  return (
    <section className="band-dark">
      <div className="container-x section-y">
        <Seal tone="dark" />
        <ScrollWords
          text={STATEMENT}
          className="mt-8 max-w-[26ch] font-display text-[clamp(26px,3.6vw,46px)] font-light leading-[1.15] sm:max-w-[30ch]"
        />
        <Link href="/about" className="link-arrow mt-10 text-bone">
          Our story <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
