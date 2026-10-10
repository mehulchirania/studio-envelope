type ProcessStepProps = {
  number: string;
  title: string;
  text: string;
};

/** One step of the working process: its number, title and a sentence. */
export default function ProcessStep({ number, title, text }: ProcessStepProps) {
  return (
    <li className="border-t border-hairline-light pt-6">
      <span className="font-display text-4xl font-light text-marigold sm:text-5xl">{number}</span>
      <h3 className="mt-4 font-display text-2xl text-bone sm:text-3xl">{title}</h3>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-mist">{text}</p>
    </li>
  );
}
