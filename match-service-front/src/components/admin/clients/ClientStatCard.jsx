import AdminKpi from "../AdminKpi";

/**
 * Indicador que funciona como atalho: aplica o filtro correspondente na lista
 * (o número vem sempre dos dados existentes).
 */
export default function ClientStatCard({ icon, tone = "orange", value, label, onClick }) {
  return <AdminKpi icon={icon} tone={tone} label={label} value={value} onClick={onClick} />;
}
