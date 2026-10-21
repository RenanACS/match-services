import { useLocation } from "react-router-dom";
import DisputeStatusBadge from "./DisputeBadges";
import { DisputeViewLink } from "./DisputeParts";
import { dateOf } from "../requests/RequestParts";
import { DISPUTE_REASONS } from "../../../services/adminDisputes";

/**
 * Tabela (a partir de xl): ID | Abertura | Cliente | Fornecedor | Solicitação |
 * Motivo | Situação | Ação (só o olho). table-fixed em porcentagem: sem
 * rolagem interna. Nomes e motivos quebram em até 2 linhas.
 */
export default function DisputesTable({ disputes }) {
  const { search } = useLocation();
  const state = { fromSearch: search };
  const th = "adm-table px-2.5 py-3 font-medium text-cream/60 xl:py-2.5";
  const td = "px-2.5 py-3 xl:py-[9px]";
  const clamp = "adm-table line-clamp-2 break-words text-cream";
  return (
    <table className="w-full table-fixed text-left">
      <colgroup>
        <col className="w-[9%]" />
        <col className="w-[10%]" />
        <col className="w-[16%]" />
        <col className="w-[17%]" />
        <col className="w-[10%]" />
        <col className="w-[18%]" />
        <col className="w-[12%]" />
        <col className="w-[8%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-hairline">
          <th scope="col" className={`${th} pl-5`}>ID</th>
          <th scope="col" className={th}>Abertura</th>
          <th scope="col" className={th}>Cliente</th>
          <th scope="col" className={th}>Fornecedor</th>
          <th scope="col" className={th}>Solicitação</th>
          <th scope="col" className={th}>Motivo</th>
          <th scope="col" className={th}>Situação</th>
          <th scope="col" className={`${th} pr-5`}>Ação</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {disputes.map((d) => (
          <tr key={d.id} className="transition hover:bg-surface-2/60">
            <td className={`${td} adm-table pl-5 font-medium text-cream`}>#{d.id}</td>
            <td className={`${td} adm-table whitespace-nowrap text-cream/80`}>{dateOf(d.openedAt)}</td>
            <td className={td}><p title={d.client.name} className={clamp}>{d.client.name}</p></td>
            <td className={td}><p title={d.supplier.name} className={clamp}>{d.supplier.name}</p></td>
            <td className={`${td} adm-table text-cream/80`}>#{d.requestId}</td>
            <td className={td}><p title={DISPUTE_REASONS[d.reason]} className={`${clamp} text-cream/80`}>{DISPUTE_REASONS[d.reason]}</p></td>
            <td className={td}><DisputeStatusBadge status={d.status} /></td>
            <td className={`${td} pr-5`}><DisputeViewLink dispute={d} state={state} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
