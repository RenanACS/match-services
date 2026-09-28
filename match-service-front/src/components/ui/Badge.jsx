const VARIANTS = {
  neutral: "border-hairline text-cream/70",
  orange: "border-orange/40 bg-orange-soft text-orange",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  danger: "border-red-500/30 bg-red-500/10 text-red-400",
};

/**
 * Badge/status. Usado com moderação — não é para virar o padrão de todo
 * botão (a landing já usa pill nos CTAs; aqui é só para status/labels).
 */
export default function Badge({ variant = "neutral", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
