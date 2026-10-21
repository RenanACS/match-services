import AdminKpi from "../AdminKpi";

/** Indicador financeiro (somente exibição, não filtra). */
export default function PaymentStatCard({ icon, label, value }) {
  return <AdminKpi icon={icon} label={label} value={value} />;
}
