import { useLocation } from "react-router-dom";
import { PaymentStatusBadge } from "./PaymentBadges";
import { PaymentViewLink, PlannedMoney } from "./PaymentParts";
import { dateOf, money } from "../requests/RequestParts";

/** Lista em cartões para telas menores que xl (no lugar da tabela). */
export default function PaymentCardList({ payments }) {
  const { search } = useLocation();
  const state = { fromSearch: search };
  return (
    <ul className="divide-y divide-hairline">
      {payments.map((p) => (
        <li key={p.id} className="flex flex-col gap-3 p-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="adm-text font-medium text-cream">#{p.id} <span className="font-normal text-cream/50">· {dateOf(p.createdAt)}</span></p>
            <PaymentStatusBadge status={p.status} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="min-w-0">
              <p className="adm-small text-cream/50">Cliente</p>
              <p className="adm-text truncate text-cream">{p.client.name}</p>
            </div>
            <div className="min-w-0">
              <p className="adm-small text-cream/50">Fornecedor</p>
              <p className="adm-text truncate text-cream">{p.supplier.name}</p>
            </div>
            <div className="min-w-0">
              <p className="adm-small text-cream/50">Solicitação</p>
              <p className="adm-text text-cream">#{p.requestId}</p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="grid flex-1 grid-cols-3 gap-3">
              <div>
                <p className="adm-small text-cream/50">Valor total</p>
                <p className="adm-text font-medium text-cream">{money(p.totalCents)}</p>
              </div>
              <div>
                <p className="adm-small text-cream/50">Comissão ({p.commissionRate}%)</p>
                <PlannedMoney payment={p} cents={p.commissionCents} effective={p.commissionEffective} />
              </div>
              <div>
                <p className="adm-small text-cream/50">Ao fornecedor</p>
                <PlannedMoney payment={p} cents={p.payoutCents} effective={p.payoutValueEffective} />
              </div>
            </div>
            <PaymentViewLink payment={p} state={state} />
          </div>
        </li>
      ))}
    </ul>
  );
}
