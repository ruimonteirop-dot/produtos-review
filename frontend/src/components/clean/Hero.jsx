import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { FALLBACK_PHOTO } from "../../data/reviews";
import { imgSrc } from "../../lib/api";
import { EASE } from "./Base";
import { scrollToId } from "../SmoothScroll";

const LINES = ["Reviews honestas,", <>sem <em className="font-serif font-normal text-[var(--accent)]">rodeios.</em></>];

const MaskLine = ({ children, i }) => (
  <span className="block overflow-hidden pb-[0.1em]">
    <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.15 }}>
      {children}
    </motion.span>
  </span>
);

const Photo = ({ featured }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 80, damping: 18 });
  const ry = useSpring(mx, { stiffness: 80, damping: 18 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    my.set(((e.clientY - r.top) / r.height - 0.5) * -6);
  };
  return (
    <div style={{ perspective: 1400 }} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div
        ref={ref}
        data-testid="hero-tilt-card"
        style={{ rotateX: rx, rotateY: ry }}
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
        className="relative overflow-hidden rounded-[28px] bg-[var(--surface)] aspect-[4/5]"
      >
        <motion.img style={{ y, scale: 1.18 }} src={imgSrc(featured?.photos?.[0]?.src) || FALLBACK_PHOTO} alt={featured?.name || "Produto em destaque"} className="absolute inset-0 w-full h-full object-cover object-[86%_50%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
        {featured && (
          <div data-testid="hero-score-badge" className="absolute left-4 right-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl glass px-4 py-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Review nova</p>
              <p className="font-display text-base truncate">{featured.name}</p>
            </div>
            <p className="font-display text-3xl">{Number(featured.score).toFixed(1)}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const Hero = ({ featured }) => (
  <section id="topo" data-testid="hero-section" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-12 gap-14 lg:gap-16 items-end">
      <div className="lg:col-span-7">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          Testado em casa · Sem publicidade paga
        </motion.p>
        <h1 data-testid="hero-title" className="font-display tracking-[-0.035em] leading-[0.98] text-[12vw] sm:text-7xl lg:text-[6.4rem] mt-6">
          {LINES.map((l, i) => <MaskLine key={i} i={i}>{l}</MaskLine>)}
        </h1>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: EASE }}>
          <p className="mt-8 max-w-md text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Eu compro, uso a sério e digo-te se vale cada cêntimo. Nota, prós, contras e o link para o melhor preço.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button data-testid="hero-primary-cta" onClick={() => scrollToId("reviews")} className="rounded-full bg-[var(--ink)] text-[var(--on-ink)] px-7 py-3.5 text-sm font-medium hover:bg-[var(--accent)] hover:text-white transition-colors duration-300">
              Ver todas as reviews
            </button>
            <button data-testid="hero-secondary-cta" onClick={() => scrollToId("destaque")} className="group inline-flex items-center gap-2 text-sm font-medium">
              Review da semana
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      </div>
      <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
        <Photo featured={featured} />
      </div>
    </div>
  </section>
);
