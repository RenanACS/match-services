import { useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import SupplierHeaderCard from "../../components/admin/suppliers/detail/SupplierHeaderCard";
import SupplierTabs from "../../components/admin/suppliers/detail/SupplierTabs";
import OverviewTab from "../../components/admin/suppliers/detail/OverviewTab";
import ServicesTab from "../../components/admin/suppliers/detail/ServicesTab";
import DocumentsTab from "../../components/admin/suppliers/detail/DocumentsTab";
import ReviewsTab from "../../components/admin/suppliers/detail/ReviewsTab";
import HistoryTab from "../../components/admin/suppliers/detail/HistoryTab";
import FinanceTab from "../../components/admin/suppliers/detail/FinanceTab";
import { TABS } from "../../components/admin/suppliers/detail/helpers";
import SupplierDialogs, { DECISION_NOTICES } from "../../components/admin/suppliers/SupplierDialogs";
import useAdminSuppliers from "../../context/useAdminSuppliers";

/**
 * Detalhes do fornecedor (/admin/fornecedores/:id). A análise cadastral
 * acontece aqui (status "Em análise"), sem página própria. A aba ativa fica
 * na URL (?aba=). Dados em modo de consulta: o administrador não edita o
 * cadastro; as decisões abrem modais sobre esta página.
 */
export default function FornecedorAdminDetalhe() {
  const { id } = useParams();
  const { state } = useLocation();
  const [params, setParams] = useSearchParams();
  const { getSupplier, decide } = useAdminSuppliers();
  const [mode, setMode] = useState(null); // approve | reject | block | unblock | reason
  const [notice, setNotice] = useState("");
  const supplier = getSupplier(id);
  const backTo = `/admin/fornecedores${state?.fromSearch ?? ""}`;

  if (!supplier) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <h1 className="adm-page-title">Fornecedor não encontrado</h1>
        <Card>
          <p className="adm-text text-cream/70">Não existe fornecedor com este identificador.</p>
          <Link to="/admin/fornecedores" className="mt-3 inline-block adm-text text-orange hover:underline">
            Voltar para Fornecedores
          </Link>
        </Card>
      </div>
    );
  }

  const requestedTab = params.get("aba");
  const tab = TABS.some((item) => item.key === requestedTab) ? requestedTab : "visao-geral";
  const setTab = (key) => {
    const next = new URLSearchParams(params);
    if (key === "visao-geral") next.delete("aba");
    else next.set("aba", key);
    setParams(next, { replace: true, state });
  };

  function handleConfirm(text) {
    decide(supplier.id, mode, text);
    setNotice(DECISION_NOTICES[mode](supplier.name));
    setMode(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <Link to={backTo} className="adm-text text-cream/60 transition hover:text-orange">
        ← Fornecedores
      </Link>

      <SupplierHeaderCard
        supplier={supplier}
        onAction={(action) => {
          setNotice("");
          setMode(action);
        }}
      />

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 adm-text text-emerald-400">
          {notice}
        </p>
      )}

      <SupplierTabs active={tab} onChange={setTab} />

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "visao-geral" && <OverviewTab supplier={supplier} onSeeServices={() => setTab("servicos")} />}
        {tab === "servicos" && <ServicesTab supplier={supplier} />}
        {tab === "documentos" && <DocumentsTab supplier={supplier} />}
        {tab === "avaliacoes" && <ReviewsTab supplier={supplier} />}
        {tab === "historico" && <HistoryTab supplier={supplier} />}
        {tab === "financeiro" && <FinanceTab supplier={supplier} />}
      </div>

      <SupplierDialogs
        dialog={mode ? { supplier, mode } : null}
        onConfirm={handleConfirm}
        onClose={() => setMode(null)}
      />
    </div>
  );
}
