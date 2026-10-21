import Icon from "../AdminIcons";
import LabeledSelect from "../AdminLabeledSelect";
import { PAYMENT_METHODS, PAYMENT_STATUSES, PAYMENT_STATUS_ORDER, PERIODS } from "../../../services/adminPayments";

const STATUS_OPTIONS = [{ value: "all", label: "Todas" }, ...PAYMENT_STATUS_ORDER.map((key) => ({ value: key, label: PAYMENT_STATUSES[key].label }))];
const METHOD_OPTIONS = [{ value: "all", label: "Todos" }, ...PAYMENT_METHODS.map((m) => ({ value: m, label: m }))];
const PERIOD_OPTIONS = PERIODS.map(({ value, label }) => ({ value, label: value === "all" ? "Todas as datas" : label }));

/** Painel de filtros em uma linha: busca | Situação | Método de pagamento | Período | Limpar. */
export default function PaymentFilters({ query, status, method, period, onQueryChange, onStatusChange, onMethodChange, onPeriodChange, onClear }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline bg-surface-1/60 px-3 py-3">
      <div className="relative w-full lg:min-w-[240px] lg:flex-1">
        <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/50" />
        <input
          type="search"
          aria-label="Buscar pagamento"
          placeholder="Buscar por ID, cliente ou fornecedor..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="adm-filter min-h-[40px] w-full rounded-xl border border-hairline bg-surface-1 pl-11 pr-4 text-cream placeholder:text-cream/40 focus:border-orange focus:outline-none"
        />
      </div>
      <LabeledSelect id="filter-payment-status" label="Situação" options={STATUS_OPTIONS} value={status} onChange={onStatusChange} className="sm:w-36" />
      <LabeledSelect id="filter-payment-method" label="Método de pagamento" options={METHOD_OPTIONS} value={method} onChange={onMethodChange} className="sm:w-44" />
      <LabeledSelect id="filter-payment-period" label="Período" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} className="sm:w-36" />
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
