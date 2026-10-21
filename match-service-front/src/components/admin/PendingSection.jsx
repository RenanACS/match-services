import { Link } from "react-router-dom";
import AdminSectionTitle from "./AdminSectionTitle";

/**
 * Pendências administrativas: três categorias, cada uma levando à sua tela.
 * O laranja marca só a contagem, que é o que pede atenção.
 */
export default function PendingSection({ items }) {
  return (
    <section
      aria-labelledby="pending-title"
      className="rounded-[20px] border border-hairline bg-surface-1 p-4"
    >
      <AdminSectionTitle id="pending-title">Pendências</AdminSectionTitle>
      <ul className="mt-2 flex flex-col divide-y divide-hairline">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={item.to}
              className="flex items-center justify-between gap-4 py-2.5 adm-text text-cream/80 transition hover:text-cream"
            >
              <span>{item.label}</span>
              <span className="adm-stat-number text-orange">{item.total}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
