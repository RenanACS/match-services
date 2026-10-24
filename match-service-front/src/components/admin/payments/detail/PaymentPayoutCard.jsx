import AdminSectionTitle from "../../AdminSectionTitle";
import { ValueTag } from "../PaymentBadges";
import { dateOf, money, timeOf } from "../../requests/RequestParts";
import { readAuthorizationForRequest } from "../../../../services/disputeFinancials";

const PILL = {
  done: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  processing: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  held: "border-red-500/30 bg-red-500/15 text-red-400",
  default: "border-hairline bg-surface-3 text-cream/90",
};

function Cell({ label, children, first = false }) {
  return (
    <div className={`px-0 py-3 sm:px-5 ${first ? "sm:pl-0" : "sm:border-l sm:border-hairline"} xl:py-1.5`}>
      <p className="adm-text text-cream/70">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">{children}</div>
    </div>
  );
}

/**
 * Repasse ao fornecedor: situação, data/condição e valor. Nenhuma data exata é
 * inventada ("Não definida" quando desconhecida) e "Repassado" só aparece com
 * o evento de repasse. Sem botão de liberar repasse: é automático pelo provedor.
 */
export default function PaymentPayoutCard({ payment }) {
  const { payout } = payment;
  const refunded = payment.status === "refunded";
  const pill = PILL[payout.key] ?? PILL.default;
  const authorization = payout.effective ? null : readAuthorizationForRequest(payment.requestId);
  return (
    <section aria-labelledby="payment-payout" className="rounded-[20px] border border-hairline bg-surface-1 p-5 xl:py-4">
      <AdminSectionTitle id="payment-payout" icon="transfer">Repasse ao fornecedor</AdminSectionTitle>
      <div className="mt-2 grid sm:grid-cols-3">
        <Cell first label="Situação do repasse">
          <span className={`adm-text rounded-lg border px-3 py-1.5 font-medium ${pill}`}>{payout.label}</span>
        </Cell>
        <Cell label={payout.effective ? "Repasse concluído em" : "Data prevista"}>
          <p className="adm-text text-cream">
            {payout.effective
              ? payout.doneAt ? `${dateOf(payout.doneAt)} às ${timeOf(payout.doneAt)}` : "Não informada"
              : payout.when}
          </p>
        </Cell>
        <Cell label={payout.effective ? "Valor repassado" : "Valor a ser repassado"}>
          {refunded ? (
            <span className="adm-stat-number text-cream/70">—</span>
          ) : (
            <>
              <span className={`adm-stat-number whitespace-nowrap ${payout.effective ? "text-cream" : "text-cream/70"}`}>{money(payment.payoutCents)}</span>
              <ValueTag effective={payout.effective}>{payout.effective ? "Repassado" : "Previsto"}</ValueTag>
            </>
          )}
        </Cell>
      </div>
      {authorization && (
        <p className="adm-small mt-2 text-cream/70">
          O valor acima é a previsão original, anterior à contestação. A destinação autorizada de forma demonstrativa está em "Resolução da contestação", abaixo, e ainda não foi executada.
        </p>
      )}
    </section>
  );
}
