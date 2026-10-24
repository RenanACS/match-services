import { useSearchParams } from "react-router-dom";
import ServiceRequestForm from "../../components/requests/ServiceRequestForm";

/**
 * Nova Solicitação (/app/solicitacao).
 * Se chegar com ?fornecedor=<id> (link "Solicitar serviço" da página de
 * detalhes), o fornecedor já vem pré-selecionado no formulário; entrando
 * direto pela rota, o cliente escolhe o fornecedor na própria tela.
 */
export default function NovaSolicitacao() {
  const [searchParams] = useSearchParams();
  const initialSupplierId = searchParams.get("fornecedor") || "";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <h1 className="app-page-title text-cream">Nova solicitação</h1>

      <div className="rounded-[20px] border border-hairline bg-surface-1 p-4 sm:p-5">
        <ServiceRequestForm initialSupplierId={initialSupplierId} />
      </div>
    </div>
  );
}
