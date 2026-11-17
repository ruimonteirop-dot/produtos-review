import { useState } from "react";
import axios from "axios";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Label } from "./Base";

const API = process.env.REACT_APP_BACKEND_URL;

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    if (!API) return toast.error("Inscrição indisponível no momento.");
    setState("loading");
    try {
      await axios.post(`${API}/api/newsletter`, { email });
      setState("done");
      setEmail("");
      toast.success("Pronto! Você vai receber a próxima review.");
    } catch {
      setState("idle");
      toast.error("Confira o e-mail e tente de novo.");
    }
  };

  return (
    <section id="clube" className="py-24 sm:py-36 border-t border-[var(--line)]">
      <Reveal className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <div className="flex justify-center"><Label n="04">Newsletter</Label></div>
        <h2 className="font-display tracking-[-0.03em] text-4xl sm:text-6xl mt-6 leading-[1.02]">A próxima review, <em className="font-serif text-[var(--muted)] whitespace-nowrap">no seu e-mail.</em></h2>
        <p className="mt-5 text-[var(--muted)]">Só quando sai review nova. Sem spam.</p>
        <form onSubmit={submit} className="mt-10 flex items-center gap-2 border-b border-[var(--ink)] max-w-lg mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            data-testid="newsletter-email-input"
            className="flex-1 bg-transparent py-4 text-base sm:text-lg outline-none placeholder:text-[#9a9890]"
          />
          <button type="submit" disabled={state === "loading"} data-testid="newsletter-submit-button" className="group inline-flex items-center gap-2 py-4 text-sm font-medium disabled:opacity-60">
            {state === "loading" ? "Enviando..." : state === "done" ? "Inscrito" : "Inscrever"}
            {state === "done" ? <Check className="w-4 h-4 text-[var(--accent)]" /> : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
      </Reveal>
    </section>
  );
};
