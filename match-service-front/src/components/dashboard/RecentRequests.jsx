import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";
import SectionTitle from "../ui/SectionTitle";
import { REQUEST_STATUS } from "../../data/dashboard";
import { listRequests } from "../../services/clientRequests";

function formatDate(iso) {
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
          {request.category} · {formatDate(request.date)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:shrink-0 sm:gap-x-8">
        <Badge variant={status.variant} appearance="app">{status.label}</Badge>
        <Link
          to="/app/solicitacoes"
          className="app-text inline-flex items-center gap-1.5 text-cream/60 transition hover:text-orange"
        >
          Ver solicitação
          <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </li>
  );
}

export default function RecentRequests() {
  return (
    <section aria-labelledby="recent-requests-title">
      <div className="mb-2 flex items-baseline justify-between">
        <SectionTitle id="recent-requests-title">Solicitações recentes</SectionTitle>
        <Link to="/app/solicitacoes" className="app-text text-cream/60 transition hover:text-orange">
          Ver todas
        </Link>
      </div>

      <ul className="divide-y divide-hairline rounded-[20px] border border-hairline bg-surface-1">
        {listRequests().slice(0, 3).map((request) => (
          <RequestRow key={request.id} request={request} />
        ))}
      </ul>
    </section>
  );
}
