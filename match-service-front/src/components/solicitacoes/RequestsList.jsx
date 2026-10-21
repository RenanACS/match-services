import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import { REQUEST_STATUS } from "../../data/dashboard";

export function formatRequestDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RequestRow({ request }) {
  const status = REQUEST_STATUS[request.status];

  return (
    <li className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="min-w-0 sm:w-72 sm:shrink-0">
        <h3 className="app-text truncate font-medium text-cream">{request.title}</h3>
        <p className="app-small mt-0.5 text-cream/50">
          {request.category} · {formatRequestDate(request.date)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:shrink-0 sm:gap-x-8">
        <Badge variant={status.variant} appearance="app">{status.label}</Badge>
        <Link
          to={`/app/solicitacoes/${request.id}`}
          className="app-text inline-flex items-center gap-1.5 text-cream/60 transition hover:text-orange"
        >
          Ver detalhes
          <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </li>
  );
}

/**
 * Listagem compacta das solicitações (linhas), 3 por página. `pageData` vem
 * de utils/paginate. Estado vazio quando a busca/filtro não encontra nada.
 */
export default function RequestsList({ requests, pageData, onPageChange }) {
  if (pageData.total === 0) {
    return (
      <div className="rounded-[20px] border border-hairline bg-surface-1 px-6 py-8 text-center">
        <p className="app-text text-cream/60">Nenhuma solicitação encontrada para essa busca ou filtro.</p>
      </div>
    );
  }

  return (
    <section aria-label="Lista de solicitações" className="rounded-[20px] border border-hairline bg-surface-1">
      <ul className="divide-y divide-hairline">
        {requests.map((request) => (
          <RequestRow key={request.id} request={request} />
        ))}
      </ul>
      <div className="border-t border-hairline">
        <Pagination
          page={pageData.page}
          totalPages={pageData.totalPages}
          total={pageData.total}
          start={pageData.start}
          pageSize={pageData.pageSize}
          itemLabel="solicitações"
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
