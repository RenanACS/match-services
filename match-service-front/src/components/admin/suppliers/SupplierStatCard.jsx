import AdminKpi from "../AdminKpi";

/**
 * Indicador que funciona como atalho de filtro: o número vem sempre dos dados
 * e `active` destaca o filtro aplicado.
 */
export default function SupplierStatCard({ icon, tone = "orange", value, label, active, onClick }) {
  return <AdminKpi icon={icon} tone={tone} label={label} value={value} active={active} onClick={onClick} />;
}
