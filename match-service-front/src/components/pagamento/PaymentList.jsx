import Badge from "../ui/Badge";
import { PAYMENT_STATUS } from "../../data/payments";
import { formatCurrency } from "./PaymentSummary";

export function formatPaymentDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PaymentRow({ payment, onViewDetails, onPayNow }) {
  const status = PAYMENT_STATUS[payment.status];

  return (
    <li className="flex flex-col gap-2 px-5 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:py-2">
      <div className="min-w-0 xl:w-56 xl:shrink-0">
        <h3 className="truncate font-display text-base font-medium text-cream xl:text-sm">
          {payment.service}
        </h3>
        <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-widest text-cream/45">
          {payment.company}
        </p>
      </div>

      <div className="flex items-baseline gap-2 whitespace-nowrap xl:w-60 xl:shrink-0">
        <span className="font-display text-sm font-semibold text-cream">
          {formatCurrency(payment.amountCents)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
          {formatPaymentDate(payment.date)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 xl:shrink-0">
        <Badge variant={status.variant}>{status.label}</Badge>
        {payment.status === "pending" && (
          <button
            type="button"
            onClick={() => onPayNow(payment)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-orange/40 bg-orange-soft px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-orange transition hover:bg-orange/20"
          >
            Pagar agora
          </button>
        )}
        <button
          type="button"
          onClick={() => onViewDetails(payment)}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
        >
          Ver detalhes →
        </button>
      </div>
    </li>
  );
}

/**
 * Listagem compacta dos pagamentos (linhas, não cards altos). Mostra o
 * estado vazio quando a busca/filtro não encontra nenhum resultado entre
 * os dados mockados de `payments`.
 */
export default function PaymentList({ payments, onViewDetails, onPayNow }) {
  if (payments.length === 0) {
    return (
      <div className="rounded-[20px] border border-hairline bg-surface-1 px-6 py-10 text-center">
        <p className="text-sm text-cream/60">
          Nenhum pagamento encontrado para essa busca ou filtro.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-hairline overflow-hidden rounded-[20px] border border-hairline bg-surface-1">
      {payments.map((payment) => (
        <PaymentRow key={payment.id} payment={payment} onViewDetails={onViewDetails} onPayNow={onPayNow} />
      ))}
    </ul>
  );
}
