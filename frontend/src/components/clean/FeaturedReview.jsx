import { useState } from "react";
import { motion } from "framer-motion";
import { FEATURED } from "../../data/reviews";
import { Reveal, Label, PriceButton, EASE } from "./Base";

const Gallery = () => {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative overflow-hidden rounded-[24px] bg-[#e9e8e4] aspect-[4/3]">
        {FEATURED.photos.map((p, i) => (
          <motion.img
            key={p.src}
            src={p.src}
            alt={`${FEATURED.name} — ${p.label}`}
            data-testid={`featured-photo-${i}`}
            initial={false}
            animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.05 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {FEATURED.photos.map((p, i) => (
          <button
            key={p.src}
            data-testid={`featured-thumb-${i}`}
            onClick={() => setActive(i)}
            className={`w-20 sm:w-24 aspect-[4/3] overflow-hidden rounded-xl transition-opacity duration-300 ring-offset-2 ring-offset-[var(--bg)] ${active === i ? "ring-1 ring-[var(--ink)]" : "opacity-50 hover:opacity-100"}`}
          >
            <img src={p.src} alt={p.label} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
        <span className="ml-auto text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{FEATURED.photos[active].label}</span>
      </div>
    </div>
  );
};

const List = ({ title, items, sign }) => (
  <div>
    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-3">{title}</p>
    <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((t) => (
        <li key={t} className="flex gap-4 py-3 text-sm sm:text-[15px]">
          <span className={sign === "+" ? "text-[var(--accent)]" : "text-[var(--muted)]"}>{sign}</span>
          {t}
        </li>
      ))}
    </ul>
  </div>
);

export const FeaturedReview = () => (
  <section id="destaque" data-testid="featured-review-ap25" className="py-24 sm:py-36">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal className="grid lg:grid-cols-12 gap-8 mb-14">
        <div className="lg:col-span-7">
          <Label n="01">Review da semana</Label>
          <h2 className="font-display tracking-[-0.03em] text-4xl sm:text-6xl mt-6 leading-[1.02]">
            Ela tira o ar. <em className="font-serif text-[var(--muted)]">Eu tirei as dúvidas.</em>
          </h2>
        </div>
        <p className="lg:col-span-4 lg:col-start-9 self-end text-[var(--muted)] leading-relaxed">{FEATURED.summary}</p>
      </Reveal>
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <Reveal className="lg:col-span-7"><Gallery /></Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{FEATURED.verdict}</p>
              <h3 data-testid="featured-title" className="font-display text-2xl sm:text-3xl mt-2 tracking-tight">{FEATURED.name}</h3>
            </div>
            <p data-testid="featured-score" className="font-display text-6xl tracking-tight leading-none">
              {FEATURED.score.toFixed(1)}<span className="text-base text-[var(--muted)]">/10</span>
            </p>
          </div>
          <div className="mt-8 space-y-8">
            <List title="Prós" items={FEATURED.pros} sign="+" />
            <List title="Contras" items={FEATURED.cons} sign="−" />
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
            {FEATURED.specs.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{k}</dt>
                <dd className="text-sm mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10"><PriceButton url={FEATURED.priceUrl} testId="ver-preco-ap25-button" label="Ver preço da AP-25" /></div>
        </Reveal>
      </div>
    </div>
  </section>
);
