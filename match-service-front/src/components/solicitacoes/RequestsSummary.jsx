import { recentRequests } from "../../data/dashboard";

/**
 * Faixa de indicadores — mesmo padrão visual do SummaryStrip do Dashboard
 * (uma única faixa discreta, não três cards grandes). Os números são
 * calculados a partir de `recentRequests` (src/data/dashboard.js) e
 * sempre refletem o conjunto completo de solicitações, independente da
 * busca/filtro aplicados na listagem abaixo.
 */
export default function RequestsSummary() {
  const total = recentRequests.length;
  const inAnalysis = recentRequests.filter((request) => request.status === "analysis").length;
  const withProposals = recentRequests.filter((request) => request.status === "proposals").length;

  const stats = [
    { id: "total", label: "Total de solicitações", value: String(total).padStart(2, "0") },
    { id: "analysis", label: "Em análise", value: String(inAnalysis).padStart(2, "0") },
    { id: "proposals", label: "Propostas recebidas", value: String(withProposals).padStart(2, "0") },
  ];

  return (
    <section aria-label="Resumo das solicitações">
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
