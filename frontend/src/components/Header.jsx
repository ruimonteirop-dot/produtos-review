import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { scrollToId } from "./SmoothScroll";

const LINKS = [
  ["destaque", "Destaque"],
  ["reviews", "Reviews"],
  ["metodo", "Método"],
  ["clube", "Clube"],
];

export const Header = () => (
  <motion.header
    initial={{ y: -80 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    data-testid="header-navigation"
    className="fixed top-3 inset-x-3 sm:inset-x-6 z-50"
  >
    <div className="mx-auto max-w-7xl flex items-center justify-between rounded-full border-[2.5px] border-[var(--ink)] bg-[rgba(255,248,236,0.88)] backdrop-blur-xl px-4 sm:px-6 py-2.5 shadow-[4px_4px_0_var(--ink)]">
      <Logo />
      <nav className="hidden md:flex items-center gap-1">
        {LINKS.map(([id, label]) => (
          <button
            key={id}
            data-testid={`nav-${id}`}
            onClick={() => scrollToId(id)}
            className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-[var(--yellow)] transition-colors"
          >
            {label}
          </button>
        ))}
      </nav>
      <button
        data-testid="header-cta"
        onClick={() => scrollToId("destaque")}
        className="rounded-full bg-[var(--violet)] text-white text-sm font-bold px-4 py-2 border-2 border-[var(--ink)] hover:-translate-y-0.5 transition-transform"
      >
        Última review
      </button>
    </div>
  </motion.header>
);
