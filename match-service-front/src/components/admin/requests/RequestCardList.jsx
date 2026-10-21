import { useLocation } from "react-router-dom";
import { RequestStatusBadge } from "./RequestBadges";
import { PartyAvatar, ViewLink, dateOf, money, timeOf } from "./RequestParts";

/** Lista em cartões para telas menores que xl (no lugar da tabela). */
export default function RequestCardList({ requests }) {
  const { search } = useLocation();
  const state = { fromSearch: search };
  return (
    <ul className="divide-y divide-hairline">
      {requests.map((request) => (
        <li key={request.id} className="flex flex-col gap-3 p-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="adm-text font-medium text-cream">#{request.id}</p>
            <RequestStatusBadge category={request.category} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex min-w-0 items-center gap-3">
              <PartyAvatar name={request.client.name} />
              <div className="min-w-0">
                <p className="adm-small text-cream/50">Cliente</p>
                <p className="adm-text truncate text-cream">{request.client.name}</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <PartyAvatar name={request.supplier.name} />
              <div className="min-w-0">
                <p className="adm-small text-cream/50">Fornecedor</p>
                <p className="adm-text truncate text-cream">{request.supplier.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="adm-text truncate text-cream">{request.service.name}</p>
              <p className="adm-small text-cream/60">
                {request.service.category} · {dateOf(request.createdAt)} {timeOf(request.createdAt)}
              </p>
              <p className="adm-text mt-1 font-medium text-cream">{money(request.valueCents)}</p>
            </div>
            <ViewLink request={request} state={state} />
          </div>
        </li>
      ))}
    </ul>
  );
}
