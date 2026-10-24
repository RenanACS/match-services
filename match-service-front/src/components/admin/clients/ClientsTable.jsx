import { useLocation } from "react-router-dom";
import { ClientStatusBadge, ClientTypeBadge } from "./ClientBadges";
import { BlockAction, ClientAvatar, DetailsLink } from "./ClientRowParts";

/**
 * Tabela (a partir de xl) com as seis colunas: Cliente | Tipo | CPF/CNPJ |
 * Status | Detalhes | Ações. Colunas em porcentagem (table-fixed): ocupa a
 * largura disponível, sem larguras mínimas e sem rolagem interna; textos
 * longos são truncados (o texto completo fica no title).
 */
export default function ClientsTable({ clients, onToggleBlock }) {
  // Guarda filtros/página da lista para o "← Clientes" dos detalhes voltar a ela.
  const { search } = useLocation();
  const linkState = { fromSearch: search };
  const th = "px-3 py-3 adm-text font-medium text-cream/70 xl:py-2.5";
  return (
    <table className="w-full table-fixed text-left adm-text">
      <colgroup>
        <col className="w-[33%]" />
        <col className="w-[8%]" />
        <col className="w-[20%]" />
        <col className="w-[13%]" />
        <col className="w-[13%]" />
        <col className="w-[13%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-hairline">
          <th scope="col" className={`${th} pl-6`}>Cliente</th>
          <th scope="col" className={th}>Tipo</th>
          <th scope="col" className={th}>CPF/CNPJ</th>
          <th scope="col" className={th}>Status</th>
          <th scope="col" className={th}>Detalhes</th>
          <th scope="col" className={`${th} pr-6`}>Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {clients.map((client) => (
          <tr key={client.id} className="transition hover:bg-surface-2/60">
            <td className="py-3 pl-6 pr-3 xl:py-[11px]">
              <div className="flex min-w-0 items-center gap-3">
                <ClientAvatar type={client.type} />
                <div className="min-w-0">
                  <p title={client.name} className="truncate font-medium text-cream">{client.name}</p>
                  <p title={client.email} className="truncate adm-small text-cream/70">{client.email}</p>
                </div>
              </div>
            </td>
            <td className="px-3 py-3 xl:py-[11px]"><ClientTypeBadge type={client.type} /></td>
            <td className="truncate px-3 py-3 text-cream/80 xl:py-[11px]">{client.document}</td>
            <td className="px-3 py-3 xl:py-[11px]"><ClientStatusBadge status={client.status} /></td>
            <td className="px-3 py-3 xl:py-[11px]"><DetailsLink client={client} state={linkState} /></td>
            <td className="py-3 pl-3 pr-6 xl:py-[11px]"><BlockAction client={client} onToggleBlock={onToggleBlock} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
