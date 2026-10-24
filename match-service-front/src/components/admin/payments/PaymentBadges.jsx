import Icon from "../AdminIcons";
import { PAYMENT_STATUSES } from "../../../services/adminPayments";

export const PAYMENT_TONES = {
  amber: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  blue: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  green: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  teal: "border-teal-500/30 bg-teal-500/15 text-teal-300",
  red: "border-red-500/30 bg-red-500/15 text-red-400",
};

/** Situação do pagamento: ícone + rótulo, na cor do estado (12px, Inter). */
export function PaymentStatusBadge({ status, className = "" }) {
  const meta = PAYMENT_STATUSES[status];
  return (
    <span className={`adm-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 ${PAYMENT_TONES[meta.tone]} ${className}`}>
      <Icon name={meta.icon} size={14} />
      {meta.label}
    </span>
  );
}

/** Etiqueta "Previsto" / "Efetivado": diferencia valor previsto de valor efetivo. */
export function ValueTag({ children = "Previsto", effective = false, className = "" }) {
  return (
    <span
      className={`adm-small inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-1.5 py-px font-medium ${
        effective ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-amber-500/25 bg-amber-500/10 text-amber-400"
      } ${className}`}
    >
      {children}
    </span>
  );
}
