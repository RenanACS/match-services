import Icon from "../AdminIcons";
import { REQUEST_CATEGORIES, requestCategory, stageLabel } from "../../../services/adminRequests";

const TONES = {
  amber: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  blue: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  green: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  red: "border-red-500/30 bg-red-500/15 text-red-400",
};

/** Status resumido (lista): ícone + rótulo, na cor do estado. */
export function RequestStatusBadge({ category, label, className = "" }) {
  const meta = REQUEST_CATEGORIES[category];
  return (
    <span className={`adm-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 ${TONES[meta.tone]} ${className}`}>
      <Icon name={meta.icon} size={14} />
      {label ?? meta.label}
    </span>
  );
}

/** Status exato do estágio (cabeçalho dos detalhes). */
export function StageBadge({ request, className = "" }) {
  return <RequestStatusBadge category={requestCategory(request.stage)} label={stageLabel(request)} className={className} />;
}

export const BANNER_TONES = {
  amber: { box: "border-amber-500/30 bg-amber-500/10", title: "text-amber-400", pill: "border-amber-500/30 bg-amber-500/15 text-amber-400", icon: "clock" },
  orange: { box: "border-orange/30 bg-orange-soft", title: "text-orange", pill: "border-orange/40 bg-orange-soft text-orange", icon: "clock" },
  red: { box: "border-red-500/30 bg-red-500/10", title: "text-red-400", pill: "border-red-500/30 bg-red-500/15 text-red-400", icon: "info" },
  green: { box: "border-emerald-500/30 bg-emerald-500/10", title: "text-emerald-400", pill: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400", icon: "checkCircle" },
};
