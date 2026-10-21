import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AdminStatTile from "../../components/admin/AdminStatTile";
import DisputeFilters from "../../components/admin/disputes/DisputeFilters";
import DisputesTable from "../../components/admin/disputes/DisputesTable";
import DisputeCardList from "../../components/admin/disputes/DisputeCardList";
import Pagination from "../../components/admin/Pagination";
import useAdminDisputes from "../../context/useAdminDisputes";
import {
  DISPUTE_REASONS,
  DISPUTE_STATUSES,
  PAGE_SIZE,
  PERIODS,
  countByStatus,
  filterDisputes,
  paginate,
  sortNewestFirst,
} from "../../services/adminDisputes";

/**
 * Gestão de contestações (/admin/contestacoes). Busca, filtros e página ficam
 * na URL (?q=&situacao=&motivo=&periodo=&pagina=). 4 por página. Os
 * indicadores refletem as ações demonstrativas feitas nos detalhes (guardadas
 * só neste navegador) e NÃO mudam com os filtros.
 */
export default function ContestacoesAdmin() {
  const { disputes } = useAdminDisputes();
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const status = params.get("situacao") in DISPUTE_STATUSES ? params.get("situacao") : "all";
  const reason = params.get("motivo") in DISPUTE_REASONS ? params.get("motivo") : "all";
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

  const counts = useMemo(() => countByStatus(disputes), [disputes]);
  const filtered = useMemo(
    () => sortNewestFirst(filterDisputes(disputes, { query, status, reason, period })),
    [disputes, query, status, reason, period],
  );
  const pageData = paginate(filtered, requestedPage, PAGE_SIZE);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 xl:gap-3">
      <header>
        <h1 className="adm-page-title">Gestão de contestações</h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <AdminStatTile icon="clock" tone="amber" label="Contestações abertas" value={counts.open} />
        <AdminStatTile icon="search" tone="blue" label="Em análise" value={counts.analysis} />
        <AdminStatTile icon="checkCircle" tone="green" label="Resolvidas" value={counts.resolved} />
        <AdminStatTile icon="disputes" tone="orange" label="Total de contestações" value={counts.total} />
      </div>

      <DisputeFilters
        query={query}
        status={status}
        reason={reason}
        period={period}
        onQueryChange={(value) => updateFilter({ q: value })}
        onStatusChange={(value) => updateFilter({ situacao: value })}
        onReasonChange={(value) => updateFilter({ motivo: value })}
        onPeriodChange={(value) => updateFilter({ periodo: value })}
        onClear={() => setParams(new URLSearchParams(), { replace: true })}
      />

      <section aria-label="Lista de contestações" className="rounded-[20px] border border-hairline bg-surface-1">
        {pageData.total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="adm-text font-medium text-cream">Nenhuma contestação encontrada</p>
            <p className="adm-text mt-1 text-cream/60">Ajuste a busca ou os filtros para ver resultados.</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block"><DisputesTable disputes={pageData.items} /></div>
            <div className="xl:hidden"><DisputeCardList disputes={pageData.items} /></div>
            <div className="border-t border-hairline">
              <Pagination
                page={pageData.page}
                totalPages={pageData.totalPages}
                total={pageData.total}
                start={pageData.start}
                pageSize={PAGE_SIZE}
                itemLabel="contestações"
                onPageChange={(page) => update({ pagina: page })}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
