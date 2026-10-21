import Icon from "../../AdminIcons";
import { SupplierAvatar, SupplierStatusBadge } from "../SupplierBadges";
import { formatDateTime } from "../../../../utils/dates";

const OUTLINE = "inline-flex min-h-[40px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 adm-text font-medium transition";

/** Botões de decisão compatíveis com o status atual (sem ações contraditórias). */
function AdminActions({ supplier, onAction }) {
  switch (supplier.status) {
    case "review":
      return (
        <>
          <button type="button" onClick={() => onAction("reject")} className={`${OUTLINE} flex-1 border-red-500/60 text-red-400 hover:bg-red-500/10`}>
            <Icon name="xCircle" size={16} /> Rejeitar cadastro
          </button>
          <button type="button" onClick={() => onAction("approve")} className={`${OUTLINE} flex-1 border-orange bg-orange text-ink hover:bg-orange-light`}>
            <Icon name="checkCircle" size={16} /> Aprovar cadastro
          </button>
        </>
      );
    case "active":
      return (
        <button type="button" onClick={() => onAction("block")} className={`${OUTLINE} flex-1 border-red-500/60 text-red-400 hover:bg-red-500/10`}>
          <Icon name="lock" size={16} /> Bloquear fornecedor
        </button>
      );
    case "blocked":
      return (
        <button type="button" onClick={() => onAction("unblock")} className={`${OUTLINE} flex-1 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10`}>
          <Icon name="unlock" size={16} /> Desbloquear fornecedor
        </button>
      );
    default:
      return (
        <button type="button" onClick={() => onAction("reason")} className={`${OUTLINE} flex-1 border-hairline text-cream hover:border-orange/60`}>
          <Icon name="info" size={16} /> Consultar motivo da rejeição
        </button>
      );
  }
}

/** Cabeçalho dos detalhes: identificação da empresa + "Ações do administrador". */
export default function SupplierHeaderCard({ supplier, onAction }) {
  return (
    <section
      aria-label="Resumo do fornecedor"
      className="grid rounded-[20px] border border-hairline bg-surface-1 lg:grid-cols-[1fr_23rem]"
    >
      <div className="flex min-w-0 items-center gap-4 p-5">
        <SupplierAvatar name={supplier.name} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="adm-page-title">{supplier.name}</h1>
            <SupplierStatusBadge status={supplier.status} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 adm-text text-cream/70">
            <span>CNPJ {supplier.cnpj}</span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="suppliers" size={14} /> {supplier.category}
            </span>
          </p>
          <p className="mt-1 adm-small text-cream/50">Cadastrado em {formatDateTime(supplier.registeredAt)}</p>
        </div>
      </div>
      <div className="border-t border-hairline p-5 lg:border-l lg:border-t-0">
        <h2 className="adm-text font-medium text-cream">Ações do administrador</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <AdminActions supplier={supplier} onAction={onAction} />
        </div>
      </div>
    </section>
  );
}
