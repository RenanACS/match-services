import { useLocation } from "react-router-dom";
import { ClientStatusBadge, ClientTypeBadge } from "./ClientBadges";
import { BlockAction, ClientAvatar, DetailsLink } from "./ClientRowParts";

/** Apresentação em cartões da lista de clientes (abaixo de xl). */
export default function ClientCardList({ clients, onToggleBlock }) {
  const { search } = useLocation();
  const linkState = { fromSearch: search };
  return (
    <ul className="divide-y divide-hairline">
      {clients.map((client) => (
        <li key={client.id} className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-3">
            <ClientAvatar type={client.type} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-cream">{client.name}</p>
              <p className="truncate adm-small text-cream/70">{client.email}</p>
            </div>
            <ClientStatusBadge status={client.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 adm-text text-cream/70">
            <ClientTypeBadge type={client.type} />
            <span>{client.document}</span>
          </div>
          <div className="flex items-center justify-between">
            <DetailsLink client={client} state={linkState} />
            <BlockAction client={client} onToggleBlock={onToggleBlock} />
          </div>
        </li>
      ))}
    </ul>
  );
}
