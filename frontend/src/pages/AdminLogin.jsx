import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { errText } from "../lib/api";
import { LogoMark } from "../components/clean/Base";
import { ThemeToggle } from "../components/clean/ThemeToggle";

const field = "w-full bg-transparent border-b border-[var(--line)] focus:border-[var(--ink)] py-3 outline-none transition-colors";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(errText(err, "Não foi possível entrar."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-5 sm:px-8">
      <div className="h-16 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" data-testid="login-back-link" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ink)]">
          <ArrowLeft className="w-4 h-4" /> Voltar ao site
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex-1 grid place-items-center">
        <form onSubmit={submit} data-testid="admin-login-form" className="w-full max-w-sm">
          <LogoMark size={40} />
          <h1 className="font-display text-4xl tracking-tight mt-8">Painel <em className="font-serif text-[var(--muted)]">Myg.</em></h1>
          <p className="text-sm text-[var(--muted)] mt-2">Inicia sessão para publicar e editar reviews.</p>
          <label className="block mt-10 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Email</label>
          <input data-testid="login-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="username" />
          <label className="block mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Palavra-passe</label>
          <input data-testid="login-password-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} autoComplete="current-password" />
          {error && <p data-testid="login-error" className="mt-4 text-sm text-red-500">{error}</p>}
          <button data-testid="login-submit-button" disabled={busy} className="mt-10 w-full rounded-full bg-[var(--ink)] text-[var(--on-ink)] py-3.5 text-sm font-medium hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-60">
            {busy ? "A entrar…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
