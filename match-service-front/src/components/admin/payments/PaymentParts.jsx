import { Link } from "react-router-dom";
import Icon from "../AdminIcons";
import { money } from "../requests/RequestParts";

/** Somente o ícone de olho → detalhes do pagamento (sem confirmar nem repassar). */
export function PaymentViewLink({ payment, state }) {
  return (
    <Link
      to={`/admin/pagamentos/${payment.id}`}
      state={state}
      aria-label={`Ver detalhes do pagamento #${payment.id}`}
      title="Ver detalhes"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-cream/80 transition hover:border-orange/60 hover:text-cream"
    >
      <Icon name="eye" size={18} />
    </Link>
  );
}

/**
 * Valor de comissão/repasse: efetivo (repasse concluído) em destaque; previsto
 * em tom apagado com a etiqueta "Previsto"; sem valor ("—") quando estornado.
 */
export function PlannedMoney({ payment, cents, effective, inline = false }) {
  if (payment.status === "refunded") return <span className="adm-table text-cream/50">—</span>;
  return (
    <span className={inline ? "inline-flex items-center gap-1.5" : "block"}>
      <span className={`adm-table block whitespace-nowrap ${effective ? "text-cream" : "text-cream/60"}`}>{money(cents)}</span>
      {!effective && <span className="adm-small block text-amber-400/80">Previsto</span>}
    </span>
  );
}
