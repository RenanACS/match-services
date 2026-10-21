import Badge from "../ui/Badge";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
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
    <li className="flex flex-col gap-2 px-4 py-3 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0 xl:w-56 xl:shrink-0">
        <h3 className="app-text truncate font-medium text-cream">{payment.service}</h3>
        <p className="app-small mt-0.5 truncate text-cream/50">{payment.company}</p>
      </div>

      <div className="flex items-baseline gap-2 whitespace-nowrap xl:w-60 xl:shrink-0">
        <span className="app-text font-semibold text-cream">{formatCurrency(payment.amountCents)}</span>
        <span className="app-small text-cream/50">{formatPaymentDate(payment.date)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 xl:shrink-0">
        <Badge variant={status.variant} appearance="app">{status.label}</Badge>
        {payment.status === "pending" && (
          <button
            type="button"
            onClick={() => onPayNow(payment)}
            className="app-button inline-flex items-center gap-1.5 rounded-lg border border-orange/40 bg-orange-soft px-3 py-1 text-orange transition hover:bg-orange/20"
          >
            Pagar agora
          </button>
        )}
        <button
          type="button"
          onClick={() => onViewDetails(payment)}
          className="app-text inline-flex items-center gap-1.5 text-cream/60 transition hover:text-orange"
        >
          Ver detalhes
          <Icon name="arrowRight" size={14} />
        </button>
      </div>
    </li>
  );
}

/**
 * Listagem compacta dos pagamentos (linhas), 3 por página. `pageData` vem de
 * utils/paginate. Estado vazio quando a busca/filtro não encontra nada.
 */
export default function PaymentList({ payments, pageData, onPageChange, onViewDetails, onPayNow }) {
  if (pageData.total === 0) {
    return (
      <div className="rounded-[20px] border border-hairline bg-surface-1 px-6 py-8 text-center">
        <p className="app-text text-cream/60">Nenhum pagamento encontrado para essa busca ou filtro.</p>
      </div>
    );
  }

  return (
    <section aria-label="Lista de pagamentos" className="rounded-[20px] border border-hairline bg-surface-1">
      <ul className="divide-y divide-hairline">
        {payments.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} onViewDetails={onViewDetails} onPayNow={onPayNow} />
        ))}
      </ul>
      <div className="border-t border-hairline">
        <Pagination
          page={pageData.page}
          totalPages={pageData.totalPages}
          total={pageData.total}
          start={pageData.start}
          pageSize={pageData.pageSize}
          itemLabel="pagamentos"
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
