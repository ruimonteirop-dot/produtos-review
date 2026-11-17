import { METHOD } from "../../data/reviews";
import { Reveal, Label } from "./Base";

export const Method = () => (
  <section id="metodo" data-testid="methodology-section" className="py-24 sm:py-36 border-t border-[var(--line)]">
    <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-12 gap-12">
      <Reveal className="lg:col-span-5">
        <Label n="03">Como eu avalio</Label>
        <h2 className="font-display tracking-[-0.03em] text-4xl sm:text-6xl mt-6 leading-[1.02]">Quatro regras, <em className="font-serif text-[var(--muted)]">zero jabá.</em></h2>
        <p className="mt-6 max-w-sm text-[var(--muted)] leading-relaxed">Toda review segue o mesmo caminho, do carrinho ao veredito. Assim você compara produtos com a mesma régua.</p>
      </Reveal>
      <div className="lg:col-span-6 lg:col-start-7">
        {METHOD.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.06}>
            <div data-testid={`method-step-${m.n}`} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-[var(--line)] py-7 last:border-b">
              <span className="font-display text-sm text-[var(--muted)] pt-1.5 group-hover:text-[var(--accent)] transition-colors">{m.n}</span>
              <div>
                <h3 className="font-display text-2xl tracking-tight transition-transform duration-500 group-hover:translate-x-1">{m.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{m.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
