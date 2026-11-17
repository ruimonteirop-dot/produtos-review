import { ArrowUp } from "lucide-react";
import { LogoMark } from "./Logo";
import { scrollToId } from "./SmoothScroll";
import { SITE } from "../data/reviews";

export const Footer = () => (
  <footer data-testid="site-footer" className="bg-[var(--ink)] text-[var(--cream)] pt-20 pb-10 overflow-hidden">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-10">
        <div className="max-w-sm">
          <LogoMark size={48} />
          <p className="mt-5 text-zinc-300">Reviews honestas de quem compra, usa e conta tudo. Alguns links são de afiliado: se você comprar por eles, eu posso ganhar uma comissão, sem custo extra pra você.</p>
        </div>
        <div className="flex gap-12 text-sm">
          <ul className="space-y-2">
            {["destaque", "reviews", "metodo", "clube"].map((id) => (
              <li key={id}><button data-testid={`footer-link-${id}`} onClick={() => scrollToId(id)} className="capitalize hover:text-[var(--yellow)] transition-colors">{id === "metodo" ? "Método" : id}</button></li>
            ))}
          </ul>
          <ul className="space-y-2 text-zinc-300">
            <li>{SITE.handle}</li>
            <li>{SITE.email}</li>
          </ul>
        </div>
        <button data-testid="back-to-top" onClick={() => scrollToId("topo")} className="w-14 h-14 rounded-full bg-[var(--yellow)] text-[var(--ink)] grid place-items-center border-2 border-[var(--cream)] hover:-translate-y-1 transition-transform" aria-label="Voltar ao topo">
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
      <p className="font-display font-black tracking-[-0.05em] leading-none text-[22vw] lg:text-[16rem] mt-14 text-[var(--violet)] select-none">Myg<span className="text-[var(--yellow)]">.</span></p>
      <p className="mt-4 font-mono text-xs text-zinc-400">© 2026 {SITE.name}. Todos os direitos reservados.</p>
    </div>
  </footer>
);
