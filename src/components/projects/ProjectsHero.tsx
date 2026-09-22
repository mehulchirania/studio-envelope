import RevealText from "@/components/motion/RevealText";
import Counter from "@/components/motion/Counter";
import Seal from "@/components/Seal";

/** Dark opening band for /projects: big title, small label and a "0N
 * projects" counter. Sits flush above the filter chip row (also band-dark,
 * rendered by ProjectsFilter) so the two read as one continuous hero. */
export default function ProjectsHero({ total }: { total: number }) {
  return (
    <div className="band-dark relative flex min-h-[56svh] flex-col justify-end overflow-hidden pt-32 sm:pt-40">
      <div className="container-x pb-10 sm:pb-12">
        <p className="label mb-6 text-mist">Projects</p>
        <h1 className="display-xl max-w-5xl text-bone">
          <RevealText text="Homes, written with care." />
        </h1>
        <div className="mt-8 flex items-center gap-3">
          <Seal tone="dark" />
          <span className="label text-mist">
            <Counter to={total} prefix="0" /> projects
          </span>
        </div>
      </div>
    </div>
  );
}
