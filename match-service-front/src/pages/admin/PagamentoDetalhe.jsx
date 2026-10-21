import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import PaymentInfoCard from "../../components/admin/payments/detail/PaymentInfoCard";
import PaymentPartyCard from "../../components/admin/payments/detail/PaymentPartyCard";
import PaymentValuesCard from "../../components/admin/payments/detail/PaymentValuesCard";
import PaymentPayoutCard from "../../components/admin/payments/detail/PaymentPayoutCard";
import { getPayment } from "../../services/adminPayments";

/**
 * Detalhes do pagamento (/admin/pagamentos/:id): tela simplificada e somente de
 * consulta — informações, cliente e fornecedor, valores e repasse. Sem cartão
 * de solicitação vinculada, linha do tempo, abas, botão Voltar nem ações de
 * confirmar pagamento ou liberar repasse.
 */
export default function PagamentoDetalhe() {
  const { id } = useParams();
  const payment = getPayment(id);

  if (!payment) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <h1 className="adm-page-title">Pagamento não encontrado</h1>
        <Card>
          <p className="adm-text text-cream/70">Não existe pagamento com este identificador.</p>
          <Link to="/admin/pagamentos" className="adm-text mt-3 inline-block text-orange hover:underline">
            Ver todos os pagamentos
          </Link>
        </Card>
      </div>
    );
  }

  const { client, supplier } = payment;
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 xl:gap-3">
      <header>
        <h1 className="adm-page-title">Detalhes do pagamento</h1>
      </header>

      <PaymentInfoCard payment={payment} />

      <div className="grid gap-4 lg:grid-cols-2 xl:gap-3">
        <PaymentPartyCard
          id="payment-client"
          title="Cliente"
          icon="user"
          name={client.name}
          documentLabel={client.type === "PF" ? "CPF" : "CNPJ"}
          documentValue={client.document}
          to={`/admin/clientes/${client.id}`}
        />
        <PaymentPartyCard
          id="payment-supplier"
          title="Fornecedor"
          icon="suppliers"
          name={supplier.name}
          documentLabel="CNPJ"
          documentValue={supplier.cnpj}
          to={`/admin/fornecedores/${supplier.id}`}
        />
      </div>

      <PaymentValuesCard payment={payment} />
      <PaymentPayoutCard payment={payment} />
    </div>
  );
}
