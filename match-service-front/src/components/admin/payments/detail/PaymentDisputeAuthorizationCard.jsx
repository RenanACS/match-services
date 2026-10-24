import { Link } from "react-router-dom";
import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";
import DisputeResolutionSummary from "../../disputes/detail/DisputeResolutionSummary";
import { readAuthorizationForRequest } from "../../../../services/disputeFinancials";
import { dateOf, timeOf } from "../../requests/RequestParts";

/**
 * Destinação financeira autorizada por uma contestação (somente consulta).
 * Lê o MESMO registro da decisão em Contestações (nada é duplicado) e deixa
 * claro que é uma autorização demonstrativa: o status do pagamento e do
 * repasse NÃO mudam aqui, porque nenhuma movimentação foi executada. Só
 * aparece quando existe uma decisão com destinação registrada neste navegador.
 */
export default function PaymentDisputeAuthorizationCard({ payment }) {
  const found = readAuthorizationForRequest(payment.requestId);
  if (!found) return null;
  const { disputeId, decision, financial } = found;
  return (
    <section aria-labelledby="payment-dispute-auth" className="rounded-[20px] border border-hairline bg-surface-1 p-5 xl:py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AdminSectionTitle id="payment-dispute-auth" icon="gavel">Resolução da contestação</AdminSectionTitle>
        <Link to={`/admin/contestacoes/${disputeId}`} className="adm-small inline-flex items-center gap-1 text-orange hover:underline">
          Ver contestação #{disputeId}
          <Icon name="arrowRight" size={14} />
        </Link>
      </div>
      <p className="adm-small mt-1 text-cream/70">Registrada em {dateOf(decision.at)} às {timeOf(decision.at)} · {decision.by}</p>
      <div className="mt-3">
        <DisputeResolutionSummary resolution={financial} showStatus />
      </div>
      <p className="adm-small mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-300">
        Autorização demonstrativa: o pagamento continua {payment.status === "held" ? "retido" : "com a situação acima"} e o repasse não foi alterado, porque nenhuma movimentação foi executada. Só o provedor financeiro, via backend, poderá confirmar reembolso ou repasse reais.
      </p>
    </section>
  );
}
