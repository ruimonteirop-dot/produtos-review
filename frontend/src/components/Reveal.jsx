import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 40 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ children, color = "var(--yellow)" }) => (
  <span className="inline-block rounded-full border-2 border-[var(--ink)] px-3 py-1 font-mono text-xs uppercase tracking-[0.18em]" style={{ background: color }}>
    {children}
  </span>
);
