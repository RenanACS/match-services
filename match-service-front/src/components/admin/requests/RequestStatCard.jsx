import AdminKpi from "../AdminKpi";

/**
 * Indicador que funciona como filtro: clicar aplica o status; clicar de novo
 * no cartão ativo remove.
 */
export default function RequestStatCard({ icon, tone, label, value, active, onClick }) {
  return <AdminKpi icon={icon} tone={tone} label={label} value={value} active={active} onClick={onClick} />;
}
