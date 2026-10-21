import Icon from "../AdminIcons";
import LabeledSelect from "../AdminLabeledSelect";
import { DISPUTE_REASONS, DISPUTE_STATUSES, DISPUTE_STATUS_ORDER, PERIODS } from "../../../services/adminDisputes";

const STATUS_OPTIONS = [{ value: "all", label: "Todas" }, ...DISPUTE_STATUS_ORDER.map((k) => ({ value: k, label: DISPUTE_STATUSES[k].label }))];
const REASON_OPTIONS = [{ value: "all", label: "Todos" }, ...Object.entries(DISPUTE_REASONS).map(([value, label]) => ({ value, label }))];
const PERIOD_OPTIONS = PERIODS.map(({ value, label }) => ({ value, label: value === "all" ? "Todas as datas" : label }));

/** Filtros em uma linha: busca | Situação | Motivo | Período | Limpar filtros. */
export default function DisputeFilters({ query, status, reason, period, onQueryChange, onStatusChange, onReasonChange, onPeriodChange, onClear }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline bg-surface-1/60 px-3 py-3">
      <div className="relative w-full lg:min-w-[240px] lg:flex-1">
        <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/50" />
        <input
          type="search"
          aria-label="Buscar contestação"
          placeholder="ID, cliente, fornecedor ou solicitação..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="adm-filter min-h-[40px] w-full rounded-xl border border-hairline bg-surface-1 pl-11 pr-4 text-cream placeholder:text-cream/40 focus:border-orange focus:outline-none"
        />
      </div>
      <LabeledSelect id="filter-dispute-status" label="Situação" options={STATUS_OPTIONS} value={status} onChange={onStatusChange} className="sm:w-32" />
      <LabeledSelect id="filter-dispute-reason" label="Motivo" options={REASON_OPTIONS} value={reason} onChange={onReasonChange} className="sm:w-44" />
      <LabeledSelect id="filter-dispute-period" label="Período" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} className="sm:w-36" />
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
