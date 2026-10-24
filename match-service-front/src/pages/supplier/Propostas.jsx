import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ToneBadge from "../../components/supplier/ToneBadge";
import SummaryCard from "../../components/supplier/SummaryCard";
import PageHeader from "../../components/supplier/PageHeader";
import DataTable from "../../components/supplier/DataTable";
import Pagination from "../../components/supplier/Pagination";
import { IconLink } from "../../components/supplier/IconLink";
import { CheckIcon, ClockIcon, EditIcon, EyeIcon, PlusIcon, SearchIcon, XIcon } from "../../components/supplier/icons";
import useSupplierData from "../../context/supplier/useSupplierData";
import { PROPOSAL_STATUS } from "../../data/fornecedor";
import { formatCurrency, formatDate } from "../../utils/supplierFormat";
import { normalize, paginate } from "../../utils/supplierFilters";

const PAGE_SIZE = 8;

const STATUS_CARDS = [
  { status: "sent", icon: ClockIcon, tone: "info", label: "Enviadas" },
  { status: "accepted", icon: CheckIcon, tone: "success", label: "Aceitas" },
  { status: "refused", icon: XIcon, tone: "danger", label: "Recusadas" },
  { status: "expired", icon: ClockIcon, tone: "warning", label: "Expiradas" },
];

/** Propostas enviadas pelo fornecedor (/fornecedor/propostas). */
export default function SupplierProposals() {
  const { proposals } = useSupplierData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  function changeStatus(next) {
    setStatus(next === status ? "all" : next);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return proposals
      .filter(
        (proposal) =>
          (!term || normalize(`${proposal.id} ${proposal.client} ${proposal.service}`).includes(term)) &&
          (status === "all" || proposal.status === status),
      )
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  }, [proposals, query, status]);

  const { pageItems, pages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);

  const columns = [
    { key: "id", label: "ID", mobile: "title", render: (p) => <span className="font-mono text-cream/80">#{p.id}</span> },
    { key: "client", label: "Cliente", render: (p) => <span className="text-cream">{p.client}</span> },
    { key: "service", label: "Serviço", render: (p) => <span className="text-cream">{p.service}</span> },
    { key: "value", label: "Valor", render: (p) => <span className="whitespace-nowrap text-cream">{formatCurrency(p.value)}</span> },
    { key: "days", label: "Prazo", render: (p) => `${p.days} dias` },
    { key: "sentAt", label: "Enviada em", render: (p) => formatDate(p.sentAt) },
    {
      key: "status",
      label: "Status",
      render: (p) => <ToneBadge tone={PROPOSAL_STATUS[p.status].tone} label={PROPOSAL_STATUS[p.status].label} />,
    },
    {
      key: "actions",
      label: "Ações",
      align: "right",
      mobile: "actions",
      render: (p) => (
        <div className="inline-flex gap-2">
          <IconLink to={`/fornecedor/propostas/${p.id}`} label={`Ver proposta #${p.id}`}>
            <EyeIcon width={18} height={18} />
          </IconLink>
          {p.status === "sent" && (
            <IconLink to={`/fornecedor/propostas/${p.id}/editar`} label={`Editar proposta #${p.id}`}>
              <EditIcon width={18} height={18} />
            </IconLink>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Propostas enviadas"
        description="Acompanhe as propostas que você enviou aos clientes."
        actions={
          <Button as={Link} to="/fornecedor/propostas/nova">
            <PlusIcon width={16} height={16} />
            Nova proposta
          </Button>
        }
      />

      <section aria-label="Resumo por status" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATUS_CARDS.map((card) => (
          <SummaryCard
            key={card.status}
            icon={card.icon}
            tone={card.tone}
            label={card.label}
            value={proposals.filter((proposal) => proposal.status === card.status).length}
            active={status === card.status}
            onClick={() => changeStatus(card.status)}
          />
        ))}
      </section>

      <Card className="p-0">
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[2fr_1fr] sm:p-6">
          <Input
            id="proposal-search"
            label="Buscar"
            type="search"
            placeholder="Buscar por cliente, serviço ou ID..."
            leftIcon={<SearchIcon width={18} height={18} />}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
          <Select
            id="proposal-status"
            label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">Todos</option>
            {Object.entries(PROPOSAL_STATUS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <DataTable
          columns={columns}
          rows={pageItems}
          rowKey={(row) => row.id}
          emptyMessage="Nenhuma proposta encontrada para esses filtros."
        />
        <Pagination
          page={currentPage}
          pages={pages}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          noun="propostas"
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
