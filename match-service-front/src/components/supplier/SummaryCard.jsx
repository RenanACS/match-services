import { Link } from "react-router-dom";

const ICON_TONES = {
  warning: "text-amber-400",
  info: "text-sky-300",
  success: "text-emerald-400",
  danger: "text-red-400",
  orange: "text-orange",
};

/**
 * Card de resumo com ícone (referência visual). Com `to` vira link; com
 * `onClick` vira botão-filtro (`active` destaca em laranja, como o primeiro
 * card da referência); sem nenhum dos dois é só informativo.
 */
export default function SummaryCard({ to, onClick, active = false, icon: Icon, tone, label, value, hint, compact = false }) {
  const className = `flex min-h-[80px] w-full items-center gap-3 rounded-2xl border bg-surface-1 px-4 py-3 text-left transition ${
    active ? "border-orange" : "border-hairline"
  } ${to || onClick ? "hover:border-orange/60" : ""}`;

  const content = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 ${ICON_TONES[tone]}`}
      >
        <Icon width={18} height={18} />
      </span>
      <span className="min-w-0">
        <span className="app-small block truncate font-medium text-cream/70">
          {label}
        </span>
        <span className="app-stat-number block text-cream">{value}</span>
        {hint && <span className="app-small block truncate text-cream/70">{hint}</span>}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={className}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}
