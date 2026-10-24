import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";
import AdminButton from "../../AdminButton";
import { DialogTextarea } from "../../AdminDialog";
import DisputeStatusBadge from "../DisputeBadges";
import { PaymentStatusBadge } from "../../payments/PaymentBadges";
import { dateOf, timeOf } from "../../requests/RequestParts";
import { DISPUTE_DECISIONS } from "../../../../services/adminDisputes";
import { getPayment } from "../../../../services/adminPayments";
import { DEMO_NOTE } from "./DisputeDialogs";
import DisputeResolutionSummary from "./DisputeResolutionSummary";

const HISTORY_ICONS = { opened: "flag", taken: "search", note: "pencil", decision: "gavel", financial: "dollar" };
const stamp = (iso) => `${dateOf(iso)} às ${timeOf(iso)}`;

/**
 * Análise administrativa: situação, situação FINANCEIRA (somente consulta),
 * ações demonstrativas, observações internas e histórico. A decisão registrada
 * NUNCA altera o pagamento/repasse: o bloco financeiro mostra os dados reais do
 * pagamento e avisa a diferença.
 */
export default function DisputeAnalysisCard({ dispute, onAssume, onConclude, onAddNote }) {
  const [noting, setNoting] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const payment = getPayment(`PG${dispute.requestId}`);
  const resolved = dispute.status === "resolved";

  function submitNote(event) {
    event.preventDefault();
    const value = note.trim();
    if (value.length < 5) return setError("Escreva a observação com ao menos 5 caracteres.");
    onAddNote(value);
    setNote("");
    setError("");
    setNoting(false);
  }

  return (
    <section aria-labelledby="dispute-analysis" className="flex flex-col gap-4 rounded-[20px] border border-hairline bg-surface-1 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AdminSectionTitle id="dispute-analysis" icon="shieldCheck">Análise administrativa</AdminSectionTitle>
        <div className="flex items-center gap-2">
          <span className="adm-small text-cream/70">Situação atual</span>
          <DisputeStatusBadge status={dispute.status} />
        </div>
      </div>

      {resolved && dispute.decision && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
          <p className="adm-text font-medium text-emerald-400">Decisão registrada: {DISPUTE_DECISIONS[dispute.decision.type]}</p>
          <p className="adm-text mt-1 text-cream/80">{dispute.decision.justification}</p>
          <p className="adm-small mt-1 text-cream/70">{stamp(dispute.decision.at)} · {dispute.decision.by}</p>
          {dispute.decision.financial ? (
            <div className="mt-3">
              <DisputeResolutionSummary resolution={dispute.decision.financial} disputeId={dispute.id} showStatus />
            </div>
          ) : (
            <p className="adm-small mt-2 text-cream/70">Decisão registrada antes da resolução financeira: sem destinação de valores associada (dados demonstrativos iniciais).</p>
          )}
        </div>
      )}

      {payment && (
        <div className="rounded-xl border border-hairline bg-surface-2/60 px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="adm-small text-cream/70">Situação financeira (somente consulta)</p>
            <Link to={`/admin/pagamentos/${payment.id}`} className="adm-small inline-flex items-center gap-1 text-orange hover:underline">
              Ver pagamento #{payment.id}
              <Icon name="arrowRight" size={14} />
            </Link>
          </div>
          <p className="adm-text mt-1.5 flex flex-wrap items-center gap-2 text-cream">
            Pagamento <PaymentStatusBadge status={payment.status} />
            <span className="text-cream/70">·</span>
            Repasse: <span className="font-medium">{payment.payout.label}</span>
          </p>
          <p className="adm-small mt-1.5 text-cream/70">
            {resolved
              ? "A decisão e a destinação autorizada são registros demonstrativos: não mudam o pagamento nem o repasse. Qualquer devolução ou transferência só será executada pelo backend e pelo provedor financeiro."
              : "Enquanto não houver decisão, o repasse permanece retido. Uma decisão futura também não executará operações financeiras por esta tela."}
          </p>
        </div>
      )}

      {!resolved && (
        <div>
          <div className="flex flex-wrap gap-2">
            {dispute.status === "open" && (
              <AdminButton onClick={onAssume}><Icon name="search" size={16} />Assumir análise</AdminButton>
            )}
            <AdminButton variant="secondary" aria-expanded={noting} onClick={() => setNoting((v) => !v)}>
              <Icon name="pencil" size={16} />Registrar observação
            </AdminButton>
            {dispute.status === "analysis" && (
              <AdminButton variant="success" onClick={onConclude}><Icon name="gavel" size={16} />Concluir contestação</AdminButton>
            )}
          </div>
          {dispute.status === "open" && <p className="adm-small mt-2 text-cream/70">Para concluir, assuma a análise primeiro.</p>}
          {noting && (
            <form onSubmit={submitNote} noValidate className="mt-3 flex flex-col gap-2">
              <DialogTextarea id="dispute-note" label="Observação interna" value={note} onChange={setNote} error={error} rows={2} placeholder="Visível apenas à equipe administrativa." />
              <div className="flex items-center justify-between gap-3">
                <p className="adm-small text-cream/70">{DEMO_NOTE}</p>
                <AdminButton type="submit">Salvar observação</AdminButton>
              </div>
            </form>
          )}
        </div>
      )}

      <div>
        <h3 className="adm-text font-medium text-cream">Observações internas</h3>
        {dispute.notes.length === 0 ? (
          <p className="adm-text mt-1 text-cream/70">Nenhuma observação registrada.</p>
        ) : (
          <ul className="mt-1.5 flex flex-col gap-2">
            {dispute.notes.map((n, i) => (
              <li key={`${n.at}-${i}`} className="rounded-xl border border-hairline px-3 py-2">
                <p className="adm-text text-cream/90">{n.text}</p>
                <p className="adm-small mt-0.5 text-cream/70">{stamp(n.at)} · {n.by}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="adm-text font-medium text-cream">Histórico de decisões e atualizações</h3>
        <ol className="mt-2 flex flex-col gap-2.5">
          {dispute.history.map((h, i) => (
            <li key={`${h.at}-${i}`} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-cream/70">
                <Icon name={HISTORY_ICONS[h.type] ?? "info"} size={13} />
              </span>
              <div className="min-w-0">
                <p className="adm-text text-cream/90">{h.text}</p>
                {h.justification && <p className="adm-small text-cream/70">Justificativa: {h.justification}</p>}
                {h.detail && <p className="adm-small text-cream/70">{h.detail}</p>}
                <p className="adm-small text-cream/70">{stamp(h.at)} · {h.by}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
