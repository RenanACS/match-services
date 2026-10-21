import { useLocation } from "react-router-dom";
import { PaymentStatusBadge } from "./PaymentBadges";
import { PaymentViewLink, PlannedMoney } from "./PaymentParts";
import { dateOf, money } from "../requests/RequestParts";

/**
 * Tabela (a partir de xl): ID | Data | Solicitação | Cliente | Fornecedor |
 * Valor total | Comissão (10%) | Valor ao fornecedor | Situação | Ação (só o
 * olho). table-fixed com colunas em porcentagem: sem rolagem interna.
 */
export default function PaymentsTable({ payments }) {
  const { search } = useLocation();
  const state = { fromSearch: search };
  const th = "adm-table px-2.5 py-3 font-medium text-cream/60 xl:py-2.5";
  const td = "px-2.5 py-3 xl:py-[9px]";
  return (
    <table className="w-full table-fixed text-left">
      <colgroup>
        <col className="w-[8.5%]" />
        <col className="w-[9.5%]" />
        <col className="w-[8.5%]" />
        <col className="w-[13.5%]" />
        <col className="w-[14%]" />
        <col className="w-[9.5%]" />
        <col className="w-[9%]" />
        <col className="w-[9.5%]" />
        <col className="w-[11.5%]" />
        <col className="w-[6.5%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-hairline">
          <th scope="col" className={`${th} pl-5`}>ID</th>
          <th scope="col" className={th}>Data</th>
          <th scope="col" className={th}>Solicitação</th>
          <th scope="col" className={th}>Cliente</th>
          <th scope="col" className={th}>Fornecedor</th>
          <th scope="col" className={th}>Valor total</th>
          <th scope="col" className={th}>Comissão ({payments[0]?.commissionRate ?? 10}%)</th>
          <th scope="col" className={th}>Valor ao fornecedor</th>
          <th scope="col" className={th}>Situação</th>
          <th scope="col" className={`${th} pr-5`}>Ação</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {payments.map((p) => (
          <tr key={p.id} className="transition hover:bg-surface-2/60">
            <td className={`${td} adm-table pl-5 font-medium text-cream`}>#{p.id}</td>
            <td className={`${td} adm-table whitespace-nowrap text-cream/80`}>{dateOf(p.createdAt)}</td>
            <td className={`${td} adm-table text-cream/80`}>#{p.requestId}</td>
            <td className={td}><p title={p.client.name} className="adm-table line-clamp-2 break-words text-cream">{p.client.name}</p></td>
            <td className={td}><p title={p.supplier.name} className="adm-table line-clamp-2 break-words text-cream">{p.supplier.name}</p></td>
            <td className={`${td} adm-table whitespace-nowrap text-cream`}>{money(p.totalCents)}</td>
            <td className={td}><PlannedMoney payment={p} cents={p.commissionCents} effective={p.commissionEffective} /></td>
            <td className={td}><PlannedMoney payment={p} cents={p.payoutCents} effective={p.payoutValueEffective} /></td>
            <td className={td}><PaymentStatusBadge status={p.status} /></td>
            <td className={`${td} pr-5`}><PaymentViewLink payment={p} state={state} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
