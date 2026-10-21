import Kpi from "../ui/Kpi";
import { summaryStats } from "../../data/dashboard";

const ICONS = { requests: "requests", proposals: "mail", hiring: "checkCircle" };

/** Indicadores do Dashboard (padrão de KPI compacto: rótulo acima, número abaixo). */
export default function SummaryStrip() {
  return (
    <section aria-label="Resumo">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summaryStats.map((stat) => (
          <Kpi key={stat.id} icon={ICONS[stat.id] ?? "file"} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}
