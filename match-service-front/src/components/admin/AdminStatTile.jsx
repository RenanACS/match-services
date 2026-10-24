import AdminKpi from "./AdminKpi";

/** Indicador (somente exibição). Legendas de apoio (`hint`) foram removidas do padrão visual. */
export default function AdminStatTile({ icon, tone = "orange", label, value }) {
  return <AdminKpi icon={icon} tone={tone} label={label} value={value} />;
}
