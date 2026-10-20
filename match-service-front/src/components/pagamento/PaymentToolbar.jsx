import Input from "../ui/Input";
import { SearchIcon } from "../dashboard/icons";
import { PAYMENT_STATUS } from "../../data/payments";

export const PAYMENT_STATUS_FILTERS = [
  { value: "all", label: "Todos" },
  ...Object.entries(PAYMENT_STATUS).map(([value, { label }]) => ({ value, label })),
];

/**
 * Busca + filtros de status em uma única faixa, mesmo padrão de
 * RequestsToolbar (Minhas Solicitações). A partir de `xl`, a busca cresce
 * para ocupar o espaço disponível e os filtros ficam ao lado dela; abaixo
 * disso, empilham. Ambos operam só sobre os dados mockados já carregados.
 */
export default function PaymentToolbar({ query, onQueryChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-3">
      <div className="xl:flex-1">
        <Input
          id="payments-search"
          type="search"
          aria-label="Buscar por serviço ou empresa"
          enterKeyHint="search"
          fieldSize="md"
          leftIcon={<SearchIcon />}
          placeholder="Buscar por serviço ou empresa..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="xl:min-h-[38px] xl:py-2"
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
              className={`min-h-[40px] shrink-0 rounded-xl border px-4 font-mono text-xs font-medium uppercase tracking-widest transition xl:min-h-[38px] ${
                active
                  ? "border-orange bg-orange-soft text-orange"
                  : "border-hairline text-cream/60 hover:text-cream"
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
