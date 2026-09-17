import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero({ image }: { image: string }) {
  return (
    <section className="new-hero">
      <div className="hero-topline"><span>Independent architecture & design studio</span><span>Based in India. Thinking beyond.</span></div>
      <div className="hero-stage">
        <div className="hero-type"><p className="micro-label"><span className="orange-dot" /> Spaces for the way you live</p><h1>BEYOND<br />FOUR<br /><span>WALLS.</span></h1><div className="hero-bottom"><p>Architecture. Interiors. Experiences.<br />Considered from the inside out.</p><a href="#selected" aria-label="Discover selected projects" className="round-arrow"><ArrowDown size={22} /></a></div></div>
        <div className="hero-scene">{image && <Image src={image} alt="Sunlight falling across a thoughtfully composed living space" fill priority sizes="(max-width: 700px) 100vw, 60vw" className="object-cover" />}<div className="scene-caption"><span>Light. Texture. A sense of place.</span><span>01 / A design perspective</span></div><Link href="/projects" className="orange-note"><ArrowUpRight size={28} /><span>Step inside<br />our work</span></Link></div>
      </div>
      <div className="discipline-strip"><span>Art</span><i>+</i><span>Architecture</span><i>+</i><span>Interior design</span><i>+</i><span>Everyday life</span></div>
    </section>
  );
}
