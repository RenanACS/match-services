import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ToneBadge from "../../components/supplier/ToneBadge";
import PageHeader from "../../components/supplier/PageHeader";
import DataTable from "../../components/supplier/DataTable";
import Pagination from "../../components/supplier/Pagination";
import ConfirmDialog from "../../components/supplier/ConfirmDialog";
import Notice from "../../components/supplier/Notice";
import { IconButton, IconLink } from "../../components/supplier/IconLink";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "../../components/supplier/icons";
import useSupplierData from "../../context/supplier/useSupplierData";
import { SUPPLIER_CATEGORIES } from "../../data/fornecedor";
import { formatCurrency } from "../../utils/supplierFormat";
import { normalize, paginate } from "../../utils/supplierFilters";

const PAGE_SIZE = 8;

/** Serviços oferecidos (/fornecedor/servicos): listar, ativar/desativar, editar e excluir. */
export default function SupplierServices() {
  const { services, deleteService, toggleService } = useSupplierData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activity, setActivity] = useState("all");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState("");

  function changeFilter(setter) {
    return (event) => {
      setter(event.target.value);
      setPage(1);
    };
  }

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return services.filter(
      (service) =>
        (!term || normalize(`${service.name} ${service.category}`).includes(term)) &&
        (category === "all" || service.category === category) &&
        (activity === "all" || (activity === "active") === service.active),
    );
  }, [services, query, category, activity]);

  const { pageItems, pages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);

  const columns = [
    {
      key: "name",
      label: "Serviço",
      mobile: "title",
      render: (s) => (
        <div className="text-left">
          <p className="text-cream">{s.name}</p>
          <p className="max-w-xs truncate text-xs text-cream/50">{s.description}</p>
        </div>
      ),
    },
    { key: "category", label: "Categoria", render: (s) => s.category },
    {
      key: "price",
      label: "Faixa de preço",
      render: (s) => (
        <span className="whitespace-nowrap">
          {formatCurrency(s.minPrice)} – {formatCurrency(s.maxPrice)}
        </span>
      ),
    },
    {
      key: "active",
      label: "Status",
      render: (s) => <ToneBadge tone={s.active ? "success" : "neutral"} label={s.active ? "Ativo" : "Inativo"} />,
    },
    {
      key: "actions",
      label: "Ações",
      align: "right",
      mobile: "actions",
      render: (s) => (
        <div className="inline-flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              toggleService(s.id);
              setNotice(`Serviço "${s.name}" ${s.active ? "desativado" : "ativado"}.`);
            }}
            className="h-9 rounded-lg border border-hairline px-3 font-mono text-[11px] uppercase tracking-widest text-cream/70 transition hover:border-orange/60 hover:text-orange"
          >
            {s.active ? "Desativar" : "Ativar"}
          </button>
          <IconLink to={`/fornecedor/servicos/${s.id}/editar`} label={`Editar ${s.name}`}>
            <EditIcon width={18} height={18} />
          </IconLink>
          <IconButton label={`Excluir ${s.name}`} onClick={() => setToDelete(s)}>
            <TrashIcon width={18} height={18} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Serviços oferecidos"
        description="Cadastre e gerencie os serviços que aparecem para os clientes."
        actions={
          <Button as={Link} to="/fornecedor/servicos/novo">
            <PlusIcon width={16} height={16} />
            Novo serviço
          </Button>
        }
      />

      <Notice>{notice}</Notice>

      <Card className="p-0">
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-[2fr_1fr_1fr]">
          <div className="sm:col-span-2 xl:col-span-1">
            <Input
              id="service-search"
              label="Buscar"
              type="search"
              placeholder="Buscar por nome ou categoria..."
              leftIcon={<SearchIcon width={18} height={18} />}
              value={query}
              onChange={changeFilter(setQuery)}
            />
          </div>
          <Select id="service-category" label="Categoria" value={category} onChange={changeFilter(setCategory)}>
            <option value="all">Todas</option>
            {SUPPLIER_CATEGORIES.map((item) => (
              <option key={item.id} value={item.label}>
                {item.label}
              </option>
            ))}
          </Select>
          <Select id="service-activity" label="Status" value={activity} onChange={changeFilter(setActivity)}>
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          rows={pageItems}
          rowKey={(row) => row.id}
          emptyMessage="Nenhum serviço encontrado. Cadastre um novo serviço ou ajuste os filtros."
        />
        <Pagination
          page={currentPage}
          pages={pages}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          noun="serviços"
          onPageChange={setPage}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir serviço?"
        message={toDelete ? `"${toDelete.name}" será removido da sua lista de serviços.` : ""}
        confirmLabel="Excluir"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          deleteService(toDelete.id);
          setNotice(`Serviço "${toDelete.name}" excluído.`);
          setToDelete(null);
        }}
      />
    </div>
  );
}
