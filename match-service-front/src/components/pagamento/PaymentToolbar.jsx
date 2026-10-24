import Input from "../ui/Input";
import Icon from "../ui/Icon";
import { PAYMENT_STATUS } from "../../data/payments";

export const PAYMENT_STATUS_FILTERS = [
  { value: "all", label: "Todos" },
  ...Object.entries(PAYMENT_STATUS).map(([value, { label }]) => ({ value, label })),
];

/**
 * Busca + filtros de status em um único painel (mesmo padrão dos filtros do
 * Admin e de Minhas solicitações). A partir de `xl` a busca cresce e os filtros ficam ao lado; abaixo
 * disso empilham. Operam só sobre os dados mockados — nenhuma chamada de rede.
 */
export default function PaymentToolbar({ query, onQueryChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-hairline bg-surface-1/60 p-3 xl:flex-row xl:items-center xl:gap-3">
      <div className="xl:flex-1">
        <Input
          id="payments-search"
          type="search"
          aria-label="Buscar por serviço ou empresa"
          enterKeyHint="search"
          appearance="app"
          leftIcon={<Icon name="search" size={16} />}
          placeholder="Buscar por serviço ou empresa..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
        {PAYMENT_STATUS_FILTERS.map((filter) => {
          const active = statusFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active}
              onClick={() => onStatusFilterChange(filter.value)}
              className={`app-button min-h-[40px] shrink-0 rounded-xl border px-3.5 transition ${
                active
                  ? "border-orange bg-orange-soft text-orange"
                  : "border-hairline text-cream/70 hover:text-cream"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
