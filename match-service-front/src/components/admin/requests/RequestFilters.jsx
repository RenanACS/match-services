import Icon from "../AdminIcons";
import LabeledSelect from "../AdminLabeledSelect";
import { PERIODS, supplierOptions } from "../../../services/adminRequests";
import { SUPPLIER_CATEGORIES } from "../../../data/adminSuppliers";

const CATEGORY_OPTIONS = [{ value: "all", label: "Todas" }, ...SUPPLIER_CATEGORIES.map((c) => ({ value: c, label: c }))];
const SUPPLIER_OPTIONS = [{ value: "all", label: "Todos" }, ...supplierOptions];
const PERIOD_OPTIONS = PERIODS.map(({ value, label }) => ({ value, label }));

/** Painel de filtros em uma linha: busca | Categoria | Fornecedor | Período | Limpar. */
export default function RequestFilters({ query, category, supplier, period, onQueryChange, onCategoryChange, onSupplierChange, onPeriodChange, onClear }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline bg-surface-1/60 px-3 py-3">
      <div className="relative w-full lg:min-w-[260px] lg:flex-1">
        <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/70" />
        <input
          type="search"
          aria-label="Buscar solicitação"
          placeholder="Buscar cliente, fornecedor, serviço ou ID"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="adm-filter min-h-[40px] w-full rounded-xl border border-hairline bg-surface-1 pl-11 pr-4 text-cream placeholder:text-cream/70 focus:border-orange focus:outline-none"
        />
      </div>
      <LabeledSelect id="filter-request-category" label="Categoria" options={CATEGORY_OPTIONS} value={category} onChange={onCategoryChange} className="sm:w-32" />
      <LabeledSelect id="filter-request-supplier" label="Fornecedor" options={SUPPLIER_OPTIONS} value={supplier} onChange={onSupplierChange} className="sm:w-40" />
      <LabeledSelect id="filter-request-period" label="Período" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} className="sm:w-36" />
      <button
        type="button"
        onClick={onClear}
        className="adm-button flex min-h-[40px] items-center gap-2 rounded-xl border border-orange/70 px-4 text-orange transition hover:bg-orange-soft "
      >
        <Icon name="refresh" size={16} />
        Limpar filtros
      </button>
    </div>
  );
}
