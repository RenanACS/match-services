import Input from "../ui/Input";
import { SearchIcon } from "../dashboard/icons";
import { REQUEST_STATUS } from "../../data/dashboard";

export const STATUS_FILTERS = [
  { value: "all", label: "Todas" },
  ...Object.entries(REQUEST_STATUS).map(([value, { label }]) => ({ value, label })),
];

/**
 * Busca + filtros de status em uma única faixa. A partir de `xl`, a busca
 * cresce para ocupar o espaço disponível e os filtros ficam ao lado dela
 * (mesma linha); abaixo disso, empilham. Ambos operam só sobre os dados
 * mockados já carregados — nenhuma chamada de rede.
 */
export default function RequestsToolbar({ query, onQueryChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-3">
      <div className="xl:flex-1">
        <Input
          id="requests-search"
          type="search"
          aria-label="Buscar por serviço ou categoria"
          enterKeyHint="search"
          fieldSize="md"
          leftIcon={<SearchIcon />}
          placeholder="Buscar por serviço ou categoria..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="xl:min-h-[38px] xl:py-2"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
        {STATUS_FILTERS.map((filter) => {
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
