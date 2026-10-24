import { useEffect } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { PAYMENT_STATUS, PAYMENT_METHOD_LABELS } from "../../data/payments";
import { formatCurrency } from "./PaymentSummary";
import { formatPaymentDate } from "./PaymentList";

/**
 * Painel de detalhes do pagamento, em modal. Mostra só os campos já
 * disponíveis nos dados mockados (identificação, serviço, empresa, valor,
 * data, status e método, quando houver) — sem sugerir que existe mais
 * informação persistida em algum backend.
 *
 * Trava o scroll da página de fundo enquanto está aberto (padrão comum de
 * modal, não um "overflow:hidden" para mascarar conteúdo cortado) e
 * restaura ao fechar. Fecha pelo botão X e pela tecla Escape.
 */
export default function PaymentDetailsModal({ payment, onClose, onPayNow }) {
  useEffect(() => {
    if (!payment) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [payment, onClose]);

  if (!payment) return null;

  const status = PAYMENT_STATUS[payment.status];
  const methodLabel = payment.method ? PAYMENT_METHOD_LABELS[payment.method] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-details-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[20px] border border-hairline bg-surface-1 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="payment-details-title" className="app-section-title text-cream">
            {payment.service}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-hairline text-cream/70 transition hover:border-orange/60 hover:text-orange"
          >
            ✕
          </button>
        </div>

        <dl className="mt-5 flex flex-col gap-4">
          <div>
            <dt className="app-small text-cream/70">Identificação</dt>
            <dd className="mt-1 app-text text-cream/80">{payment.id}</dd>
          </div>
          <div>
            <dt className="app-small text-cream/70">Empresa prestadora</dt>
            <dd className="mt-1 app-text text-cream/80">{payment.company}</dd>
          </div>
          <div>
            <dt className="app-small text-cream/70">Valor</dt>
            <dd className="mt-1 app-text text-cream/80">{formatCurrency(payment.amountCents)}</dd>
          </div>
          <div>
            <dt className="app-small text-cream/70">Data</dt>
            <dd className="mt-1 app-text text-cream/80">{formatPaymentDate(payment.date)}</dd>
          </div>
          <div>
            <dt className="app-small text-cream/70">Status</dt>
            <dd className="mt-1.5">
              <Badge variant={status.variant} appearance="app">{status.label}</Badge>
            </dd>
          </div>
          {methodLabel && (
            <div>
              <dt className="app-small text-cream/70">Método de pagamento</dt>
              <dd className="mt-1 app-text text-cream/80">{methodLabel}</dd>
            </div>
          )}
        </dl>

        {payment.status === "pending" && (
          <Button appearance="app"
            type="button"
            variant="primary"
            size="md"
            className="mt-6 w-full"
            onClick={() => onPayNow(payment)}
          >
            Pagar agora
          </Button>
        )}

        <p className="mt-4 app-small text-cream/70">
          Dados de demonstração. O acompanhamento completo do pagamento chega com a integração futura.
        </p>
      </div>
    </div>
  );
}
