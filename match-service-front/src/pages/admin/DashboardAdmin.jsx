import AdminMetricCard from "../../components/admin/AdminMetricCard";
import FinancialSummary from "../../components/admin/FinancialSummary";
import PendingSection from "../../components/admin/PendingSection";
import RecentActivity from "../../components/admin/RecentActivity";
import {
  mainMetrics,
  financialMetrics,
  pendingItems,
  recentActivity,
} from "../../data/adminDashboard";

const METRIC_ICONS = { "clients-pf": "user", "clients-pj": "building", suppliers: "suppliers", requests: "requests" };

/**
 * Dashboard Administrativo (/admin). Dados 100% fictícios em
 * src/data/adminDashboard.js — sem rede, sem Django, sem Asaas.
 *
 * O Admin acompanha, audita e trata exceções: pagamentos e repasses normais
 * são automáticos e NÃO dependem de aprovação manual; a análise humana fica
 * nas contestações. Por isso não há botões que aparentem movimentar dinheiro.
 * Sem aviso de modo demonstrativo na interface.
 */
export default function DashboardAdmin() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 xl:gap-3.5">
      <h1 className="adm-page-title">Dashboard administrativo</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {mainMetrics.map((metric) => (
          <AdminMetricCard key={metric.id} icon={METRIC_ICONS[metric.id]} label={metric.label} value={metric.value} />
        ))}
      </div>

      <FinancialSummary metrics={financialMetrics} />

      <div className="grid gap-3 lg:grid-cols-2">
        <PendingSection items={pendingItems} />
        <RecentActivity items={recentActivity} />
      </div>
    </div>
  );
}
