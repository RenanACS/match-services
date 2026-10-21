import { Link } from "react-router-dom";
import Badge from "../../ui/Badge";
import Icon from "../../ui/Icon";
import { Card, Fact, formatDate, formatMoney } from "./RequestParts";

export const EXECUTION_STATUS = {
  in_progress: { label: "Em execução", variant: "orange" },
  completed: { label: "Concluída", variant: "success" },
};

/** Fornecedor contratado + serviço contratado + situação da execução. */
export function ContractCard({ contract, supplier }) {
  const execution = EXECUTION_STATUS[contract.execution];
  return (
    <Card title="Contratação" icon="wrench" id="contract-title">
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact icon="building" label="Fornecedor contratado">
          {supplier ? (
            <Link to={`/app/fornecedores/${supplier.id}`} className="font-medium hover:text-orange">
              {supplier.name}
            </Link>
          ) : (
            "—"
          )}
        </Fact>
        <Fact icon="phone" label="Contato">{supplier?.phone ?? "—"}</Fact>
        <Fact icon="wrench" label="Serviço contratado">{contract.service}</Fact>
        <Fact icon="dollar" label="Valor acordado">{formatMoney(contract.valueCents)}</Fact>
        <Fact icon="calendar" label="Data da contratação">{formatDate(contract.hiredAt)}</Fact>
        <Fact icon="clock" label="Previsão de execução">{formatDate(contract.expectedAt)}</Fact>
        <Fact icon="info" label="Status da execução">
          <Badge variant={execution.variant} appearance="app">{execution.label}</Badge>
        </Fact>
      </dl>
    </Card>
  );
}

/** Pagamento retido pela plataforma (informativo; a liberação é do backend/provedor). */
export function HeldPaymentCard({ payment, children }) {
  return (
    <Card title="Pagamento retido pela plataforma" icon="lock" id="held-title">
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact icon="dollar" label="Valor retido">{formatMoney(payment.amountCents)}</Fact>
        <Fact icon="calendar" label="Pagamento confirmado em">{formatDate(payment.paidAt)}</Fact>
      </dl>
      <p className="app-text mt-3 flex items-start gap-2 text-cream/70">
        <Icon name="shieldCheck" size={16} className="mt-0.5 shrink-0 text-cream/50" />
        O valor fica retido pela plataforma e só é liberado ao fornecedor depois que você confirmar a conclusão do serviço e o
        provedor financeiro confirmar a liberação.
      </p>
      {children}
    </Card>
  );
}
