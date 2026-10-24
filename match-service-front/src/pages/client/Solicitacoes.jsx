import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { paginate, PAGE_SIZE } from "../../utils/paginate";
import RequestsSummary from "../../components/solicitacoes/RequestsSummary";
import RequestsToolbar from "../../components/solicitacoes/RequestsToolbar";
import RequestsList from "../../components/solicitacoes/RequestsList";
import { recentRequests } from "../../data/dashboard";
import { hasRequestApi, readDemoCompletions } from "../../services/requestCompletion";

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Minhas solicitações (/app/solicitacoes).
 * Reaproveita `recentRequests`/`REQUEST_STATUS` de src/data/dashboard.js —
 * nenhuma base de dados nova. Busca e filtro de status rodam inteiramente
 * no front-end sobre esses três registros mockados; "Ver detalhes" abre
 * um modal com os campos já disponíveis, sem persistência real.
 *
 * Visual no padrão do Admin; a listagem mostra 3 solicitações por página
 * (paginação funcional que respeita a busca e o filtro de status).
 */
export default function Solicitacoes() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const demoCompletions = useMemo(() => hasRequestApi ? {} : readDemoCompletions(), []);
  const filteredRequests = useMemo(() => {
    const term = normalize(query.trim());
    return recentRequests.map((request) => ({
      ...request,
      status: request.status === "hired" && demoCompletions[request.id] ? "completed" : request.status,
    })).filter((request) => {
      const matchesQuery =
        !term ||
        normalize(request.title).includes(term) ||
        normalize(request.category).includes(term);
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, demoCompletions]);

  const pageData = { ...paginate(filteredRequests, page), pageSize: PAGE_SIZE };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 xl:gap-3.5">
      <header className="flex items-center justify-between gap-3">
        <h1 className="app-page-title text-cream">Minhas solicitações</h1>
        <Button as={Link} to="/app/solicitacao" variant="primary" size="md" appearance="app" className="shrink-0">
          <Icon name="plus" size={16} />
          Nova solicitação
        </Button>
      </header>

      <RequestsSummary />

      <RequestsToolbar
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
      />

      <RequestsList
        requests={pageData.items}
        pageData={pageData}
        onPageChange={setPage}
      />

    </div>
  );
}
