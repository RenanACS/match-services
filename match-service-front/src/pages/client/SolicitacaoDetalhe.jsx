import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { Card, DemoNote, Fact, RequestStatusBadge, ReleaseBadge, formatDate } from "../../components/solicitacoes/detail/RequestParts";
import RequestTimeline from "../../components/solicitacoes/detail/RequestTimeline";
import NextStepsCard from "../../components/solicitacoes/detail/NextStepsCard";
import ProposalsCard from "../../components/solicitacoes/detail/ProposalsCard";
import AcceptedProposalCard from "../../components/solicitacoes/detail/AcceptedProposalCard";
import { ContractCard, HeldPaymentCard } from "../../components/solicitacoes/detail/ContractCards";
import CompletionCard from "../../components/solicitacoes/detail/CompletionCard";
import ConfirmCompletionDialog from "../../components/solicitacoes/detail/ConfirmCompletionDialog";
import { acceptProposal, canConfirmCompletion, confirmCompletion, getRequestDetail, requestNumber } from "../../services/clientRequests";

/**
 * Detalhes e acompanhamento da solicitação (/app/solicitacoes/:id). O conteúdo
 * muda conforme o status: em análise, propostas recebidas, aguardando
 * pagamento, contratada e concluída. Dados DEMONSTRATIVOS; as ações (aceitar
 * proposta, confirmar conclusão) só registram a intenção do cliente e estão
 * preparadas para endpoints do Django (ver services/clientRequests.js). O React
 * nunca libera pagamentos.
 */
export default function SolicitacaoDetalhe() {
  const { id } = useParams();
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState("");
  const [completing, setCompleting] = useState(false);
  const [busy, setBusy] = useState(false);
  // `version` força a releitura depois de uma ação simulada.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => getRequestDetail(id), [id, version]);

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3">
        <h1 className="app-page-title text-cream">Solicitação não encontrada</h1>
        <Link to="/app/solicitacoes" className="app-text inline-flex items-center gap-1.5 text-cream/60 transition hover:text-orange">
          Voltar para solicitações
        </Link>
      </div>
    );
  }

  const { request, detail, supplierOf, simulated } = data;
  const status = request.status;
  const eligible = canConfirmCompletion(data);
  const accepted = detail.proposals?.find((proposal) => proposal.id === detail.acceptedProposalId);

  async function handleAccept(proposalId) {
    await acceptProposal(request.id, proposalId);
    setNotice("Proposta aceita (simulado). O serviço só será contratado após a confirmação do pagamento.");
    setVersion((v) => v + 1);
  }

  async function handleConfirmCompletion() {
    setBusy(true);
    try {
      await confirmCompletion(request.id);
      setNotice("Conclusão informada (simulado). A liberação do pagamento aguarda a validação do backend e a confirmação do provedor.");
      setVersion((v) => v + 1);
    } finally {
      setBusy(false);
      setCompleting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 xl:gap-3.5">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="app-page-title text-cream">Solicitação #{requestNumber(request.id)}</h1>
        <RequestStatusBadge status={status} />
        {status === "completed" && <ReleaseBadge release={detail.release} />}
      </header>

      {notice && (
        <p role="status" className="app-text rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400">
          {notice}
        </p>
      )}

      <div className="grid gap-3 xl:grid-cols-3 xl:items-start">
        <div className="flex min-w-0 flex-col gap-3 xl:col-span-2">
          <Card title={request.title} icon="requests" id="summary-title">
            <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Fact icon="tag" label="Categoria">{request.category}</Fact>
              <Fact icon="calendar" label="Data da solicitação">{formatDate(request.date)}</Fact>
              <Fact icon="mapPin" label="Local do serviço">{detail.location}</Fact>
              <Fact icon="info" label="Status atual">
                <RequestStatusBadge status={status} />
              </Fact>
            </dl>
            <h3 className="app-small mt-3 text-cream/50">Descrição do serviço</h3>
            <p className="app-text mt-0.5 text-cream/80">{detail.description}</p>
            <p className="app-small mt-2 text-cream/50">Período desejado: {detail.period}</p>
          </Card>

          {status === "proposals" && (
            <ProposalsCard proposals={detail.proposals} supplierOf={supplierOf} onAccept={handleAccept} />
          )}

          {status === "awaiting_payment" && accepted && (
            <AcceptedProposalCard proposal={accepted} supplier={supplierOf(accepted.supplierId)} acceptedAt={detail.dates.acceptedAt} />
          )}

          {status === "hired" && (
            <>
              <ContractCard contract={detail.contract} supplier={supplierOf(detail.contract.supplierId)} />
              <HeldPaymentCard payment={detail.payment}>
                <div className="mt-3 flex flex-col gap-2">
                  <div>
                    <Button
                      type="button"
                      variant="primary"
                      appearance="app"
                      disabled={!eligible}
                      onClick={() => setCompleting(true)}
                    >
                      <Icon name="checkCircle" size={16} />
                      Confirmar conclusão do serviço
                    </Button>
                  </div>
                  {!eligible && (
                    <p className="app-small text-cream/50">
                      Disponível apenas quando o pagamento estiver retido pela plataforma e o serviço em execução.
                    </p>
                  )}
                  <DemoNote>Dados e ações demonstrativos: a liberação real do pagamento depende do backend e do provedor financeiro.</DemoNote>
                </div>
              </HeldPaymentCard>
            </>
          )}

          {status === "completed" && (
            <>
              <ContractCard contract={{ ...detail.contract, execution: "completed" }} supplier={supplierOf(detail.contract.supplierId)} />
              <CompletionCard detail={detail} simulated={simulated} />
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <RequestTimeline status={status} detail={detail} />
          <NextStepsCard status={status} />
        </div>
      </div>

      {completing && (
        <ConfirmCompletionDialog
          title={request.title}
          busy={busy}
          onConfirm={handleConfirmCompletion}
          onClose={() => setCompleting(false)}
        />
      )}
    </div>
  );
}
