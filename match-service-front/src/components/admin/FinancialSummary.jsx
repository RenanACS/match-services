import AdminKpi from "./AdminKpi";
import AdminSectionTitle from "./AdminSectionTitle";
import { formatBRL } from "../../utils/currency";

const ICONS = { escrow: "lock", payouts: "landmark", commission: "percent" };

/**
 * Resumo financeiro (valores demonstrativos, sem efeito financeiro real).
 * Pagamentos e repasses são automáticos — aqui o Admin só acompanha.
 */
export default function FinancialSummary({ metrics }) {
  return (
    <section aria-labelledby="financial-title">
      <AdminSectionTitle id="financial-title">Resumo financeiro</AdminSectionTitle>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <AdminKpi key={metric.id} icon={ICONS[metric.id] ?? "dollar"} label={metric.label} value={formatBRL(metric.value)} />
        ))}
      </div>
    </section>
  );
}
