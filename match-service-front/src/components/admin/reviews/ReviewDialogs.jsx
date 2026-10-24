import { useState } from "react";
import { Link } from "react-router-dom";
import AdminDialog, { DialogTextarea } from "../AdminDialog";
import AdminButton from "../AdminButton";
import RatingStars from "./RatingStars";
import ReviewStatusBadge from "./ReviewBadges";
import { MIN_REASON } from "../../../services/adminReviews";
import { formatDate, formatDateTime } from "../../../utils/dates";

const DEMO_NOTE = "Moderação demonstrativa: fica guardada apenas neste navegador, não é enviada a nenhum servidor.";

/** Avaliação completa (somente leitura) com o histórico de moderação. */
export function ViewReviewDialog({ review, onModerate, onClose }) {
  const hidden = review.status === "hidden";
  return (
    <AdminDialog title="Avaliação completa" icon="star" wide onClose={onClose}>
      <dl className="grid grid-cols-2 gap-3">
        <div><dt className="adm-small text-cream/70">Cliente</dt><dd className="adm-text mt-0.5 text-cream">{review.author}</dd></div>
        <div><dt className="adm-small text-cream/70">Data</dt><dd className="adm-text mt-0.5 text-cream">{formatDate(review.date)}</dd></div>
        <div className="min-w-0">
          <dt className="adm-small text-cream/70">Fornecedor</dt>
          <dd className="adm-text mt-0.5 truncate"><Link to={`/admin/fornecedores/${review.supplierId}`} className="text-cream hover:text-orange hover:underline">{review.supplier.name}</Link></dd>
        </div>
        <div><dt className="adm-small text-cream/70">Situação</dt><dd className="mt-0.5"><ReviewStatusBadge status={review.status} /></dd></div>
        <div className="col-span-2"><dt className="adm-small text-cream/70">Nota</dt><dd className="mt-1"><RatingStars value={review.rating} size={18} /></dd></div>
      </dl>
      <div className="mt-3">
        <p className="adm-small text-cream/70">Comentário</p>
        <p className="adm-text mt-1 rounded-xl border border-hairline bg-surface-2/60 px-3 py-2.5 text-cream/90">{review.comment}</p>
      </div>
      <p className="adm-small mt-2 text-cream/70">A nota e o comentário pertencem ao cliente: o administrador não pode editá-los, apenas ocultar ou restaurar a avaliação.</p>

      {review.moderation.length > 0 && (
        <div className="mt-3">
          <p className="adm-small text-cream/70">Histórico de moderação</p>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {review.moderation.map((m, i) => (
              <li key={`${m.date}-${i}`} className="rounded-lg border border-hairline px-3 py-2">
                <p className="adm-text text-cream/90"><span className="font-medium">{m.action === "hide" ? "Ocultada" : "Restaurada"}</span>{m.reason ? `: ${m.reason}` : "."}</p>
                <p className="adm-small text-cream/70">{formatDateTime(m.date)} · {m.by}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <AdminButton variant="secondary" onClick={onClose}>Fechar</AdminButton>
        <AdminButton variant={hidden ? "success" : "danger"} onClick={() => onModerate(review)}>
          {hidden ? "Restaurar avaliação" : "Ocultar avaliação"}
        </AdminButton>
      </div>
    </AdminDialog>
  );
}

/** Ocultar: confirmação com justificativa obrigatória. */
export function HideReviewDialog({ review, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const value = reason.trim();
    if (!value) return setError("Informe a justificativa da ocultação.");
    if (value.length < MIN_REASON) return setError(`Descreva a justificativa com ao menos ${MIN_REASON} caracteres.`);
    onConfirm(value);
  }
  return (
    <AdminDialog title="Ocultar avaliação" icon="eyeOff" tone="red" description={`A avaliação de ${review.author} sobre ${review.supplier.name} deixará de ser publicada e não entrará na média pública.`} onClose={onClose}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-3">
        <DialogTextarea id="hide-reason" label="Justificativa da moderação" required value={reason} onChange={setReason} error={error} placeholder="Explique por que a avaliação será ocultada." />
        <p className="adm-small text-cream/70">{DEMO_NOTE}</p>
        <div className="flex flex-wrap justify-end gap-2">
          <AdminButton variant="secondary" type="button" onClick={onClose}>Cancelar</AdminButton>
          <AdminButton variant="danger" type="submit">Ocultar avaliação</AdminButton>
        </div>
      </form>
    </AdminDialog>
  );
}

/** Restaurar: confirmação (justificativa opcional). */
export function RestoreReviewDialog({ review, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  return (
    <AdminDialog title="Restaurar avaliação" icon="refresh" tone="green" description={`A avaliação de ${review.author} sobre ${review.supplier.name} voltará a ser publicada e entrará na média pública.`} onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); onConfirm(reason); }} className="flex flex-col gap-3">
        <DialogTextarea id="restore-reason" label="Justificativa (opcional)" value={reason} onChange={setReason} placeholder="Registre o motivo da restauração, se quiser." />
        <p className="adm-small text-cream/70">{DEMO_NOTE}</p>
        <div className="flex flex-wrap justify-end gap-2">
          <AdminButton variant="secondary" type="button" onClick={onClose}>Cancelar</AdminButton>
          <AdminButton variant="success" type="submit">Restaurar avaliação</AdminButton>
        </div>
      </form>
    </AdminDialog>
  );
}
