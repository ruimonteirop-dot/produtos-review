import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

export const Label = ({ children, n }) => (
  <p className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
    {n && <span className="text-[var(--ink)]">{n}</span>}
    <span className="h-px w-8 bg-[var(--line)]" />
    {children}
  </p>
);

export const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="11" fill="#111111" />
    <path d="M11 27V14l4.5 6.5L20 14l4.5 6.5L29 14v13" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="31.5" cy="8.5" r="3.5" fill="#5B3DF5" />
  </svg>
);

export const PriceButton = ({ url, testId, label = "Ver preço", dark = true }) => {
  const onClick = (e) => {
    if (!url || url === "#") {
      e.preventDefault();
      toast("Link de oferta ainda não configurado", { description: "Adicione o link da loja ou de afiliado no arquivo de reviews." });
    }
  };
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={onClick}
      data-testid={testId}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${dark ? "bg-[var(--ink)] text-white hover:bg-[var(--accent)]" : "bg-white text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white"}`}
    >
      {label}
      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
};
