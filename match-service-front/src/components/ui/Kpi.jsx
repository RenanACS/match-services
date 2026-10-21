import Icon from "./Icon";

const TONES = {
  orange: "text-orange",
  amber: "text-amber-400",
  blue: "text-sky-300",
  green: "text-emerald-400",
  red: "text-red-400",
};

/**
 * Cartão de indicador ÚNICO da área do cliente (mesmo padrão do Admin): rótulo em cima (12px), valor embaixo
 * (Space Grotesk 20px) e um ícone pequeno e discreto à direita. Sem legenda
 * abaixo do número. Altura compacta (~80px). Todos os KPIs da área usam
 * este componente; `onClick` o transforma em atalho de filtro (botão).
 */
export default function Kpi({ icon, tone = "orange", label, value, active, onClick, as }) {
  const base =
    "flex min-h-[80px] min-w-0 flex-col justify-center gap-1.5 rounded-2xl border bg-surface-1 px-4 py-3 text-left transition";
  const state = active ? "border-orange/70 bg-orange-soft/40" : "border-hairline";
  const body = (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="app-small min-w-0 truncate font-medium text-cream/70">{label}</span>
        {icon && <Icon name={icon} size={16} className={`shrink-0 ${TONES[tone] ?? TONES.orange}`} />}
      </span>
      <span className="app-stat-number block truncate whitespace-nowrap text-cream">{value}</span>
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={`${base} ${state} hover:border-orange/40`}>
        {body}
      </button>
    );
  }
  const Tag = as ?? "div";
  return <Tag className={`${base} ${state}`}>{body}</Tag>;
}
