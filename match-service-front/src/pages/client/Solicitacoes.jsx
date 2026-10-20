import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { PlusIcon } from "../../components/dashboard/icons";
import RequestsSummary from "../../components/solicitacoes/RequestsSummary";
import RequestsToolbar from "../../components/solicitacoes/RequestsToolbar";
import RequestsList from "../../components/solicitacoes/RequestsList";
import RequestDetailsModal from "../../components/solicitacoes/RequestDetailsModal";
import { recentRequests } from "../../data/dashboard";
import ClientDeliveryOrders from "../../components/entrega/ClientDeliveryOrders";

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
 * Segue a mesma filosofia single-screen do Dashboard: os espaçamentos só
 * ficam mais compactos a partir de `xl` (1280px+), para caber em uma
 * única viewport em 1366x768/1280x720/1440x900/1920x1080 sem rolagem; no
 * mobile/tablet o empilhamento e o scroll natural são preservados.
 */
export default function Solicitacoes() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = useMemo(() => {
    const term = normalize(query.trim());
    return recentRequests.filter((request) => {
      const matchesQuery =
        !term ||
        normalize(request.title).includes(term) ||
        normalize(request.category).includes(term);
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 xl:gap-3">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between xl:gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl xl:text-2xl">
            Minhas solicitações
          </h1>
          <p className="mt-2 max-w-xl text-base text-cream/60 xl:mt-1 xl:text-sm">
            Acompanhe os serviços que você solicitou.
          </p>
        </div>
        <Button as={Link} to="/app/solicitacao" variant="primary" size="md" className="shrink-0 xl:min-h-[38px]">
          <PlusIcon width={16} height={16} />
          Nova solicitação
        </Button>
      </header>

      <ClientDeliveryOrders />

      <RequestsSummary />

      <RequestsToolbar
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <RequestsList requests={filteredRequests} onViewDetails={setSelectedRequest} />

      <RequestDetailsModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
    </div>
  );
}
