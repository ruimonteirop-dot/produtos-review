import { ArrowUp } from "lucide-react";
import { LogoMark } from "./Base";
import { scrollToId } from "../SmoothScroll";
import { SITE } from "../../data/reviews";

const LINKS = [["destaque", "Destaque"], ["reviews", "Reviews"], ["metodo", "Método"], ["clube", "Newsletter"]];

export const Footer = () => (
  <footer data-testid="site-footer" className="border-t border-[var(--line)] pt-16 pb-10">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5"><LogoMark /><span className="font-display text-lg">Myg Reviews</span></div>
          <p className="mt-5 max-w-sm text-sm text-[var(--muted)] leading-relaxed">Alguns links são de afiliado: se você comprar por eles, eu posso ganhar uma comissão, sem custo extra pra você.</p>
        </div>
        <ul className="md:col-span-3 space-y-2 text-sm">
          {LINKS.map(([id, label]) => (
            <li key={id}><button data-testid={`footer-link-${id}`} onClick={() => scrollToId(id)} className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors">{label}</button></li>
          ))}
        </ul>
        <ul className="md:col-span-3 space-y-2 text-sm text-[var(--muted)]">
          <li>{SITE.handle}</li>
          <li>{SITE.email}</li>
        </ul>
        <div className="md:col-span-1 md:justify-self-end">
          <button data-testid="back-to-top" onClick={() => scrollToId("topo")} aria-label="Voltar ao topo" className="w-11 h-11 rounded-full border border-[var(--line)] grid place-items-center hover:bg-[var(--ink)] hover:text-white transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="font-display tracking-[-0.05em] leading-none text-[19vw] lg:text-[15rem] mt-16 select-none">Myg<span className="text-[var(--accent)]">.</span></p>
      <p className="mt-6 text-xs text-[var(--muted)]">© 2026 {SITE.name}. Todos os direitos reservados.</p>
    </div>
  </footer>
);
