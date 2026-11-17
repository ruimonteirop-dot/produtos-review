import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FEATURED } from "../data/reviews";
import { Reveal, Eyebrow } from "./Reveal";
import { PriceButton } from "./PriceButton";

const Gallery = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-[var(--ink)] bg-[var(--ink)] aspect-[4/3] shadow-[8px_8px_0_var(--ink)]">
        {FEATURED.photos.map((p, i) => (
          <motion.img
            key={p.src}
            src={p.src}
            alt={`${FEATURED.name} — ${p.label}`}
            data-testid={`featured-photo-${i}`}
            initial={false}
            animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.08 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}
        <div className="absolute inset-0 spotlight-soft pointer-events-none" />
        <span className="absolute top-4 left-4 rounded-full bg-[var(--coral)] text-[var(--ink)] border-2 border-[var(--ink)] px-3 py-1 font-mono text-xs uppercase tracking-widest">
          {FEATURED.photos[active].label}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {FEATURED.photos.map((p, i) => (
          <button
            key={p.src}
            data-testid={`featured-thumb-${i}`}
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded-2xl border-[3px] border-[var(--ink)] aspect-[4/3] transition-transform duration-300 ${active === i ? "-translate-y-1 shadow-[4px_4px_0_var(--violet)]" : "opacity-70 hover:opacity-100"}`}
          >
            <img src={p.src} alt={p.label} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

const ScoreDial = () => {
  const pct = FEATURED.score / 10;
  return (
    <div data-testid="featured-score" className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" stroke="var(--ink)" strokeWidth="12" fill="var(--cream)" />
        <motion.circle
          cx="50" cy="50" r="42" stroke="var(--mint)" strokeWidth="8" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: pct }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        <div>
          <p className="font-display text-3xl font-black">{FEATURED.score.toFixed(1)}</p>
          <p className="font-mono text-[10px] uppercase mt-1">de 10</p>
        </div>
      </div>
    </div>
  );
};

const List = ({ items, good }) => (
  <ul className="space-y-2.5">
    {items.map((t) => (
      <li key={t} className="flex gap-3 items-start text-sm sm:text-base">
        <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border-2 border-[var(--ink)] grid place-items-center ${good ? "bg-[var(--mint)]" : "bg-[var(--coral)]"}`}>
          {good ? <Plus className="w-3.5 h-3.5" strokeWidth={3} /> : <Minus className="w-3.5 h-3.5" strokeWidth={3} />}
        </span>
        {t}
      </li>
    ))}
  </ul>
);

export const FeaturedReview = () => (
  <section id="destaque" data-testid="featured-review-ap25" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <Eyebrow color="var(--coral)">Review da semana</Eyebrow>
          <h2 className="font-display font-black tracking-tight text-4xl sm:text-6xl mt-4 leading-[0.95]">
            Ela suga o ar.<br />
            <span className="text-[var(--violet)]">Eu suguei as dúvidas.</span>
          </h2>
        </div>
        <p className="max-w-sm text-[var(--ink-soft)]">{FEATURED.summary}</p>
      </Reveal>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <Reveal className="lg:col-span-7"><Gallery /></Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="rounded-[2rem] border-[3px] border-[var(--ink)] bg-white p-6 sm:p-8 shadow-[8px_8px_0_var(--ink)]">
            <div className="flex items-center gap-5">
              <ScoreDial />
              <div>
                <span className="inline-block rounded-full bg-[var(--yellow)] border-2 border-[var(--ink)] px-3 py-0.5 font-mono text-[11px] uppercase tracking-widest">{FEATURED.verdict}</span>
                <h3 data-testid="featured-title" className="font-display text-2xl sm:text-3xl font-extrabold mt-2 leading-tight">{FEATURED.name}</h3>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)] mt-1">{FEATURED.category}</p>
              </div>
            </div>
            <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div><p className="font-display font-bold mb-3">O que eu amei</p><List items={FEATURED.pros} good /></div>
              <div><p className="font-display font-bold mb-3">O que me irritou</p><List items={FEATURED.cons} /></div>
            </div>
            <dl className="mt-7 grid grid-cols-2 gap-px rounded-2xl overflow-hidden border-2 border-[var(--ink)] bg-[var(--ink)]">
              {FEATURED.specs.map(([k, v]) => (
                <div key={k} className="bg-[var(--cream)] p-3">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-[var(--ink-soft)]">{k}</dt>
                  <dd className="text-sm font-semibold mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7">
              <PriceButton big url={FEATURED.priceUrl} testId="ver-preco-ap25-button" label="Ver preço da AP-25" />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
