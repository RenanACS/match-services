import { useLocation } from "react-router-dom";
import { RequestStatusBadge } from "./RequestBadges";
import { DateTimeCell, PartyCell, ViewLink, money } from "./RequestParts";

/**
 * Tabela (a partir de xl): ID | Cliente | Fornecedor | Serviço | Data da
 * solicitação | Valor | Status | Ações (só o olho). table-fixed com colunas em
 * porcentagem: sem largura mínima e sem rolagem interna.
 */
export default function RequestsTable({ requests }) {
  const { search } = useLocation();
  const state = { fromSearch: search };
  const th = "adm-table px-3 py-3 font-medium text-cream/70 xl:py-2.5";
  const td = "px-3 py-3 xl:py-[9px]";
  return (
    <table className="w-full table-fixed text-left">
      <colgroup>
        <col className="w-[7.5%]" />
        <col className="w-[14.5%]" />
        <col className="w-[15%]" />
        <col className="w-[13.5%]" />
        <col className="w-[11%]" />
        <col className="w-[9%]" />
        <col className="w-[21%]" />
        <col className="w-[8%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-hairline">
          <th scope="col" className={`${th} pl-6`}>ID</th>
          <th scope="col" className={th}>Cliente</th>
          <th scope="col" className={th}>Fornecedor</th>
          <th scope="col" className={th}>Serviço</th>
          <th scope="col" className={th}>Data da solicitação</th>
          <th scope="col" className={th}>Valor</th>
          <th scope="col" className={th}>Status</th>
          <th scope="col" className={`${th} pr-6`}>Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {requests.map((request) => (
          <tr key={request.id} className="transition hover:bg-surface-2/60">
            <td className={`${td} adm-table pl-6 text-cream/80`}>#{request.id}</td>
            <td className={td}><PartyCell name={request.client.name} city={request.location.city} state={request.location.state} /></td>
            <td className={td}><PartyCell name={request.supplier.name} city={request.supplier.address.city} state={request.supplier.address.state} /></td>
            <td className={td}>
              <p title={request.service.name} className="adm-table truncate text-cream">{request.service.name}</p>
              <p className="adm-small truncate text-cream/70">{request.service.category}</p>
            </td>
            <td className={td}><DateTimeCell iso={request.createdAt} /></td>
            <td className={`${td} adm-table whitespace-nowrap text-cream`}>{money(request.valueCents)}</td>
            <td className={td}><RequestStatusBadge category={request.category} /></td>
            <td className={`${td} pr-6`}><ViewLink request={request} state={state} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
