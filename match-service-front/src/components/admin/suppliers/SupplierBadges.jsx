import { SUPPLIER_STATUS_LABELS } from "../../../data/adminSuppliers";

const STYLES = {
  review: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  active: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  blocked: "border-red-500/30 bg-red-500/15 text-red-400",
  rejected: "border-zinc-400/30 bg-zinc-400/15 text-zinc-300",
};

/** Em análise (amarelo) · Ativo (verde) · Bloqueado (vermelho) · Rejeitado (cinza). */
export function SupplierStatusBadge({ status, className = "" }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 adm-small font-medium ${STYLES[status]} ${className}`}
    >
      {SUPPLIER_STATUS_LABELS[status]}
    </span>
  );
}

/** Tile claro com as iniciais da empresa (no lugar do logotipo do protótipo). */
export function SupplierAvatar({ name, size = "md" }) {
  const initials = name
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
  const box = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm xl:h-9 xl:w-9 xl:text-xs";
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-lg bg-cream font-display font-bold text-ink ${box}`}
    >
      {initials}
    </span>
  );
}
