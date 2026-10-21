import { RequestStatusBadge } from "./ClientBadges";
import { REQUEST_STATUS } from "../../../data/adminClients";
import { formatBRL } from "../../../utils/currency";
import { formatDate } from "../../../utils/dates";

/** Histórico demonstrativo de solicitações e contratações do cliente (consulta). */
export default function ClientRequestsHistory({ requests }) {
  return (
    <section aria-labelledby="requests-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <h2 id="requests-title" className="adm-section-title">
        Solicitações e contratações
      </h2>
      {requests.length === 0 ? (
        <p className="mt-3 adm-text text-cream/60">Este cliente ainda não possui solicitações.</p>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-hairline">
          {requests.map((request) => {
            const status = REQUEST_STATUS[request.status];
            return (
              <li
                key={request.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate adm-text font-medium text-cream">{request.title}</p>
                  <p className="mt-0.5 adm-small text-cream/50">
                    {formatDate(request.date)}
                    {request.supplier ? ` · ${request.supplier}` : " · Sem fornecedor contratado"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="adm-text text-cream/80">
                    {request.value != null ? formatBRL(request.value) : "—"}
                  </span>
                  <RequestStatusBadge label={status.label} variant={status.variant} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
