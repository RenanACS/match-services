import { useEffect, useState } from "react";
import { formatCurrency } from "./PaymentSummary";

const METHODS = [
  { id: "pix", label: "Pix", hint: "Pagamento instantâneo via chave Pix" },
  { id: "credit_card", label: "Cartão de crédito", hint: "Pagamento parcelado ou à vista" },
];

/**
 * Fluxo demonstrativo de "Pagar agora". NÃO realiza cobranças reais, não
 * gera QR Code Pix real e não coleta dados de cartão — é só a escolha do
 * método, seguida de um aviso deixando claro que o processamento de
 * verdade chega com a integração futura do gateway. O status do pagamento
 * nunca muda para "Pago" a partir daqui.
 *
 * Mesmo padrão de modal das outras telas: trava o scroll do fundo
 * enquanto aberto, fecha com X, Escape e clique no backdrop.
 */
export default function PaymentMethodModal({ payment, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    setSelectedMethod(null);
  }, [payment]);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-method-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[20px] border border-hairline bg-surface-1 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="payment-method-title" className="app-section-title text-cream">
              Pagar agora
            </h2>
            <p className="mt-1 app-text text-cream/70">
              {payment.service} · {formatCurrency(payment.amountCents)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-hairline text-cream/70 transition hover:border-orange/60 hover:text-orange"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 app-small text-cream/70">
          Forma de pagamento
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {METHODS.map((method) => {
            const active = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-orange bg-orange-soft"
                    : "border-hairline hover:border-orange/40"
                }`}
              >
                <span className={`app-text font-medium ${active ? "text-orange" : "text-cream"}`}>
                  {method.label}
                </span>
                <span className="app-small text-cream/70">{method.hint}</span>
              </button>
            );
          })}
        </div>

        {selectedMethod && (
          <div className="mt-4 rounded-xl border border-hairline bg-surface-2 px-4 py-3" role="status">
            <p className="app-small text-orange">
              Modo de demonstração
            </p>
            <p className="mt-1.5 app-text text-cream/70">
              Nenhuma cobrança foi realizada. O processamento real via{" "}
              {selectedMethod === "pix" ? "Pix" : "cartão de crédito"} estará disponível após a
              integração com o gateway de pagamento — o status deste pagamento continua{" "}
              <span className="text-cream/90">Pendente</span>.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl border border-hairline px-5 py-3 text-center app-button text-cream/70 transition hover:border-orange/60 hover:text-orange"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
