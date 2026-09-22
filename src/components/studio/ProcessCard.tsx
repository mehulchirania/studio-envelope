type ProcessCardProps = {
  number: string;
  title: string;
  text: string;
};

/** A tall card used inside the process HorizontalGallery — number, title,
 * text, on the night band. */
export default function ProcessCard({ number, title, text }: ProcessCardProps) {
  return (
    <div className="flex h-[62vh] min-h-[420px] flex-col justify-between border border-hairline-light bg-teal/15 p-8 sm:p-10">
      <span className="font-display text-6xl font-light text-marigold sm:text-7xl">{number}</span>
      <div>
        <h3 className="h2 text-[clamp(28px,3vw,44px)] text-bone">{title}</h3>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-mist">{text}</p>
      </div>
    </div>
  );
}
