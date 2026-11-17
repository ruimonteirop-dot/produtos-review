import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, REVIEWS } from "../data/reviews";
import { Reveal, Eyebrow } from "./Reveal";
import { PriceButton } from "./PriceButton";

const SPANS = ["md:col-span-2 md:row-span-2", "md:col-span-2", "md:col-span-1", "md:col-span-1"];

const Card = ({ r, i }) => (
  <motion.article
    layout
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.94 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6 }}
    data-testid={`review-card-${r.id}`}
    className={`group relative overflow-hidden rounded-[1.8rem] border-[3px] border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] min-h-[320px] ${SPANS[i] || ""}`}
    style={{ background: r.color }}
  >
    <img src={r.img} alt={r.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,20,20,0.85)] via-[rgba(20,20,20,0.15)] to-transparent" />
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
      <span className="rounded-full border-2 border-[var(--ink)] px-3 py-1 font-mono text-[11px] uppercase tracking-widest" style={{ background: r.color }}>{r.tag}</span>
      <span data-testid={`review-score-${r.id}`} className="w-14 h-14 rounded-full bg-[var(--cream)] border-[3px] border-[var(--ink)] grid place-items-center font-display font-black text-lg group-hover:rotate-12 transition-transform">
        {r.score.toFixed(1)}
      </span>
    </div>
    <div className="absolute bottom-0 inset-x-0 p-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--cream)]/80">{r.category}</p>
        <h3 className={`font-display font-extrabold text-[var(--cream)] leading-tight ${i === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>{r.title}</h3>
      </div>
      <PriceButton url={r.priceUrl} testId={`ver-preco-${r.id}`} />
    </div>
  </motion.article>
);

export const ReviewsBento = () => {
  const [cat, setCat] = useState("Todos");
  const list = cat === "Todos" ? REVIEWS : REVIEWS.filter((r) => r.category === cat);
  return (
    <section id="reviews" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <Eyebrow color="var(--mint)">Últimas reviews</Eyebrow>
            <h2 className="font-display font-black tracking-tight text-4xl sm:text-6xl mt-4 leading-[0.95]">Testei. Notei.<br />Te contei.</h2>
          </div>
          <div data-testid="category-filter-buttons" className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                data-testid={`filter-${c.toLowerCase()}`}
                onClick={() => setCat(c)}
                className={`relative rounded-full border-2 border-[var(--ink)] px-4 py-2 text-sm font-bold transition-colors ${cat === c ? "text-[var(--cream)]" : "bg-white hover:bg-[var(--yellow)]"}`}
              >
                {cat === c && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-[var(--ink)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <motion.div layout data-testid="reviews-bento-grid" className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[300px] gap-5">
          <AnimatePresence>
            {list.map((r, i) => <Card key={r.id} r={r} i={i} />)}
          </AnimatePresence>
        </motion.div>
        <p className="mt-6 font-mono text-xs text-[var(--ink-soft)]">* Reviews de exemplo — troque pelos seus produtos no arquivo de dados.</p>
      </div>
    </section>
  );
};
