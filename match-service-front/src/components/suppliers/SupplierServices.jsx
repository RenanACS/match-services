import SectionTitle from "../ui/SectionTitle";

/** Seção "Serviços oferecidos" — lista simples em grade. */
export default function SupplierServices({ services }) {
  return (
    <section aria-labelledby="supplier-services-title">
      <SectionTitle id="supplier-services-title">Serviços oferecidos</SectionTitle>
      <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {services.map((service) => (
          <li
            key={service}
            className="app-text flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 px-3.5 py-2 text-cream/75"
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
