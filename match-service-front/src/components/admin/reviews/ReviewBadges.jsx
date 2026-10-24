import Icon from "../AdminIcons";
import { REVIEW_STATUSES } from "../../../services/adminReviews";

const TONES = {
  green: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  amber: "border-amber-500/30 bg-amber-500/15 text-amber-400",
};

/** Situação da avaliação: Publicada / Ocultada. */
export default function ReviewStatusBadge({ status, className = "" }) {
  const meta = REVIEW_STATUSES[status];
  return (
    <span className={`adm-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 ${TONES[meta.tone]} ${className}`}>
      <Icon name={meta.icon} size={14} />
      {meta.label}
    </span>
  );
}
