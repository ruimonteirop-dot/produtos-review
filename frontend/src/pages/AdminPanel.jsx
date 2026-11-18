import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ExternalLink, LogOut } from "lucide-react";
import { toast } from "sonner";
import { api, errText } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { LogoMark } from "../components/clean/Base";
import { ThemeToggle } from "../components/clean/ThemeToggle";
import { ReviewList } from "../components/admin/ReviewList";
import { ReviewForm } from "../components/admin/ReviewForm";

export default function AdminPanel() {
  const { logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const formRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/reviews");
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(errText(e, "Não foi possível carregar as reviews."));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const open = (review) => {
    setEditing(review || "new");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const onSaved = (saved) => {
    setEditing(saved);
    load();
  };

  const onDelete = async (r) => {
    try {
      await api.delete(`/admin/reviews/${r.id}`);
      toast.success("Review apagada");
      if (editing?.id === r.id) setEditing(null);
      load();
    } catch (e) {
      toast.error(errText(e));
    }
  };

  const categories = [...new Set(reviews.map((r) => r.category))];

  return (
    <div data-testid="admin-panel" className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg tracking-tight">Painel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" data-testid="admin-view-site" className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full hover:bg-[var(--surface)]">
              Ver site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <ThemeToggle />
            <button data-testid="admin-logout-button" onClick={logout} aria-label="Terminar sessão" className="w-9 h-9 rounded-full border border-[var(--line)] grid place-items-center hover:border-[var(--ink)]">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-14 grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-5 min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{reviews.length} reviews</p>
              <h1 className="font-display text-3xl sm:text-4xl tracking-tight mt-2">As tuas reviews</h1>
            </div>
            <button data-testid="new-review-button" onClick={() => open(null)} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] text-[var(--on-ink)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--accent)] hover:text-white transition-colors">
              <Plus className="w-4 h-4" /> Nova review
            </button>
          </div>
          <ReviewList reviews={reviews} activeId={editing?.id} onEdit={open} onDelete={onDelete} />
        </section>

        <section ref={formRef} className="lg:col-span-7 min-w-0 scroll-mt-20">
          {editing ? (
            <ReviewForm key={editing === "new" ? "new" : editing.id} review={editing === "new" ? null : editing} categories={categories} onSaved={onSaved} onCancel={() => setEditing(null)} />
          ) : (
            <div data-testid="editor-empty-state" className="rounded-[24px] border border-dashed border-[var(--line)] p-10 sm:p-16 text-center">
              <p className="font-display text-2xl tracking-tight">Escolhe uma review para editar</p>
              <p className="mt-2 text-sm text-[var(--muted)]">ou cria uma nova com o botão “Nova review”.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
