import { useMemo, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import SupplierFilters from "../../components/admin/suppliers/SupplierFilters";
import SuppliersTable from "../../components/admin/suppliers/SuppliersTable";
import SupplierCardList from "../../components/admin/suppliers/SupplierCardList";
import SupplierStatCard from "../../components/admin/suppliers/SupplierStatCard";
import SupplierDialogs, { DECISION_NOTICES } from "../../components/admin/suppliers/SupplierDialogs";
import Pagination from "../../components/admin/Pagination";
import useAdminSuppliers from "../../context/useAdminSuppliers";
import { SUPPLIER_CATEGORIES } from "../../data/adminSuppliers";
import { filterSuppliers, paginate, PAGE_SIZE } from "../../services/adminSuppliers";

const VALID_STATUS = ["all", "review", "active", "blocked", "rejected"];

/**
 * Fornecedores (/admin/fornecedores): listagem com busca, filtros e
 * paginação (5 por página). Filtros e página ficam na URL
 * (?q=&categoria=&situacao=&pagina=). As decisões (aprovar, rejeitar,
 * bloquear, desbloquear) abrem modais sobre esta página — não há rota própria.
 */
export default function FornecedoresAdmin() {
  const { suppliers, decide } = useAdminSuppliers();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [dialog, setDialog] = useState(null); // { supplier, mode }
  const [notice, setNotice] = useState("");

  const query = params.get("q") ?? "";
  const category = SUPPLIER_CATEGORIES.includes(params.get("categoria")) ? params.get("categoria") : "all";
  const status = VALID_STATUS.includes(params.get("situacao")) ? params.get("situacao") : "all";
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

  const counts = useMemo(
    () => ({
      total: suppliers.length,
      review: suppliers.filter((s) => s.status === "review").length,
      active: suppliers.filter((s) => s.status === "active").length,
      blocked: suppliers.filter((s) => s.status === "blocked").length,
    }),
    [suppliers],
  );

  const filtered = useMemo(
    () => filterSuppliers(suppliers, { query, category, status }),
    [suppliers, query, category, status],
  );
  const pageData = paginate(filtered, requestedPage, PAGE_SIZE);

  function handleAction(action, supplier) {
    setNotice("");
    if (action === "details") navigate(`/admin/fornecedores/${supplier.id}`, { state: { fromSearch: search } });
    else if (action === "analyze") {
      navigate(`/admin/fornecedores/${supplier.id}?aba=documentos`, { state: { fromSearch: search } });
    } else setDialog({ supplierId: supplier.id, mode: action });
  }

  const dialogSupplier = dialog ? suppliers.find((s) => s.id === dialog.supplierId) : null;

  function handleConfirm(text) {
    decide(dialog.supplierId, dialog.mode, text);
    setNotice(DECISION_NOTICES[dialog.mode](dialogSupplier.name));
    setDialog(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 xl:gap-3.5">
      <header>
        <h1 className="adm-page-title">Fornecedores</h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <SupplierStatCard
          icon="suppliers"
          value={counts.total}
          label="Total de fornecedores"
          active={status === "all"}
          onClick={() => updateFilter({ situacao: "all" })}
        />
        <SupplierStatCard
          icon="requests"
          tone="amber"
          value={counts.review}
          label="Em análise"
          active={status === "review"}
          onClick={() => updateFilter({ situacao: "review" })}
        />
        <SupplierStatCard
          icon="checkCircle"
          tone="green"
          value={counts.active}
          label="Ativos"
          active={status === "active"}
          onClick={() => updateFilter({ situacao: "active" })}
        />
        <SupplierStatCard
          icon="lock"
          tone="red"
          value={counts.blocked}
          label="Bloqueados"
          active={status === "blocked"}
          onClick={() => updateFilter({ situacao: "blocked" })}
        />
      </div>

      <SupplierFilters
        query={query}
        category={category}
        status={status}
        onQueryChange={(value) => updateFilter({ q: value })}
        onCategoryChange={(value) => updateFilter({ categoria: value })}
        onStatusChange={(value) => updateFilter({ situacao: value })}
        onClear={() => {
          setNotice("");
          setParams(new URLSearchParams(), { replace: true });
        }}
      />

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 adm-text text-emerald-400">
          {notice}
        </p>
      )}

      <section aria-label="Lista de fornecedores" className="rounded-[20px] border border-hairline bg-surface-1">
        {pageData.total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-medium text-cream">Nenhum fornecedor encontrado</p>
            <p className="mt-1 adm-text text-cream/60">Ajuste a busca ou os filtros para ver resultados.</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <SuppliersTable suppliers={pageData.items} onAction={handleAction} />
            </div>
            <div className="xl:hidden">
              <SupplierCardList suppliers={pageData.items} onAction={handleAction} />
            </div>
            <div className="border-t border-hairline">
              <Pagination
                page={pageData.page}
                totalPages={pageData.totalPages}
                total={pageData.total}
                start={pageData.start}
                pageSize={PAGE_SIZE}
                itemLabel="fornecedores"
                onPageChange={(page) => update({ pagina: page })}
              />
            </div>
          </>
        )}
      </section>

      {dialogSupplier && (
        <SupplierDialogs
          dialog={{ supplier: dialogSupplier, mode: dialog.mode }}
          onConfirm={handleConfirm}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
