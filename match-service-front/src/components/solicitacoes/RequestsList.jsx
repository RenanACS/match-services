import Badge from "../ui/Badge";
import { REQUEST_STATUS } from "../../data/dashboard";

export function formatRequestDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RequestRow({ request, onViewDetails }) {
  const status = REQUEST_STATUS[request.status];

  return (
    <li className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 xl:py-2">
      <div className="min-w-0 xl:w-72 xl:shrink-0">
        <h3 className="truncate font-display text-base font-medium text-cream xl:text-sm">
          {request.title}
        </h3>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-cream/45">
          {request.category} · {formatRequestDate(request.date)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:shrink-0 xl:gap-x-8">
        <Badge variant={status.variant}>{status.label}</Badge>
        <button
          type="button"
          onClick={() => onViewDetails(request)}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
        >
          Ver detalhes →
        </button>
      </div>
    </li>
  );
}

/**
 * Listagem compacta das solicitações (linhas, não cards altos). Mostra o
 * estado vazio quando a busca/filtro não encontra nenhum resultado entre
 * os dados mockados de `recentRequests`.
 */
export default function RequestsList({ requests, onViewDetails }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-[20px] border border-hairline bg-surface-1 px-6 py-10 text-center">
        <p className="text-sm text-cream/60">
          Nenhuma solicitação encontrada para essa busca ou filtro.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-hairline overflow-hidden rounded-[20px] border border-hairline bg-surface-1">
      {requests.map((request) => (
        <RequestRow key={request.id} request={request} onViewDetails={onViewDetails} />
      ))}
    </ul>
  );
}
