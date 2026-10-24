import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/supplier/StatusBadge";
import SummaryCard from "../../components/supplier/SummaryCard";
import Avatar from "../../components/supplier/Avatar";
import PageHeader from "../../components/supplier/PageHeader";
import DataTable from "../../components/supplier/DataTable";
import Pagination from "../../components/supplier/Pagination";
import { IconLink } from "../../components/supplier/IconLink";
import { CheckIcon, ClockIcon, EyeIcon, GearIcon, SearchIcon, XIcon } from "../../components/supplier/icons";
import useSupplierData from "../../context/supplier/useSupplierData";
import { SUPPLIER_CATEGORIES } from "../../data/fornecedor";
import { formatCurrency, formatDate, formatTime } from "../../utils/supplierFormat";
import { matchesRequestStatus } from "../../utils/entregaOverlay";
import { matchesPeriod, normalize, paginate, PERIOD_OPTIONS } from "../../utils/supplierFilters";

const PAGE_SIZE = 8;

const STATUS_CARDS = [
  { status: "pending", icon: ClockIcon, tone: "warning", label: "Aguardando confirmação" },
  { status: "progress", icon: GearIcon, tone: "info", label: "Em andamento" },
  { status: "done", icon: CheckIcon, tone: "success", label: "Concluídas" },
  { status: "canceled", icon: XIcon, tone: "danger", label: "Canceladas" },
];

/**
 * Solicitações recebidas (/fornecedor/solicitacoes). O status vem da URL
 * (?status=pending), que é o que o Dashboard envia; clicar num card de
 * resumo atualiza a mesma URL. Clicar de novo no card ativo limpa o filtro.
 */
export default function SupplierRequests() {
  const { requests } = useSupplierData();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const status = STATUS_CARDS.some((card) => card.status === statusParam) ? statusParam : "all";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);

  function changeStatus(next) {
    setSearchParams(next === "all" || next === status ? {} : { status: next });
    setPage(1);
  }

  function changeFilter(setter) {
    return (event) => {
      setter(event.target.value);
      setPage(1);
    };
  }

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return requests
      .filter((request) => {
        const matchesQuery =
          !term ||
          normalize(`${request.id} ${request.client.name} ${request.service} ${request.category}`).includes(term);
        return (
          matchesQuery &&
          matchesRequestStatus(request, status) &&
          (category === "all" || request.category === category) &&
          matchesPeriod(request.date, period)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [requests, query, status, category, period]);

  const { pageItems, pages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);

  const columns = [
    { key: "id", label: "ID", mobile: "title", render: (r) => <span className="font-mono text-cream/80">#{r.id}</span> },
    {
      key: "client",
      label: "Cliente",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.client.name} />
          <div className="text-left">
            <p className="text-cream">{r.client.name}</p>
            <p className="app-small text-cream/70">{r.client.city}</p>
          </div>
        </div>
      ),
    },
    {
      key: "service",
      label: "Serviço",
      render: (r) => (
        <div className="md:text-left">
          <p className="text-cream">{r.service}</p>
          <p className="app-small text-cream/70">{r.category}</p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Data da solicitação",
      render: (r) => (
        <div className="md:text-left">
          <p>{formatDate(r.date)}</p>
          <p className="app-small text-cream/70">{formatTime(r.date)}</p>
        </div>
      ),
    },
    { key: "value", label: "Valor", render: (r) => <span className="whitespace-nowrap text-cream">{formatCurrency(r.value)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      label: "Ações",
      align: "right",
      mobile: "actions",
      render: (r) => (
        <IconLink to={`/fornecedor/solicitacoes/${r.id}`} label={`Ver detalhes da solicitação #${r.id}`}>
          <EyeIcon width={18} height={18} />
        </IconLink>
      ),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader title="Solicitações de serviço" description="Acompanhe e responda às solicitações enviadas pelos clientes." />

      <section aria-label="Resumo por status" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATUS_CARDS.map((card) => (
          <SummaryCard
            key={card.status}
            icon={card.icon}
            tone={card.tone}
            label={card.label}
            value={requests.filter((request) => matchesRequestStatus(request, card.status)).length}
            active={status === card.status}
            onClick={() => changeStatus(card.status)}
          />
        ))}
      </section>

      <Card className="p-0">
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-[2fr_1fr_1fr]">
          <div className="sm:col-span-2 xl:col-span-1">
            <Input
              id="request-search"
              label="Buscar"
              type="search"
              placeholder="Buscar por cliente, serviço, categoria ou ID..."
              leftIcon={<SearchIcon width={18} height={18} />}
              value={query}
              onChange={changeFilter(setQuery)}
            />
          </div>
          <Select id="request-category" label="Categoria" value={category} onChange={changeFilter(setCategory)}>
            <option value="all">Todas</option>
            {SUPPLIER_CATEGORIES.map((item) => (
              <option key={item.id} value={item.label}>
                {item.label}
              </option>
            ))}
          </Select>
          <Select id="request-period" label="Período" value={period} onChange={changeFilter(setPeriod)}>
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <DataTable
          columns={columns}
          rows={pageItems}
          rowKey={(row) => row.id}
          emptyMessage="Nenhuma solicitação encontrada para esses filtros."
        />
        <Pagination
          page={currentPage}
          pages={pages}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          noun="solicitações"
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
