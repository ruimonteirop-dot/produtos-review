import { Asterisk } from "lucide-react";
import { MARQUEE } from "../data/reviews";

const Row = ({ hidden }) => (
  <div className="flex shrink-0 items-center" aria-hidden={hidden}>
    {MARQUEE.map((t) => (
      <span key={t} className="flex items-center font-display font-black text-4xl sm:text-6xl tracking-tight px-6 whitespace-nowrap">
        {t}
        <Asterisk className="ml-12 w-10 h-10 text-[var(--yellow)]" strokeWidth={3} />
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="editorial-marquee" className="relative py-4 -rotate-[1.5deg] my-6">
    <div className="bg-[var(--violet)] text-[var(--cream)] border-y-[3px] border-[var(--ink)] py-5 overflow-hidden">
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  </section>
);
