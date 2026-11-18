import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "myg-theme";

export const ThemeToggle = ({ className = "" }) => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark]);
  return (
    <button
      data-testid="theme-toggle-button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className={`relative w-9 h-9 rounded-full border border-[var(--line)] grid place-items-center hover:border-[var(--ink)] transition-colors ${className}`}
    >
      <Sun className={`w-4 h-4 absolute transition-all duration-500 ${dark ? "opacity-0 rotate-90 scale-50" : "opacity-100"}`} />
      <Moon className={`w-4 h-4 absolute transition-all duration-500 ${dark ? "opacity-100" : "opacity-0 -rotate-90 scale-50"}`} />
    </button>
  );
};
