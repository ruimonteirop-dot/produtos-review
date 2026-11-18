import { formatScore } from "../../data/reviews";
import { Pencil, Trash2, Star } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "../ui/alert-dialog";
import { imgSrc } from "../../lib/api";

const Badge = ({ children, accent }) => (
  <span className={`rounded-full px-2 py-0.5 text-[11px] ${accent ? "bg-[var(--accent)] text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}>{children}</span>
);

const DeleteButton = ({ review, onDelete }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button data-testid={`delete-review-${review.id}`} aria-label="Apagar" className="w-9 h-9 rounded-full grid place-items-center hover:bg-red-500/10 hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Apagar “{review.name}”?</AlertDialogTitle>
        <AlertDialogDescription>A review sai do site e não pode ser recuperada.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel data-testid="delete-cancel-button">Cancelar</AlertDialogCancel>
        <AlertDialogAction data-testid="delete-confirm-button" onClick={() => onDelete(review)} className="bg-red-600 hover:bg-red-700">Apagar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const ReviewList = ({ reviews, activeId, onEdit, onDelete }) => (
  <ul data-testid="admin-review-list" className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
    {reviews.map((r) => (
      <li key={r.id} data-testid={`admin-review-${r.id}`} className={`flex items-center gap-4 py-4 px-2 -mx-2 rounded-xl transition-colors ${activeId === r.id ? "bg-[var(--surface)]" : ""}`}>
        <button onClick={() => onEdit(r)} className="flex flex-1 min-w-0 items-center gap-4 text-left">
          <div className="w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-[var(--surface)]">
            {r.photos?.[0]?.src && <img src={imgSrc(r.photos[0].src)} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{r.name}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-[var(--muted)] mr-1">{r.category} · {formatScore(r.score)}</span>
              {r.featured && <Badge accent><Star className="inline w-3 h-3 -mt-0.5" /> Destaque</Badge>}
              <Badge>{r.published ? "Publicada" : "Rascunho"}</Badge>
            </div>
          </div>
        </button>
        <button data-testid={`edit-review-${r.id}`} onClick={() => onEdit(r)} aria-label="Editar" className="w-9 h-9 rounded-full grid place-items-center hover:bg-[var(--surface)]">
          <Pencil className="w-4 h-4" />
        </button>
        <DeleteButton review={r} onDelete={onDelete} />
      </li>
    ))}
    {reviews.length === 0 && <li className="py-10 text-center text-sm text-[var(--muted)]">Ainda não há reviews.</li>}
  </ul>
);
