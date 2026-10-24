import TonePill from "./TonePill";
import { serviceSituation } from "./helpers";
import { formatBRL } from "../../../../utils/currency";

/** Serviços cadastrados pelo fornecedor (nome, categoria, descrição, preço, situação). */
export default function ServicesTab({ supplier }) {
  return (
    <section aria-labelledby="services-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <h2 id="services-title" className="adm-section-title">Serviços cadastrados</h2>
      <ul className="mt-4 divide-y divide-hairline">
        {supplier.services.map((service) => {
          const situation = serviceSituation(supplier, service);
          return (
            <li key={service.id} className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto] md:items-center md:gap-6">
              <div className="min-w-0">
                <p className="font-medium text-cream">{service.name}</p>
                <p className="mt-0.5 adm-small text-cream/70">{service.category}</p>
                <p className="mt-1.5 adm-text text-cream/70">{service.description}</p>
              </div>
              <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
                <p className="adm-text font-medium text-cream">
                  {service.priceCents === null ? "Sob orçamento" : `A partir de ${formatBRL(service.priceCents)}`}
                </p>
                <TonePill tone={situation.tone}>{situation.label}</TonePill>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
