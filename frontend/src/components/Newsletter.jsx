import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

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
      toast.success("Pronto! Você entrou pro Clube Myg.");
    } catch {
      setState("idle");
      toast.error("Confere o e-mail e tenta de novo.");
    }
  };

  return (
    <section id="clube" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border-[3px] border-[var(--ink)] bg-[var(--yellow)] p-8 sm:p-14 shadow-[10px_10px_0_var(--ink)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -right-16 -top-16 w-56 h-56 rounded-full border-[3px] border-dashed border-[var(--ink)] opacity-40"
            />
            <h2 className="relative font-display font-black tracking-tight text-4xl sm:text-6xl leading-[0.95]">Clube Myg.</h2>
            <p className="relative mt-4 max-w-md text-base sm:text-lg">Uma review nova por e-mail, só quando sai. Sem spam, sem corrente.</p>
            <form onSubmit={submit} className="relative mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                data-testid="newsletter-email-input"
                className="flex-1 rounded-full border-[3px] border-[var(--ink)] bg-[var(--cream)] px-6 py-4 font-medium outline-none focus:shadow-[4px_4px_0_var(--violet)] transition-shadow"
              />
              <motion.button
                type="submit"
                disabled={state === "loading"}
                whileHover={{ y: -3, x: -3 }}
                whileTap={{ scale: 0.96 }}
                data-testid="newsletter-submit-button"
                className="brut-btn inline-flex items-center justify-center gap-2 rounded-full bg-[var(--violet)] text-white px-8 py-4 font-bold disabled:opacity-70"
              >
                {state === "done" ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {state === "loading" ? "Enviando..." : state === "done" ? "Inscrito!" : "Quero entrar"}
              </motion.button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
