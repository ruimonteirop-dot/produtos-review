import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark, EASE } from "./Base";
import { scrollToId } from "../SmoothScroll";

const LINKS = [["destaque", "Destaque"], ["reviews", "Reviews"], ["metodo", "Método"], ["clube", "Newsletter"]];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      data-testid="header-navigation"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${scrolled ? "bg-[rgba(250,250,248,0.82)] backdrop-blur-xl border-b border-[var(--line)]" : "bg-transparent border-b border-transparent"}`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#topo" data-testid="header-logo" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg tracking-tight">Myg Reviews</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(([id, label]) => (
            <button key={id} data-testid={`nav-${id}`} onClick={() => scrollToId(id)} className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
              {label}
            </button>
          ))}
        </nav>
        <button data-testid="header-cta" onClick={() => scrollToId("destaque")} className="text-sm font-medium rounded-full border border-[var(--ink)] px-4 py-1.5 hover:bg-[var(--ink)] hover:text-white transition-colors">
          Última review
        </button>
      </div>
    </motion.header>
  );
};
