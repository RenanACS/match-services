import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/supplier/StatusBadge";
import Avatar from "../../components/supplier/Avatar";
import PageHeader from "../../components/supplier/PageHeader";
import ConfirmDialog from "../../components/supplier/ConfirmDialog";
import Notice from "../../components/supplier/Notice";
import useSupplierData from "../../context/supplier/useSupplierData";
import useEntrega from "../../context/entrega/useEntrega";
import { SUPPLIER_REQUEST_STATUS } from "../../data/fornecedor";
import { formatCurrency, formatDate, formatTime } from "../../utils/supplierFormat";

function Info({ label, children }) {
  return (
    <div>
      <dt className="app-small font-medium text-cream/70">{label}</dt>
      <dd className="mt-1 text-cream">{children}</dd>
    </div>
  );
}

/**
 * Detalhes da solicitação (/fornecedor/solicitacoes/:id). Os botões de
 * status atualizam o estado da sessão: a lista e o Dashboard refletem a
 * mudança na hora.
 */
export default function SupplierRequestDetails() {
  const { id } = useParams();
  const { requests, proposals, updateRequestStatus } = useSupplierData();
  const { markProviderDone } = useEntrega();
  const request = requests.find((item) => item.id === id);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);
  const [notice, setNotice] = useState("");

  if (!request) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <PageHeader title="Solicitação não encontrada" />
        <Card>
          <p className="app-text text-cream/70">Não existe uma solicitação com o número #{id}.</p>
          <Button as={Link} to="/fornecedor/solicitacoes" variant="secondary" className="mt-4">
            Ver todas as solicitações
          </Button>
        </Card>
      </div>
    );
  }

  const relatedProposal = proposals.find((proposal) => proposal.requestId === request.id);

  function change(next) {
    updateRequestStatus(request.id, next);
    setNotice(`Status atualizado para "${SUPPLIER_REQUEST_STATUS[next].label}".`);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title={`Solicitação #${request.id}`}
        description={request.service}
        actions={<StatusBadge status={request.status} />}
      />

      <Notice>{notice}</Notice>

      {request.status === "awaiting" && (
        <Card className="border-orange/40">
          <p className="app-section-title text-orange">
            Concluída pelo fornecedor, aguardando confirmação do cliente
          </p>
          <p className="mt-1 app-text text-cream/70">
            Cliente notificado. Aguardando a confirmação dele para a liberação do pagamento.
          </p>
        </Card>
      )}
      {request.delivery?.clientConfirmedAt && (
        <Card className="border-emerald-500/30">
          <p className="app-section-title text-emerald-400">Cliente confirmou. Pagamento liberado.</p>
          <p className="mt-1 app-text text-cream/70">
            O valor saiu da custódia e já aparece como liberado em{" "}
            <Link to="/fornecedor/pagamentos" className="text-orange hover:underline">
              Pagamentos
            </Link>
            .
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <h2 className="app-section-title">Serviço</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Serviço">{request.service}</Info>
              <Info label="Categoria">{request.category}</Info>
              <Info label="Valor">{formatCurrency(request.value)}</Info>
              <Info label="Data da solicitação">
                {formatDate(request.date)} às {formatTime(request.date)}
              </Info>
            </dl>
            <p className="mt-4 app-text text-cream/70">{request.description}</p>
          </Card>

          <Card>
            <h2 className="app-section-title">Histórico</h2>
            <ol className="mt-4 flex flex-col gap-4 border-l border-hairline pl-5">
              {[...request.history].reverse().map((event) => (
                <li key={`${event.at}-${event.text}`} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-orange" aria-hidden="true" />
                  <p className="app-text text-cream">{event.text}</p>
                  <p className="app-small text-cream/70">
                    {formatDate(event.at)} às {formatTime(event.at)}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="app-section-title">Cliente</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={request.client.name} size="lg" />
              <div className="min-w-0">
                <p className="text-cream">{request.client.name}</p>
                <p className="app-text text-cream/70">{request.client.city}</p>
              </div>
            </div>
            <dl className="mt-4 flex flex-col gap-3">
              <Info label="Telefone">{request.client.phone}</Info>
              <Info label="E-mail">
                <span className="break-all">{request.client.email}</span>
              </Info>
            </dl>
          </Card>

          <Card>
            <h2 className="app-section-title">Ações</h2>
            <div className="mt-4 flex flex-col gap-3">
              {request.status === "pending" && (
                <>
                  <Button type="button" onClick={() => change("progress")}>
                    Aceitar solicitação
                  </Button>
                  {!relatedProposal && (
                    <Button as={Link} to={`/fornecedor/propostas/nova?solicitacao=${request.id}`} variant="secondary">
                      Enviar proposta
                    </Button>
                  )}
                </>
              )}
              {request.status === "progress" && (
                <Button type="button" onClick={() => setConfirmDone(true)}>
                  Serviço concluído
                </Button>
              )}
              {(request.status === "pending" || request.status === "progress") && (
                <Button type="button" variant="secondary" onClick={() => setConfirmCancel(true)}>
                  Cancelar solicitação
                </Button>
              )}
              {(request.status === "done" || request.status === "canceled" || request.status === "awaiting") && (
                <p className="app-text text-cream/70">
                  Esta solicitação está {SUPPLIER_REQUEST_STATUS[request.status].label.toLowerCase()} e não aceita
                  novas ações.
                </p>
              )}
              {relatedProposal && (
                <Button as={Link} to={`/fornecedor/propostas/${relatedProposal.id}`} variant="ghost">
                  Ver proposta #{relatedProposal.id}
                </Button>
              )}
              <Button as={Link} to="/fornecedor/solicitacoes" variant="ghost">
                Todas as solicitações
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDone}
        title="Confirmar serviço concluído?"
        message="O cliente será notificado e precisará confirmar o serviço prestado para a plataforma liberar o pagamento."
        confirmLabel="Serviço concluído"
        onCancel={() => setConfirmDone(false)}
        onConfirm={() => {
          setConfirmDone(false);
          setNotice("");
          markProviderDone(request.id);
        }}
      />

      <ConfirmDialog
        open={confirmCancel}
        title="Cancelar solicitação?"
        message={`A solicitação #${request.id} será marcada como cancelada. Essa ação não pode ser desfeita nesta tela.`}
        confirmLabel="Cancelar solicitação"
        onCancel={() => setConfirmCancel(false)}
        onConfirm={() => {
          setConfirmCancel(false);
          change("canceled");
        }}
      />
    </div>
  );
}
