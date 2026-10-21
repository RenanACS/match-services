import Icon from "../AdminIcons";
import { DISPUTE_STATUSES } from "../../../services/adminDisputes";

const TONES = {
  amber: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  blue: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  green: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
};

/** Situação da contestação: badge discreto com ícone (12px, Inter). */
export default function DisputeStatusBadge({ status, className = "" }) {
  const meta = DISPUTE_STATUSES[status];
  return (
    <span className={`adm-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 ${TONES[meta.tone]} ${className}`}>
      <Icon name={meta.icon} size={14} />
      {meta.label}
    </span>
  );
}
