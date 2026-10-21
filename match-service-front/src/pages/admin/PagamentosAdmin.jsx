import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PaymentStatCard from "../../components/admin/payments/PaymentStatCard";
import PaymentFilters from "../../components/admin/payments/PaymentFilters";
import PaymentsTable from "../../components/admin/payments/PaymentsTable";
import PaymentCardList from "../../components/admin/payments/PaymentCardList";
import Pagination from "../../components/admin/Pagination";
import { formatBRL } from "../../utils/currency";
import {
  PAGE_SIZE,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PERIODS,
  allPayments,
  filterPayments,
  paginate,
  summarizePayments,
} from "../../services/adminPayments";

/**
 * Gestão de pagamentos (/admin/pagamentos): somente consulta. Busca, filtros e
 * página ficam na URL (?q=&situacao=&metodo=&periodo=&pagina=). 4 por página.
 * Os indicadores somam TODOS os pagamentos (não mudam com o filtro). O Admin
 * não confirma pagamentos nem libera repasses: isso vem do provedor financeiro.
 */
export default function PagamentosAdmin() {
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const status = params.get("situacao") in PAYMENT_STATUSES ? params.get("situacao") : "all";
  const method = PAYMENT_METHODS.includes(params.get("metodo")) ? params.get("metodo") : "all";
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

  const summary = useMemo(() => summarizePayments(allPayments), []);
  const filtered = useMemo(() => filterPayments(allPayments, { query, status, method, period }), [query, status, method, period]);
  const pageData = paginate(filtered, requestedPage, PAGE_SIZE);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 xl:gap-3">
      <header>
        <h1 className="adm-page-title">Gestão de pagamentos</h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <PaymentStatCard icon="payments" label="Pagamentos confirmados" value={formatBRL(summary.confirmed.cents)} />
        <PaymentStatCard icon="lock" label="Valores retidos" value={formatBRL(summary.held.cents)} />
        <PaymentStatCard icon="percent" label="Comissões da plataforma" value={formatBRL(summary.commission.cents)} />
        <PaymentStatCard icon="landmark" label="Repasses realizados" value={formatBRL(summary.released.cents)} />
      </div>

      <PaymentFilters
        query={query}
        status={status}
        method={method}
        period={period}
        onQueryChange={(value) => updateFilter({ q: value })}
        onStatusChange={(value) => updateFilter({ situacao: value })}
        onMethodChange={(value) => updateFilter({ metodo: value })}
        onPeriodChange={(value) => updateFilter({ periodo: value })}
        onClear={() => setParams(new URLSearchParams(), { replace: true })}
      />

      <section aria-label="Lista de pagamentos" className="rounded-[20px] border border-hairline bg-surface-1">
        {pageData.total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="adm-text font-medium text-cream">Nenhum pagamento encontrado</p>
            <p className="adm-text mt-1 text-cream/60">Ajuste a busca ou os filtros para ver resultados.</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <PaymentsTable payments={pageData.items} />
            </div>
            <div className="xl:hidden">
              <PaymentCardList payments={pageData.items} />
            </div>
            <div className="border-t border-hairline">
              <Pagination
                page={pageData.page}
                totalPages={pageData.totalPages}
                total={pageData.total}
                start={pageData.start}
                pageSize={PAGE_SIZE}
                itemLabel="pagamentos"
                onPageChange={(page) => update({ pagina: page })}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
