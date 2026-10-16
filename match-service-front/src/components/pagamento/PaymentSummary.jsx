import { payments } from "../../data/payments";

export function formatCurrency(cents) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Faixa de indicadores — mesmo padrão visual do SummaryStrip do Dashboard /
 * RequestsSummary de Minhas Solicitações (uma única faixa discreta, não
 * três cards grandes). Os valores são calculados a partir de `payments`
 * (src/data/payments.js) e sempre refletem o conjunto completo de
 * pagamentos, independente da busca/filtro aplicados na listagem abaixo.
 */
export default function PaymentSummary() {
  const totalPaidCents = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amountCents, 0);
  const pendingCount = payments.filter((payment) => payment.status === "pending").length;
  const paidCount = payments.filter((payment) => payment.status === "paid").length;

  const stats = [
    { id: "total", label: "Total pago", value: formatCurrency(totalPaidCents) },
    { id: "pending", label: "Pagamentos pendentes", value: String(pendingCount).padStart(2, "0") },
    { id: "done", label: "Pagamentos concluídos", value: String(paidCount).padStart(2, "0") },
  ];

  return (
    <section aria-label="Resumo dos pagamentos">
      <dl className="grid grid-cols-1 divide-y divide-hairline rounded-[20px] border border-hairline bg-surface-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.id} className="flex items-baseline gap-2 px-4 py-3 sm:px-6 xl:py-2.5">
            <dd className="font-display text-xl font-semibold text-cream">{stat.value}</dd>
            <dt className="font-mono text-[10px] uppercase leading-snug tracking-widest text-cream/50 sm:text-[11px]">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
