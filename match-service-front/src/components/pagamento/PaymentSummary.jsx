import Kpi from "../ui/Kpi";
import { payments } from "../../data/payments";

export function formatCurrency(cents) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Indicadores (rótulo acima do número). Calculados a partir de `payments`
 * (src/data/payments.js) e sempre refletem o conjunto completo de pagamentos,
 * independente da busca/filtro da listagem.
 */
export default function PaymentSummary() {
  const totalPaidCents = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amountCents, 0);
  const pendingCount = payments.filter((payment) => payment.status === "pending").length;
  const paidCount = payments.filter((payment) => payment.status === "paid").length;

  const stats = [
    { id: "total", icon: "payments", label: "Total pago", value: formatCurrency(totalPaidCents) },
    { id: "pending", icon: "clock", label: "Pagamentos pendentes", value: String(pendingCount).padStart(2, "0") },
    { id: "done", icon: "checkCircle", label: "Pagamentos concluídos", value: String(paidCount).padStart(2, "0") },
  ];

  return (
    <section aria-label="Resumo dos pagamentos">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Kpi key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}
