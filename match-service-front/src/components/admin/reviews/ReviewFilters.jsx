import Icon from "../AdminIcons";
import LabeledSelect from "../AdminLabeledSelect";
import { PERIODS, REVIEW_STATUSES } from "../../../services/adminReviews";

const RATING_OPTIONS = [{ value: "all", label: "Todas" }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} ${n === 1 ? "estrela" : "estrelas"}` }))];
const STATUS_OPTIONS = [{ value: "all", label: "Todas" }, ...Object.entries(REVIEW_STATUSES).map(([value, { label }]) => ({ value, label }))];
const PERIOD_OPTIONS = PERIODS.map(({ value, label }) => ({ value, label: value === "all" ? "Todas as datas" : label }));

/** Filtros em uma linha: busca | Nota | Situação | Período | Limpar filtros. */
export default function ReviewFilters({ query, rating, status, period, onQueryChange, onRatingChange, onStatusChange, onPeriodChange, onClear }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline bg-surface-1/60 px-3 py-3">
      <div className="relative w-full lg:min-w-[240px] lg:flex-1">
        <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/70" />
        <input
          type="search"
          aria-label="Buscar avaliação"
          placeholder="Buscar por cliente, fornecedor ou comentário..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="adm-filter min-h-[40px] w-full rounded-xl border border-hairline bg-surface-1 pl-11 pr-4 text-cream placeholder:text-cream/70 focus:border-orange focus:outline-none"
        />
      </div>
      <LabeledSelect id="filter-review-rating" label="Nota" options={RATING_OPTIONS} value={rating} onChange={onRatingChange} className="sm:w-32" />
      <LabeledSelect id="filter-review-status" label="Situação" options={STATUS_OPTIONS} value={status} onChange={onStatusChange} className="sm:w-32" />
      <LabeledSelect id="filter-review-period" label="Período" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} className="sm:w-36" />
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
