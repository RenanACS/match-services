import { formatBRL } from "../../../../utils/currency";
import { DISPUTE_DECISIONS } from "../../../../services/adminDisputes";
import { AUTHORIZATION_STATUS, EXECUTION_STATUS, REFUND_TYPES, REMAINDER_DESTINATIONS } from "../../../../services/disputeFinancials";

function Row({ label, children, strong = false }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-hairline/60 py-1.5 last:border-0">
      <dt className="adm-text text-cream/65">{label}</dt>
      <dd className={`adm-text text-right ${strong ? "font-medium text-cream" : "text-cream/90"}`}>{children}</dd>
    </div>
  );
}

/**
 * Resumo da resolução financeira DEMONSTRATIVA: o mesmo bloco aparece na
 * revisão do modal e na decisão já registrada. Comissão só sobre o valor bruto
 * do fornecedor; taxa demonstrativa (não definitiva). `status` mostra os estados
 * separados quando a decisão já foi registrada.
 */
export default function DisputeResolutionSummary({ resolution, disputeId, showStatus = false }) {
  const r = resolution;
  const dismissed = r.decisionType === "dismissed";
  const rate = r.commissionRatePercent;
  return (
    <dl className="rounded-xl border border-hairline bg-surface-2/60 px-3 py-1">
      {disputeId && <Row label="Contestação">#{disputeId}</Row>}
      <Row label="Decisão administrativa" strong>{DISPUTE_DECISIONS[r.decisionType]}</Row>
      {r.refundType && <Row label="Tipo de reembolso">{REFUND_TYPES[r.refundType]}</Row>}
      {r.remainderDestination && r.decisionType === "favor_client" && (
        <Row label="Destino do saldo restante">{REMAINDER_DESTINATIONS[r.remainderDestination]}</Row>
      )}
      <Row label="Valor disponível para resolução">{r.availableCents == null ? "Indisponível" : formatBRL(r.availableCents)}</Row>
      {dismissed ? (
        <Row label="Valor que continuará retido" strong>{r.retainedCents == null ? "Estado financeiro preservado" : formatBRL(r.retainedCents)}</Row>
      ) : (
        <>
          <Row label="Valor destinado ao cliente" strong>{formatBRL(r.clientCents)}</Row>
          <Row label="Valor bruto destinado ao fornecedor" strong>{formatBRL(r.supplierGrossCents)}</Row>
          <Row label={`Comissão da plataforma${rate == null ? "" : ` (${rate}% demonstrativa, só sobre o bruto do fornecedor)`}`}>
            {r.commissionCents == null ? "Pendente de configuração" : formatBRL(r.commissionCents)}
          </Row>
          <Row label="Valor líquido previsto ao fornecedor">{r.supplierNetCents == null ? "Não calculável (comissão pendente)" : formatBRL(r.supplierNetCents)}</Row>
          <Row label="Valor que continuará retido" strong>{formatBRL(r.retainedCents)}</Row>
        </>
      )}
      {showStatus && (
        <>
          <Row label="Autorização financeira">{AUTHORIZATION_STATUS[r.authorizationStatus]}</Row>
          <Row label="Movimentação financeira">{EXECUTION_STATUS[r.executionStatus]}</Row>
        </>
      )}
    </dl>
  );
}
