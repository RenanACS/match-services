import AdminMetricCard from "./AdminMetricCard";
import { formatBRL } from "../../utils/currency";

/** Grupo rotulado de indicadores (cadastrais, operacionais ou financeiros). */
export default function AdminMetricGroup({ title, metrics, columns = "grid-cols-2 sm:grid-cols-3", note }) {
  return (
    <section aria-label={title} className="flex min-w-0 flex-col gap-2 xl:gap-1.5">
      <h2 className="adm-eyebrow text-cream/50">{title}</h2>
      <div className={`grid gap-3 xl:gap-2 ${columns}`}>
        {metrics.map((metric) => (
          <AdminMetricCard
            key={metric.id}
            label={metric.label}
            value={metric.currency ? formatBRL(metric.value) : metric.value}
          />
        ))}
      </div>
      {note && <p className="adm-small text-cream/40">{note}</p>}
    </section>
  );
}
