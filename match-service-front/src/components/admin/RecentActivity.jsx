import AdminSectionTitle from "./AdminSectionTitle";

/** Atividades recentes: apenas os três registros mais relevantes. */
export default function RecentActivity({ items }) {
  return (
    <section
      aria-labelledby="activity-title"
      className="rounded-[20px] border border-hairline bg-surface-1 p-4"
    >
      <AdminSectionTitle id="activity-title">Atividades recentes</AdminSectionTitle>
      <ul className="mt-2 flex flex-col divide-y divide-hairline">
        {items.map((item) => (
          <li key={item.id} className="py-2.5 adm-text">
            <p className="text-cream/80">{item.text}</p>
            <p className="mt-0.5 adm-small text-cream/70">{item.time}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
