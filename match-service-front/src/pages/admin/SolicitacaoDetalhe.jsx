import { Link, useParams } from "react-router-dom";
import Icon from "../../components/admin/AdminIcons";
import Card from "../../components/ui/Card";
import { StageBadge } from "../../components/admin/requests/RequestBadges";
import RequestPartyCard from "../../components/admin/requests/detail/RequestPartyCard";
import RequestServiceCard from "../../components/admin/requests/detail/RequestServiceCard";
import RequestTimeline from "../../components/admin/requests/detail/RequestTimeline";
import RequestPaymentSummary from "../../components/admin/requests/detail/RequestPaymentSummary";
import { getRequest } from "../../services/adminRequests";


/**
 * Detalhes da solicitação (/admin/solicitacoes/:id): só a Visão geral, em modo
 * de consulta. Sem abas de Andamento/Pagamento/Histórico/Contestações e sem
 * ações de criar solicitação, concluir serviço, confirmar pagamento ou liberar
 * repasse (exceções serão tratadas em Pagamentos e Contestações).
 */
export default function SolicitacaoDetalhe() {
  const { id } = useParams();
  const request = getRequest(id);

  if (!request) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <h1 className="adm-page-title">Solicitação não encontrada</h1>
        <Card>
          <p className="adm-text text-cream/70">Não existe solicitação com este identificador.</p>
          <Link to="/admin/solicitacoes" className="adm-text mt-3 inline-block text-orange hover:underline">
            Ver todas as solicitações
          </Link>
        </Card>
      </div>
    );
  }

  const { client, supplier } = request;
  const clientDoc = `${client.type === "PF" ? "CPF" : "CNPJ"} ${client.document}`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="adm-page-title">Solicitação #{request.id}</h1>
          <StageBadge request={request} />
        </div>
      </header>

      <div className="border-b border-hairline">
        <span className="adm-text -mb-px inline-flex items-center gap-2 border-b-2 border-orange px-4 py-3 font-medium text-orange">
          <Icon name="file" size={18} />
          Visão geral
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <RequestPartyCard
          id="request-client"
          title="Cliente"
          icon="user"
          name={client.name}
          documentLine={clientDoc}
          locationLine={`${client.address.city} - ${client.address.state}`}
          phone={client.phone}
          email={client.email}
          to={`/admin/clientes/${client.id}`}
          buttonLabel="Ver perfil do cliente"
        />
        <RequestPartyCard
          id="request-supplier"
          title="Fornecedor"
          icon="suppliers"
          name={supplier.name}
          documentLine={`CNPJ ${supplier.cnpj}`}
          locationLine={`${supplier.address.city} - ${supplier.address.state}`}
          phone={supplier.phone}
          email={supplier.email}
          to={`/admin/fornecedores/${supplier.id}`}
          buttonLabel="Ver perfil do fornecedor"
        />
        <RequestServiceCard request={request} />
      </div>

      <RequestTimeline request={request} />
      <RequestPaymentSummary request={request} />
    </div>
  );
}
