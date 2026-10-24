import { useMemo, useState } from "react";
import PaymentSummary from "../../components/pagamento/PaymentSummary";
import PaymentToolbar from "../../components/pagamento/PaymentToolbar";
import PaymentList from "../../components/pagamento/PaymentList";
import PaymentDetailsModal from "../../components/pagamento/PaymentDetailsModal";
import PaymentMethodModal from "../../components/pagamento/PaymentMethodModal";
import { payments } from "../../data/payments";
import { paginate, PAGE_SIZE } from "../../utils/paginate";

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

 * Visual no padrão do Admin; 3 pagamentos por página, com paginação funcional
 * que respeita a busca e o filtro de status.
 */
export default function Pagamento() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payingPayment, setPayingPayment] = useState(null);
  const [page, setPage] = useState(1);

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

  const pageData = { ...paginate(filteredPayments, page), pageSize: PAGE_SIZE };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 xl:gap-3.5">
      <h1 className="app-page-title text-cream">Pagamentos</h1>

      <PaymentSummary />

      <PaymentToolbar
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
      />

      <PaymentList
        payments={pageData.items}
        pageData={pageData}
        onPageChange={setPage}
        onViewDetails={setSelectedPayment}
        onPayNow={handlePayNow}
      />

      <PaymentDetailsModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onPayNow={handlePayNow}
      />

      <PaymentMethodModal payment={payingPayment} onClose={() => setPayingPayment(null)} />
    </div>
  );
}
