/**
 * Seção "Serviços oferecidos" — lista simples em grade, sem virar uma
 * sequência de pills/badges.
 */
export default function SupplierServices({ services }) {
  return (
    <section aria-labelledby="supplier-services-title">
      <h2
        id="supplier-services-title"
        className="font-display text-lg font-semibold text-cream xl:text-base"
      >
        Serviços oferecidos
      </h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:mt-1.5 xl:gap-1.5">
        {services.map((service) => (
          <li
            key={service}
            className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 px-4 py-2.5 text-sm text-cream/75 xl:px-3.5 xl:py-1"
          >
            <span aria-hidden="true" className="text-orange-light">
              •
            </span>
            {service}
          </li>
        ))}
      </ul>
    </section>
  );
}
