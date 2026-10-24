import Icon from "../AdminIcons";
import LabeledSelect from "../AdminLabeledSelect";

const TYPE_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "PF", label: "PF" },
  { value: "PJ", label: "PJ" },
];
const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "blocked", label: "Bloqueados" },
];

/** Painel de filtros em uma linha: busca | Tipo | Status | Limpar (valores vivem na URL). */
export default function ClientFilters({
  query,
  type,
  status,
  onQueryChange,
  onTypeChange,
  onStatusChange,
  onClear,
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline bg-surface-1/60 px-3 py-3">
      <div className="relative w-full lg:min-w-[240px] lg:flex-1">
        <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/70" />
        <input
          type="search"
          aria-label="Buscar cliente"
          placeholder="Buscar por nome, CPF/CNPJ ou e-mail"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="adm-filter min-h-[40px] w-full rounded-xl border border-hairline bg-surface-1 pl-11 pr-4 text-cream placeholder:text-cream/70 focus:border-orange focus:outline-none"
        />
      </div>
      <LabeledSelect id="filter-type" label="Tipo" options={TYPE_OPTIONS} value={type} onChange={onTypeChange} className="sm:w-36" />
      <LabeledSelect id="filter-status" label="Status" options={STATUS_OPTIONS} value={status} onChange={onStatusChange} className="sm:w-36" />
      <button
        type="button"
        onClick={onClear}
        className="adm-button flex min-h-[40px] items-center gap-2 rounded-xl border border-orange/70 px-4 text-orange transition hover:bg-orange-soft"
      >
        <Icon name="refresh" size={16} />
        Limpar filtros
      </button>
    </div>
  );
}
