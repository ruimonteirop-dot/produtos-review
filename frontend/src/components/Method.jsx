import { motion } from "framer-motion";
import { METHOD } from "../data/reviews";
import { Reveal, Eyebrow } from "./Reveal";

export const Method = () => (
  <section id="metodo" data-testid="methodology-section" className="relative py-24 sm:py-32 bg-[var(--ink)] text-[var(--cream)] rounded-[2.5rem] sm:rounded-[4rem] mx-2 sm:mx-4">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal className="grid lg:grid-cols-2 gap-8 mb-14 items-end">
        <div>
          <Eyebrow>Como eu avalio</Eyebrow>
          <h2 className="font-display font-black tracking-tight text-4xl sm:text-6xl mt-4 leading-[0.95]">
            Quatro regras.<br /><span className="text-[var(--yellow)]">Zero jabá.</span>
          </h2>
        </div>
        <p className="text-zinc-300 max-w-md lg:justify-self-end">Toda review segue o mesmo caminho, do carrinho ao veredito. Assim você compara produtos com a mesma régua.</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {METHOD.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.08}>
            <motion.div
              whileHover={{ rotate: i % 2 ? 2 : -2, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              data-testid={`method-step-${m.n}`}
              className="h-full rounded-[1.8rem] border-[3px] border-[var(--cream)] p-6 text-[var(--ink)]"
              style={{ background: m.color }}
            >
              <p className="font-display font-black text-6xl leading-none">{m.n}</p>
              <h3 className="font-display font-extrabold text-2xl mt-10">{m.title}</h3>
              <p className="mt-2 text-sm sm:text-base">{m.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
