import { ArrowUp } from "lucide-react";
import { LogoMark } from "./Base";
import { scrollToId } from "../SmoothScroll";
import { SITE, DISCLOSURE_AFFILIATE } from "../../data/reviews";

const LINKS = [["destaque", "Destaque"], ["reviews", "Reviews"], ["metodo", "Método"], ["clube", "Newsletter"]];

export const Footer = () => (
  <footer data-testid="site-footer" className="border-t border-[var(--line)] pt-16 pb-10">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5"><LogoMark /><span className="font-display text-lg">Myg Reviews</span></div>
          <p id="divulgacao" className="mt-5 max-w-sm text-sm text-[var(--muted)] leading-relaxed">{DISCLOSURE_AFFILIATE} Alguns produtos são recebidos gratuitamente através do programa Amazon Vine, e isso é indicado em cada review.</p>
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
          <button data-testid="back-to-top" onClick={() => scrollToId("topo")} aria-label="Voltar ao topo" className="w-11 h-11 rounded-full border border-[var(--line)] grid place-items-center hover:bg-[var(--ink)] hover:text-[var(--on-ink)] transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="font-display tracking-[-0.05em] leading-none text-[19vw] lg:text-[15rem] mt-16 select-none">Myg<span className="text-[var(--accent)]">.</span></p>
      <p className="mt-6 text-xs text-[var(--muted)]">© 2026 {SITE.name}. Todos os direitos reservados. · <a href="/admin" data-testid="footer-admin-link" className="hover:text-[var(--ink)]">Painel</a></p>
    </div>
  </footer>
);
