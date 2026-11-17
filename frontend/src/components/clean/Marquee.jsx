import { MARQUEE } from "../../data/reviews";

const Row = ({ hidden }) => (
  <div className="flex shrink-0 items-center" aria-hidden={hidden}>
    {MARQUEE.map((t) => (
      <span key={t} className="flex items-center whitespace-nowrap font-display text-3xl sm:text-5xl tracking-tight px-8">
        {t}
        <span className="ml-16 w-2 h-2 rounded-full bg-[var(--accent)]" />
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="editorial-marquee" className="border-y border-[var(--line)] py-7 overflow-hidden">
    <div className="marquee-track flex w-max text-[var(--ink)]">
      <Row />
      <Row hidden />
    </div>
  </section>
);
