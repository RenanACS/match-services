import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";
import { dateOf, money, timeOf } from "../RequestParts";

/** Card Serviço: nome, categoria, localização, descrição, data e valor contratado. */
export default function RequestServiceCard({ request }) {
  return (
    <section aria-labelledby="request-service" className="flex flex-col rounded-[20px] border border-hairline bg-surface-1 p-5">
      <AdminSectionTitle id="request-service" icon="wrench" className="border-b border-hairline pb-3">
        Serviço
      </AdminSectionTitle>
      <p className="adm-section-title mt-4">{request.service.name}</p>
      <p className="adm-text text-cream/60">{request.service.category}</p>
      <p className="adm-text mt-2 flex items-center gap-2 text-cream/80">
        <Icon name="mapPin" size={16} className="text-cream/60" />
        {request.location.city} - {request.location.state}
      </p>
      <p className="adm-text mt-3 text-cream/80">{request.service.description}</p>
      <div className="flex-1" />
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 border-t border-hairline pt-4">
        <div className="flex items-start gap-2.5">
          <Icon name="calendar" size={18} className="mt-0.5 text-cream/60" />
          <div>
            <dt className="adm-small text-cream/55">Data da solicitação</dt>
            <dd className="adm-text font-medium text-cream">{dateOf(request.createdAt)} às {timeOf(request.createdAt)}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Icon name="dollar" size={18} className="mt-0.5 text-cream/60" />
          <div>
            <dt className="adm-small text-cream/55">Valor do serviço</dt>
            <dd className="adm-text font-medium text-cream">{money(request.valueCents)}</dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
