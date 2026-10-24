import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import DisputeSummaryCard from "../../components/admin/disputes/detail/DisputeSummaryCard";
import DisputePartiesCard from "../../components/admin/disputes/detail/DisputePartiesCard";
import DisputeEvidenceCard from "../../components/admin/disputes/detail/DisputeEvidenceCard";
import DisputeAnalysisCard from "../../components/admin/disputes/detail/DisputeAnalysisCard";
import { AssumeDialog, ConcludeDialog } from "../../components/admin/disputes/detail/DisputeDialogs";
import useAdminDisputes from "../../context/useAdminDisputes";
import { DISPUTE_DECISIONS } from "../../services/adminDisputes";
import { getPayment } from "../../services/adminPayments";
import { getAvailableBalance } from "../../services/disputeFinancials";

/**
 * Detalhes da contestação (/admin/contestacoes/:id). As ações (assumir
 * análise, observação, concluir com justificativa) são DEMONSTRATIVAS e ficam
 * só neste navegador. Registrar uma decisão e a destinação dos valores é uma
 * AUTORIZAÇÃO demonstrativa: não executa nenhuma operação financeira (sem
 * reembolso, estorno ou repasse).
 */
export default function ContestacaoDetalhe() {
  const { id } = useParams();
  const { getDispute, assume, addNote, conclude } = useAdminDisputes();
  const dispute = getDispute(id);
  const [dialog, setDialog] = useState(null); // "assume" | "conclude" | null
  const [feedback, setFeedback] = useState("");

  if (!dispute) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <h1 className="adm-page-title">Contestação não encontrada</h1>
        <Card>
          <p className="adm-text text-cream/70">Não existe contestação com este identificador.</p>
          <Link to="/admin/contestacoes" className="adm-text mt-3 inline-block text-orange hover:underline">
            Ver todas as contestações
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header>
        <h1 className="adm-page-title">Detalhes da contestação</h1>
      </header>

      {feedback && (
        <p role="status" className="adm-text rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400">
          {feedback}
        </p>
      )}

      <DisputeSummaryCard dispute={dispute} />
      <DisputePartiesCard dispute={dispute} />
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <DisputeEvidenceCard dispute={dispute} />
        <DisputeAnalysisCard
          dispute={dispute}
          onAssume={() => setDialog("assume")}
          onConclude={() => setDialog("conclude")}
          onAddNote={(text) => {
            addNote(dispute.id, text);
            setFeedback("Observação registrada (demonstrativo: guardada só neste navegador).");
          }}
        />
      </div>

      {dialog === "assume" && (
        <AssumeDialog
          dispute={dispute}
          onClose={() => setDialog(null)}
          onConfirm={() => {
            assume(dispute.id);
            setDialog(null);
            setFeedback("Análise assumida (demonstrativo: guardada só neste navegador).");
          }}
        />
      )}
      {dialog === "conclude" && (
        <ConcludeDialog
          dispute={dispute}
          balance={getAvailableBalance(getPayment(`PG${dispute.requestId}`))}
          onClose={() => setDialog(null)}
          onConfirm={(fields) => {
            const result = conclude(dispute.id, fields);
            if (result.ok) {
              setDialog(null);
              setFeedback(
                result.financial.authorizationStatus === "demo_authorized"
                  ? `Decisão registrada: ${DISPUTE_DECISIONS[fields.decision]}. Destinação financeira autorizada (demonstrativa); nenhuma movimentação financeira foi executada.`
                  : `Decisão registrada: ${DISPUTE_DECISIONS[fields.decision]}. Nenhuma destinação financeira foi autorizada e nenhuma movimentação foi executada.`,
              );
            }
            return result;
          }}
        />
      )}
    </div>
  );
}
