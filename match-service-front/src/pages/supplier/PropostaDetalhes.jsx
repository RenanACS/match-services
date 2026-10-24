import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ToneBadge from "../../components/supplier/ToneBadge";
import PageHeader from "../../components/supplier/PageHeader";
import { EditIcon } from "../../components/supplier/icons";
import useSupplierData from "../../context/supplier/useSupplierData";
import { PROPOSAL_STATUS } from "../../data/fornecedor";
import { formatCurrency, formatDate, formatTime } from "../../utils/supplierFormat";

function Info({ label, children }) {
  return (
    <div>
      <dt className="app-small font-medium text-cream/70">{label}</dt>
      <dd className="mt-1 text-cream">{children}</dd>
    </div>
  );
}

/** Detalhes da proposta (/fornecedor/propostas/:id). */
export default function SupplierProposalDetails() {
  const { id } = useParams();
  const { proposals } = useSupplierData();
  const proposal = proposals.find((item) => item.id === id);

  if (!proposal) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <PageHeader title="Proposta não encontrada" />
        <Card>
          <p className="app-text text-cream/70">Não existe uma proposta com o número #{id}.</p>
          <Button as={Link} to="/fornecedor/propostas" variant="secondary" className="mt-4">
            Ver todas as propostas
          </Button>
        </Card>
      </div>
    );
  }

  const status = PROPOSAL_STATUS[proposal.status];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={`Proposta #${proposal.id}`}
        description={proposal.service}
        actions={
          <>
            <ToneBadge tone={status.tone} label={status.label} />
            {proposal.status === "sent" && (
              <Button as={Link} to={`/fornecedor/propostas/${proposal.id}/editar`} variant="secondary">
                <EditIcon width={16} height={16} />
                Editar proposta
              </Button>
            )}
          </>
        }
      />

      <Card>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Info label="Cliente">{proposal.client}</Info>
          <Info label="Serviço">{proposal.service}</Info>
          <Info label="Valor">{formatCurrency(proposal.value)}</Info>
          <Info label="Prazo de entrega">{proposal.days} dias</Info>
          <Info label="Enviada em">
            {formatDate(proposal.sentAt)} às {formatTime(proposal.sentAt)}
          </Info>
          <Info label="Status">{status.label}</Info>
        </dl>
        <h2 className="mt-6 app-small font-medium text-cream/70">Descrição</h2>
        <p className="mt-1 app-text text-cream/75">{proposal.description}</p>
        {proposal.status !== "sent" && (
          <p className="mt-4 app-text text-cream/70">
            Só propostas com status "Enviada" podem ser editadas.
          </p>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        {proposal.requestId && (
          <Button as={Link} to={`/fornecedor/solicitacoes/${proposal.requestId}`} variant="secondary">
            Ver solicitação #{proposal.requestId}
          </Button>
        )}
        <Button as={Link} to="/fornecedor/propostas" variant="ghost">
          Todas as propostas
        </Button>
      </div>
    </div>
  );
}
