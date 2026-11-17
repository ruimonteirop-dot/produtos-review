import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, REVIEWS } from "../../data/reviews";
import { Reveal, Label, PriceButton, EASE } from "./Base";

const SPANS = ["md:col-span-2 md:row-span-2", "md:col-span-2", "md:col-span-1", "md:col-span-1"];

const Card = ({ r, i }) => (
  <motion.article
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: EASE }}
    data-testid={`review-card-${r.id}`}
    className={`group relative overflow-hidden rounded-[24px] bg-[#e9e8e4] min-h-[320px] ${SPANS[i] || ""}`}
  >
    <img src={r.img} alt={r.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
    <div className="absolute top-4 left-4 right-4 flex justify-between">
      <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-[0.16em]">{r.category}</span>
      <span data-testid={`review-score-${r.id}`} className="rounded-full bg-white/90 backdrop-blur px-3 py-1 font-display text-sm">{r.score.toFixed(1)}</span>
    </div>
    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-wrap items-end justify-between gap-3 text-white">
      <div>
        <p className="text-xs text-white/80">{r.tag}</p>
        <h3 className={`font-display tracking-tight mt-1 ${i === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>{r.title}</h3>
      </div>
      <PriceButton url={r.priceUrl} testId={`ver-preco-${r.id}`} dark={false} />
    </div>
  </motion.article>
);

export const ReviewsGrid = () => {
  const [cat, setCat] = useState("Todos");
  const list = cat === "Todos" ? REVIEWS : REVIEWS.filter((r) => r.category === cat);
  return (
    <section id="reviews" className="py-24 sm:py-36 border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-8 mb-12">
          <div>
            <Label n="02">Últimas reviews</Label>
            <h2 className="font-display tracking-[-0.03em] text-4xl sm:text-6xl mt-6 leading-[1.02]">Testei, notei <em className="font-serif text-[var(--muted)]">e contei.</em></h2>
          </div>
          <div data-testid="category-filter-buttons" className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] p-1">
            {CATEGORIES.map((c) => (
              <button key={c} data-testid={`filter-${c.toLowerCase()}`} onClick={() => setCat(c)} className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${cat === c ? "text-white" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}>
                {cat === c && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-[var(--ink)]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <motion.div layout data-testid="reviews-bento-grid" className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[300px] gap-4">
          <AnimatePresence>{list.map((r, i) => <Card key={r.id} r={r} i={i} />)}</AnimatePresence>
        </motion.div>
        <p className="mt-6 text-xs text-[var(--muted)]">Reviews de exemplo. Troque pelos seus produtos no arquivo de dados.</p>
      </div>
    </section>
  );
};
