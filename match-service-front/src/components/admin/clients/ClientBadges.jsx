const STATUS_STYLES = {
  active: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  blocked: "border-red-500/30 bg-red-500/15 text-red-400",
};
const STATUS_LABELS = { active: "Ativo", blocked: "Bloqueado" };

export function ClientStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 adm-small font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ClientTypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-hairline bg-surface-2 px-2.5 py-1 adm-small font-medium text-cream/80">
      {type}
    </span>
  );
}

const REQUEST_STYLES = {
  neutral: "border-hairline text-cream/70",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  danger: "border-red-500/30 bg-red-500/10 text-red-400",
};

/** Status de solicitação em texto normal (sem caixa alta), alinhado aos demais badges. */
export function RequestStatusBadge({ label, variant }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 adm-small font-medium ${REQUEST_STYLES[variant]}`}
    >
      {label}
    </span>
  );
}
