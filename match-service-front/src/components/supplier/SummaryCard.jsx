import { Link } from "react-router-dom";

const ICON_TONES = {
  warning: "bg-amber-500/15 text-amber-400",
  info: "bg-sky-500/15 text-sky-400",
  success: "bg-emerald-500/15 text-emerald-400",
  danger: "bg-red-500/15 text-red-400",
  orange: "bg-orange-soft text-orange",
};

/**
 * Card de resumo com ícone (referência visual). Com `to` vira link; com
 * `onClick` vira botão-filtro (`active` destaca em laranja, como o primeiro
 * card da referência); sem nenhum dos dois é só informativo.
 */
export default function SummaryCard({ to, onClick, active = false, icon: Icon, tone, label, value, hint, compact = false }) {
  const className = `flex w-full items-center rounded-[20px] border bg-surface-1 text-left transition ${
    compact ? "gap-3 p-3" : "gap-4 p-4"
  } ${
    active ? "border-orange" : "border-hairline"
  } ${to || onClick ? "hover:border-orange/60" : ""}`;

  const content = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${compact ? "h-10 w-10" : "h-12 w-12"} ${ICON_TONES[tone]}`}
      >
        <Icon width={compact ? 20 : 22} height={compact ? 20 : 22} />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-mono text-[11px] uppercase tracking-widest text-cream/55">
          {label}
        </span>
        <span className={`block font-display font-semibold text-cream ${compact ? "text-xl" : "text-2xl"}`}>{value}</span>
        {hint && <span className="block truncate text-xs text-cream/45">{hint}</span>}
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
