import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import { api, errText } from "../../lib/api";
import { PhotoUploader } from "./PhotoUploader";

const lines = (t) => t.split("\n").map((s) => s.trim()).filter(Boolean);
const toSpecs = (t) => lines(t).map((l) => {
  const [label, ...rest] = l.split(":");
  return { label: label.trim(), value: rest.join(":").trim() };
}).filter((s) => s.label && s.value);

const init = (r) => ({
  name: r?.name || "", slug: r?.slug || "", category: r?.category || "", score: r?.score ?? "", tag: r?.tag || "",
  body: r?.body || "", vine: r?.vine ?? true,
  summary: r?.summary || "", pros: (r?.pros || []).join("\n"), cons: (r?.cons || []).join("\n"),
  specs: (r?.specs || []).map((s) => `${s.label}: ${s.value}`).join("\n"),
  photos: r?.photos || [], price_url: r?.price_url || "", published: r?.published ?? true, featured: r?.featured ?? false,
});

const inputCls = "w-full bg-transparent border-b border-[var(--line)] focus:border-[var(--ink)] py-2.5 outline-none transition-colors";

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</span>
    {children}
    {hint && <span className="block mt-1.5 text-xs text-[var(--muted)]">{hint}</span>}
  </label>
);

const Toggle = ({ id, label, desc, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-4 border-t border-[var(--line)]">
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-[var(--muted)] mt-0.5">{desc}</p>
    </div>
    <Switch data-testid={id} checked={checked} onCheckedChange={onChange} />
  </div>
);

export const ReviewForm = ({ review, categories, onSaved, onCancel }) => {
  const [f, setF] = useState(() => init(review));
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e?.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const body = { ...f, score: f.score === "" || f.score === null ? null : Number(f.score), pros: lines(f.pros), cons: lines(f.cons), specs: toSpecs(f.specs) };
    try {
      const { data } = review ? await api.put(`/admin/reviews/${review.id}`, body) : await api.post("/admin/reviews", body);
      toast.success(review ? "Alterações guardadas" : "Review criada");
      onSaved(data);
    } catch (err) {
      toast.error(errText(err, "Não foi possível guardar."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} data-testid="review-form" className="rounded-[24px] border border-[var(--line)] p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl tracking-tight">{review ? "Editar review" : "Nova review"}</h2>
        <button type="button" data-testid="form-cancel-button" onClick={onCancel} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">Fechar</button>
      </div>

      <div className="mt-8 space-y-7">
        <Field label="Fotos" hint="A primeira foto é a principal. Podes carregar várias de uma vez.">
          <div className="mt-3"><PhotoUploader photos={f.photos} onChange={set("photos")} /></div>
        </Field>
        <Field label="Nome do produto">
          <input data-testid="form-name-input" required value={f.name} onChange={set("name")} className={inputCls} placeholder="Ex.: Seladora a Vácuo AP-25" />
        </Field>
        <div className="grid sm:grid-cols-3 gap-7">
          <Field label="Categoria">
            <input data-testid="form-category-input" required list="cats" value={f.category} onChange={set("category")} className={inputCls} placeholder="Cozinha" />
            <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Nota (0 a 10)">
            <input data-testid="form-score-input" type="number" min="0" max="10" step="0.1" value={f.score ?? ""} placeholder="Por definir" onChange={set("score")} className={inputCls} />
          </Field>
          <Field label="Etiqueta">
            <input data-testid="form-tag-input" value={f.tag} onChange={set("tag")} className={inputCls} placeholder="Escolha do Myg" />
          </Field>
        </div>
        <Field label="Endereço da página" hint="Deixe vazio para gerar a partir do nome. Ex.: carehabi-ap-25-selador-de-vacuo">
          <input data-testid="form-slug-input" value={f.slug} onChange={set("slug")} className={inputCls} placeholder="gerado automaticamente" />
        </Field>
        <Field label="Resumo">
          <textarea data-testid="form-summary-input" rows={3} value={f.summary} onChange={set("summary")} className={`${inputCls} resize-none`} placeholder="O veredicto em duas ou três frases." />
        </Field>
        <div className="grid sm:grid-cols-2 gap-7">
          <Field label="Prós" hint="Um por linha.">
            <textarea data-testid="form-pros-input" rows={4} value={f.pros} onChange={set("pros")} className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Contras" hint="Um por linha.">
            <textarea data-testid="form-cons-input" rows={4} value={f.cons} onChange={set("cons")} className={`${inputCls} resize-none`} />
          </Field>
        </div>
        <Field label="Texto da review" hint="## Título de secção, ### Subtítulo, - item de lista, **negrito**. Linha em branco separa parágrafos.">
          <textarea data-testid="form-body-input" rows={16} value={f.body} onChange={set("body")} className={`${inputCls} font-mono text-sm`} />
        </Field>
        <Field label="Ficha técnica" hint="Uma por linha, no formato  Característica: Valor">
          <textarea data-testid="form-specs-input" rows={4} value={f.specs} onChange={set("specs")} className={`${inputCls} resize-none`} placeholder={"Modelo: AP-25\nPotência: 110 W"} />
        </Field>
        <Field label="Link “Ver preço”" hint="Link da loja ou de afiliado.">
          <input data-testid="form-price-url-input" type="url" value={f.price_url} onChange={set("price_url")} className={inputCls} placeholder="https://" />
        </Field>
        <div>
          <Toggle id="form-vine-switch" label="Recebido via Amazon Vine" desc="Mostra a divulgação do Vine na página da review." checked={f.vine} onChange={set("vine")} />
          <Toggle id="form-published-switch" label="Publicada" desc="Desliga para guardar como rascunho." checked={f.published} onChange={set("published")} />
          <Toggle id="form-featured-switch" label="Review em destaque" desc="Aparece no topo do site. Só pode haver uma." checked={f.featured} onChange={set("featured")} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button data-testid="form-save-button" disabled={busy} className="rounded-full bg-[var(--ink)] text-[var(--on-ink)] px-6 py-3 text-sm font-medium hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-60">
          {busy ? "A guardar…" : review ? "Guardar alterações" : "Publicar review"}
        </button>
      </div>
    </form>
  );
};
