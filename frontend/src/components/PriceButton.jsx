import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export const PriceButton = ({ url, testId, label = "Ver preço", big = false }) => {
  const onClick = (e) => {
    if (!url || url === "#") {
      e.preventDefault();
      toast("Link de oferta ainda não configurado", { description: "Adicione o seu link de loja ou afiliado no arquivo de reviews." });
    }
  };
  return (
    <motion.a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={onClick}
      data-testid={testId}
      whileHover={{ y: -3, x: -3 }}
      whileTap={{ y: 0, x: 0, scale: 0.97 }}
      className={`brut-btn inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-[var(--cream)] font-bold ${big ? "px-7 py-4 text-base" : "px-4 py-2 text-sm"}`}
    >
      {label}
      <ArrowUpRight className={big ? "w-5 h-5" : "w-4 h-4"} />
    </motion.a>
  );
};
