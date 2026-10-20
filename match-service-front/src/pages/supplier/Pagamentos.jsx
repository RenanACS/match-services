import { useMemo, useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ToneBadge from "../../components/supplier/ToneBadge";
import SummaryCard from "../../components/supplier/SummaryCard";
import PageHeader from "../../components/supplier/PageHeader";
import DataTable from "../../components/supplier/DataTable";
import Pagination from "../../components/supplier/Pagination";
import { IconLink } from "../../components/supplier/IconLink";
import { CheckIcon, ClockIcon, EyeIcon, SearchIcon, WalletIcon } from "../../components/supplier/icons";
import useSupplierData from "../../context/supplier/useSupplierData";
import { PAYMENT_STATUS } from "../../data/fornecedor";
import { formatCurrency, formatDate } from "../../utils/supplierFormat";
import { matchesPeriod, normalize, paginate, PERIOD_OPTIONS } from "../../utils/supplierFilters";

const PAGE_SIZE = 8;

/** Pagamentos (/fornecedor/pagamentos): saldo em escrow, a receber, recebido e histórico. */
export default function SupplierPayments() {
  const { payments } = useSupplierData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);

  const sumBy = (key) =>
    payments.filter((payment) => payment.status === key).reduce((sum, payment) => sum + payment.value, 0);

  function changeFilter(setter) {
    return (event) => {
      setter(event.target.value);
      setPage(1);
    };
  }

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return payments
      .filter(
        (payment) =>
          (!term || normalize(`${payment.id} ${payment.client} ${payment.service}`).includes(term)) &&
          (status === "all" || payment.status === status) &&
          matchesPeriod(payment.date, period),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [payments, query, status, period]);

  const { pageItems, pages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);

  const columns = [
    { key: "id", label: "ID", mobile: "title", render: (p) => <span className="font-mono text-cream/80">{p.id}</span> },
    { key: "client", label: "Cliente", render: (p) => <span className="text-cream">{p.client}</span> },
    { key: "service", label: "Serviço", render: (p) => p.service },
    { key: "value", label: "Valor", render: (p) => <span className="whitespace-nowrap text-cream">{formatCurrency(p.value)}</span> },
    { key: "date", label: "Data", render: (p) => formatDate(p.date) },
    {
      key: "status",
      label: "Status",
      render: (p) => <ToneBadge tone={PAYMENT_STATUS[p.status].tone} label={PAYMENT_STATUS[p.status].label} />,
    },
    {
      key: "actions",
      label: "Ações",
      align: "right",
      mobile: "actions",
      render: (p) =>
        p.requestId ? (
          <IconLink to={`/fornecedor/solicitacoes/${p.requestId}`} label={`Ver solicitação #${p.requestId}`}>
            <EyeIcon width={18} height={18} />
          </IconLink>
        ) : (
          <span className="text-xs text-cream/40">—</span>
        ),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader title="Pagamentos" description="Acompanhe os valores retidos em escrow, a receber e já liberados." />

      <section aria-label="Resumo financeiro" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={WalletIcon}
          tone="orange"
          label="Saldo em escrow"
          value={formatCurrency(sumBy("escrow"))}
          hint="Retido até a aprovação do cliente"
        />
        <SummaryCard
          icon={ClockIcon}
          tone="warning"
          label="A receber"
          value={formatCurrency(sumBy("pending"))}
          hint="Aguardando pagamento do cliente"
        />
        <SummaryCard
          icon={CheckIcon}
          tone="success"
          label="Recebido no mês"
          value={formatCurrency(sumBy("released"))}
          hint="Valores já liberados"
        />
      </section>

      <Card className="p-0">
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-[2fr_1fr_1fr]">
          <div className="sm:col-span-2 xl:col-span-1">
            <Input
              id="payment-search"
              label="Buscar"
              type="search"
              placeholder="Buscar por cliente, serviço ou ID..."
              leftIcon={<SearchIcon width={18} height={18} />}
              value={query}
              onChange={changeFilter(setQuery)}
            />
          </div>
          <Select id="payment-status" label="Status" value={status} onChange={changeFilter(setStatus)}>
            <option value="all">Todos</option>
            {Object.entries(PAYMENT_STATUS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select id="payment-period" label="Período" value={period} onChange={changeFilter(setPeriod)}>
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
          emptyMessage="Nenhum pagamento encontrado para esses filtros."
        />
        <Pagination
          page={currentPage}
          pages={pages}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          noun="pagamentos"
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
