import { useLocation } from "react-router-dom";
import DisputeStatusBadge from "./DisputeBadges";
import { DisputeViewLink } from "./DisputeParts";
import { dateOf } from "../requests/RequestParts";
import { DISPUTE_REASONS } from "../../../services/adminDisputes";

/** Lista em cartões para telas menores que xl (no lugar da tabela). */
export default function DisputeCardList({ disputes }) {
  const { search } = useLocation();
  const state = { fromSearch: search };
  return (
    <ul className="divide-y divide-hairline">
      {disputes.map((d) => (
        <li key={d.id} className="flex flex-col gap-3 p-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="adm-text font-medium text-cream">#{d.id} <span className="font-normal text-cream/70">· {dateOf(d.openedAt)}</span></p>
            <DisputeStatusBadge status={d.status} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="min-w-0"><p className="adm-small text-cream/70">Cliente</p><p className="adm-text truncate text-cream">{d.client.name}</p></div>
            <div className="min-w-0"><p className="adm-small text-cream/70">Fornecedor</p><p className="adm-text truncate text-cream">{d.supplier.name}</p></div>
            <div className="min-w-0"><p className="adm-small text-cream/70">Solicitação</p><p className="adm-text text-cream">#{d.requestId}</p></div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0"><p className="adm-small text-cream/70">Motivo</p><p className="adm-text text-cream">{DISPUTE_REASONS[d.reason]}</p></div>
            <DisputeViewLink dispute={d} state={state} />
          </div>
        </li>
      ))}
    </ul>
  );
}
