import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { Star, ArrowDown } from "lucide-react";
import { FEATURED } from "../data/reviews";
import { scrollToId } from "./SmoothScroll";

const EASE = [0.22, 1, 0.36, 1];
const LINES = [
  { text: "Review", cls: "" },
  { text: "sem", cls: "text-[var(--violet)] italic" },
  { text: "enrolação.", cls: "hero-outline" },
];

const MaskLine = ({ children, i, className }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span
      className={`block ${className}`}
      initial={{ y: "110%", rotate: 4 }}
      animate={{ y: "0%", rotate: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.35 + i * 0.14 }}
    >
      {children}
    </motion.span>
  </span>
);

const TiltCard = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 14 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };
  return (
    <div style={{ perspective: 1200 }} onMouseMove={onMove} onMouseLeave={reset} className="relative">
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: -3 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
        data-testid="hero-tilt-card"
        className="relative rounded-[2.2rem] border-[3px] border-[var(--ink)] bg-[var(--violet)] p-3 shadow-[10px_10px_0_var(--ink)]"
      >
        <div className="relative overflow-hidden rounded-[1.6rem] aspect-[4/5] bg-[var(--ink)]">
          <img src={FEATURED.photos[0].src} alt="Seladora a vácuo AP-25 fora da caixa" className="absolute inset-0 w-full h-full object-cover object-[88%_50%]" />
          <div className="absolute inset-0 spotlight" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between" style={{ transform: "translateZ(50px)" }}>
            <div className="rounded-2xl bg-[var(--cream)] border-2 border-[var(--ink)] px-3 py-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Review nova</p>
              <p className="font-display font-extrabold leading-tight">{FEATURED.name}</p>
            </div>
          </div>
        </div>
        <div
          className="absolute -top-7 -right-6 w-24 h-24 rounded-full bg-[var(--yellow)] border-[3px] border-[var(--ink)] grid place-items-center shadow-[4px_4px_0_var(--ink)]"
          style={{ transform: "translateZ(80px)" }}
          data-testid="hero-score-badge"
        >
          <div className="text-center leading-none">
            <p className="font-display text-3xl font-black">{FEATURED.score.toFixed(1)}</p>
            <p className="font-mono text-[10px] uppercase mt-1">nota</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yCard = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} id="topo" data-testid="hero-section" className="relative overflow-hidden pt-32 sm:pt-40 pb-20 sm:pb-28 dots-bg">
      <div className="blob bg-[var(--coral)] w-72 h-72 -left-24 top-40" />
      <div className="blob bg-[var(--mint)] w-80 h-80 right-[-6rem] bottom-0" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
        <motion.div style={{ y: yText }} className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-white px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em]"
          >
            <Star className="w-3.5 h-3.5 fill-[var(--yellow)]" /> Reviews independentes
          </motion.p>
          <h1 data-testid="hero-title" className="font-display font-black tracking-[-0.04em] leading-[0.88] text-[15vw] sm:text-[6.5rem] lg:text-[8.2rem] mt-6">
            {LINES.map((l, i) => (
              <MaskLine key={l.text} i={i} className={l.cls}>{l.text}</MaskLine>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7, ease: EASE }}
            className="mt-8 max-w-lg text-base sm:text-lg text-[var(--ink-soft)]"
          >
            Eu compro, uso de verdade e te conto se vale cada centavo. Nota, prós, contras e o link pro melhor preço.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <motion.button
              data-testid="hero-primary-cta"
              onClick={() => scrollToId("reviews")}
              whileHover={{ y: -3, x: -3 }}
              whileTap={{ scale: 0.97 }}
              className="brut-btn rounded-full bg-[var(--yellow)] px-7 py-4 font-bold"
            >
              Ver todas as reviews
            </motion.button>
            <button data-testid="hero-secondary-cta" onClick={() => scrollToId("destaque")} className="group inline-flex items-center gap-2 font-semibold">
              <span className="w-11 h-11 rounded-full border-2 border-[var(--ink)] grid place-items-center group-hover:bg-[var(--ink)] group-hover:text-[var(--cream)] transition-colors">
                <ArrowDown className="w-4 h-4" />
              </span>
              Review da semana
            </button>
          </motion.div>
        </motion.div>
        <motion.div style={{ y: yCard }} className="lg:col-span-5 max-w-sm sm:max-w-md mx-auto w-full px-4 sm:px-0">
          <TiltCard />
        </motion.div>
      </div>
    </section>
  );
};
