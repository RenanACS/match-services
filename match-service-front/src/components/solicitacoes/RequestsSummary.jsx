import Kpi from "../ui/Kpi";
import { recentRequests } from "../../data/dashboard";

/**
 * Indicadores (rótulo acima do número). Calculados a partir de
 * `recentRequests` (src/data/dashboard.js) e sempre refletem o conjunto
 * completo de solicitações, independente da busca/filtro da listagem.
 */
export default function RequestsSummary() {
  const total = recentRequests.length;
  const inAnalysis = recentRequests.filter((request) => request.status === "analysis").length;
  const withProposals = recentRequests.filter((request) => request.status === "proposals").length;

  const stats = [
    { id: "total", icon: "requests", label: "Total de solicitações", value: String(total).padStart(2, "0") },
    { id: "analysis", icon: "search", label: "Em análise", value: String(inAnalysis).padStart(2, "0") },
    { id: "proposals", icon: "mail", label: "Propostas recebidas", value: String(withProposals).padStart(2, "0") },
  ];

  return (
    <section aria-label="Resumo das solicitações">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Kpi key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}
