import { useRef, useState } from "react";
import { ImagePlus, X, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, errText, imgSrc } from "../../lib/api";

export const PhotoUploader = ({ photos, onChange }) => {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);

  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    const added = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const { data } = await api.post("/admin/upload", fd);
        added.push({ src: data.src, label: "" });
      } catch (e) {
        toast.error(`${file.name}: ${errText(e, "falhou o carregamento")}`);
      }
    }
    onChange([...photos, ...added]);
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  const setLabel = (i, label) => onChange(photos.map((p, j) => (j === i ? { ...p, label } : p)));
  const remove = (i) => onChange(photos.filter((_, j) => j !== i));
  const makeMain = (i) => onChange([photos[i], ...photos.filter((_, j) => j !== i)]);

  return (
    <div data-testid="photo-uploader">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((p, i) => (
          <div key={p.src + i} data-testid={`photo-item-${i}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--surface)]">
              <img src={imgSrc(p.src)} alt={p.label} className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-2 left-2 rounded-full bg-[var(--accent)] text-white text-[11px] px-2 py-0.5">Principal</span>}
              <div className="absolute top-2 right-2 flex gap-1">
                {i > 0 && (
                  <button type="button" data-testid={`photo-main-${i}`} onClick={() => makeMain(i)} aria-label="Tornar principal" className="w-7 h-7 rounded-full glass grid place-items-center">
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button type="button" data-testid={`photo-remove-${i}`} onClick={() => remove(i)} aria-label="Remover foto" className="w-7 h-7 rounded-full glass grid place-items-center">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <input value={p.label} onChange={(e) => setLabel(i, e.target.value)} placeholder="Legenda" data-testid={`photo-label-${i}`} className="mt-1.5 w-full bg-transparent text-xs py-1 border-b border-transparent focus:border-[var(--line)] outline-none" />
          </div>
        ))}
        <button
          type="button"
          data-testid="photo-add-button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="aspect-[4/3] rounded-xl border border-dashed border-[var(--line)] hover:border-[var(--ink)] grid place-items-center text-sm text-[var(--muted)] transition-colors"
        >
          <span className="flex flex-col items-center gap-2">
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
            {busy ? "A carregar…" : "Adicionar fotos"}
          </span>
        </button>
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden data-testid="photo-file-input" onChange={(e) => upload(Array.from(e.target.files || []))} />
    </div>
  );
};
