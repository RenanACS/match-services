import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import RequestStatCard from "../../components/admin/requests/RequestStatCard";
import RequestFilters from "../../components/admin/requests/RequestFilters";
import RequestsTable from "../../components/admin/requests/RequestsTable";
import RequestCardList from "../../components/admin/requests/RequestCardList";
import Pagination from "../../components/admin/Pagination";
import { SUPPLIER_CATEGORIES } from "../../data/adminSuppliers";
import {
  PAGE_SIZE,
  PERIODS,
  REQUEST_STATUS_FILTERS,
  allRequests,
  countByCategory,
  filterRequests,
  paginate,
  supplierOptions,
} from "../../services/adminRequests";

/**
 * Solicitações (/admin/solicitacoes): somente consulta. Busca, filtros, cartões
 * (que também filtram) e página ficam na URL
 * (?q=&situacao=&categoria=&fornecedor=&periodo=&pagina=). 4 por página.
 * O Admin não cria solicitações: quem inicia a contratação é o cliente.
 */
export default function SolicitacoesAdmin() {
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const status = REQUEST_STATUS_FILTERS.includes(params.get("situacao")) ? params.get("situacao") : "all";
  const category = SUPPLIER_CATEGORIES.includes(params.get("categoria")) ? params.get("categoria") : "all";
  const supplier = supplierOptions.some((s) => s.value === params.get("fornecedor")) ? params.get("fornecedor") : "all";
  const period = PERIODS.some((p) => p.value === params.get("periodo")) ? params.get("periodo") : "all";
  const requestedPage = Number(params.get("pagina")) || 1;

  function update(changes) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || value === "all" || (key === "pagina" && value === 1)) next.delete(key);
      else next.set(key, String(value));
    }
    setParams(next, { replace: true });
  }
  const updateFilter = (changes) => update({ ...changes, pagina: 1 });

  const counts = useMemo(() => countByCategory(allRequests), []);
  const filtered = useMemo(
    () => filterRequests(allRequests, { query, status, category, supplier, period }),
    [query, status, category, supplier, period],
  );
  const pageData = paginate(filtered, requestedPage, PAGE_SIZE);
  const toggleStatus = (key) => updateFilter({ situacao: status === key ? "all" : key });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 xl:gap-4">
      <header>
        <h1 className="adm-page-title">Solicitações de serviço</h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <RequestStatCard icon="clock" tone="amber" label="Aguardando confirmação" value={counts.awaiting} active={status === "awaiting"} onClick={() => toggleStatus("awaiting")} />
        <RequestStatCard icon="settings" tone="blue" label="Em andamento" value={counts.in_progress} active={status === "in_progress"} onClick={() => toggleStatus("in_progress")} />
        <RequestStatCard icon="check" tone="green" label="Concluídas" value={counts.completed} active={status === "completed"} onClick={() => toggleStatus("completed")} />
        <RequestStatCard icon="close" tone="red" label="Canceladas" value={counts.cancelled} active={status === "cancelled"} onClick={() => toggleStatus("cancelled")} />
      </div>

      <RequestFilters
        query={query}
        category={category}
        supplier={supplier}
        period={period}
        onQueryChange={(value) => updateFilter({ q: value })}
        onCategoryChange={(value) => updateFilter({ categoria: value })}
        onSupplierChange={(value) => updateFilter({ fornecedor: value })}
        onPeriodChange={(value) => updateFilter({ periodo: value })}
        onClear={() => setParams(new URLSearchParams(), { replace: true })}
      />

      <section aria-label="Lista de solicitações" className="rounded-[20px] border border-hairline bg-surface-1">
        {pageData.total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="adm-text font-medium text-cream">Nenhuma solicitação encontrada</p>
            <p className="adm-text mt-1 text-cream/70">Ajuste a busca ou os filtros para ver resultados.</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <RequestsTable requests={pageData.items} />
            </div>
            <div className="xl:hidden">
              <RequestCardList requests={pageData.items} />
            </div>
            <div className="border-t border-hairline">
              <Pagination
                page={pageData.page}
                totalPages={pageData.totalPages}
                total={pageData.total}
                start={pageData.start}
                pageSize={PAGE_SIZE}
                itemLabel="solicitações"
                onPageChange={(page) => update({ pagina: page })}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
