import { useMemo, useState } from "react";
import PaymentSummary from "../../components/pagamento/PaymentSummary";
import PaymentToolbar from "../../components/pagamento/PaymentToolbar";
import PaymentList from "../../components/pagamento/PaymentList";
import PaymentDetailsModal from "../../components/pagamento/PaymentDetailsModal";
import PaymentMethodModal from "../../components/pagamento/PaymentMethodModal";
import { payments } from "../../data/payments";

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Pagamentos (/app/pagamento).
 * Reaproveita `payments`/`PAYMENT_STATUS` de src/data/payments.js — nenhuma
 * base de dados nova. Busca e filtro de status rodam inteiramente no
 * front-end sobre esses registros mockados; "Ver detalhes" abre um modal
 * com os campos já disponíveis, e "Pagar agora" (só em pagamentos
 * pendentes) abre um fluxo demonstrativo de escolha de método — sem
 * cobrança real e sem alterar o status para "Pago".
 *
 * Segue a mesma filosofia single-screen de Minhas Solicitações: os
 * espaçamentos só ficam mais compactos a partir de `xl` (1280px+), para
 * caber em uma única viewport em 1366x768/1280x720/1440x900/1920x1080 sem
 * rolagem; no mobile/tablet o empilhamento e o scroll natural são
 * preservados.
 */
export default function Pagamento() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payingPayment, setPayingPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    const term = normalize(query.trim());
    return payments.filter((payment) => {
      const matchesQuery =
        !term ||
        normalize(payment.service).includes(term) ||
        normalize(payment.company).includes(term);
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  function handlePayNow(payment) {
    setSelectedPayment(null);
    setPayingPayment(payment);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 xl:gap-3">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between xl:gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl xl:text-2xl">
            Pagamentos
          </h1>
          <p className="mt-2 max-w-xl text-base text-cream/60 xl:mt-1 xl:text-sm">
            Gerencie os pagamentos dos seus serviços contratados.
          </p>
        </div>
      </header>

      <PaymentSummary />

      <PaymentToolbar
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <PaymentList payments={filteredPayments} onViewDetails={setSelectedPayment} onPayNow={handlePayNow} />

      <PaymentDetailsModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onPayNow={handlePayNow}
      />

      <PaymentMethodModal payment={payingPayment} onClose={() => setPayingPayment(null)} />
    </div>
  );
}
