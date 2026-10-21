import AdminKpi from "./AdminKpi";

/** Indicador principal (Dashboard): rótulo em cima e valor embaixo, sem legenda. */
export default function AdminMetricCard({ label, value, icon, tone }) {
  return <AdminKpi as="div" icon={icon} tone={tone} label={label} value={value} />;
}
