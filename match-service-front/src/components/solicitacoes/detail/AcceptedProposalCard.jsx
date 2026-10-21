import { Link } from "react-router-dom";
import Icon from "../../ui/Icon";
import { Card, DemoNote, Fact, formatDate, formatMoney } from "./RequestParts";

/** Proposta aceita, aguardando o pagamento (ainda NÃO é uma contratação). */
export default function AcceptedProposalCard({ proposal, supplier, acceptedAt }) {
  return (
    <Card title="Proposta aceita" icon="checkCircle" id="accepted-title">
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact icon="building" label="Fornecedor">
          {supplier ? (
            <Link to={`/app/fornecedores/${supplier.id}`} className="hover:text-orange">
              {supplier.name}
            </Link>
          ) : (
            "—"
          )}
        </Fact>
        <Fact icon="dollar" label="Valor proposto">{formatMoney(proposal.valueCents)}</Fact>
        <Fact icon="clock" label="Prazo estimado">{proposal.leadTime}</Fact>
        <Fact icon="calendar" label="Aceita em">{formatDate(acceptedAt)}</Fact>
      </dl>
      <p className="app-text mt-3 flex items-start gap-2 text-cream/70">
        <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-cream/50" />
        O serviço ainda não está contratado: ele só é contratado depois que o pagamento à plataforma for confirmado pelo provedor financeiro.
      </p>
      <div className="mt-3">
        <DemoNote>Aceite registrado de forma simulada (sem backend).</DemoNote>
      </div>
    </Card>
  );
}
