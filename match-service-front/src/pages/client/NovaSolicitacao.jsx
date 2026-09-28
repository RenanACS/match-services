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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 xl:gap-2">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl xl:text-2xl">
          Nova solicitação
        </h1>
        <p className="mt-2 max-w-xl text-base text-cream/60 xl:mt-1 xl:text-sm">
          Envie os detalhes do serviço para o fornecedor escolhido.
        </p>
      </header>

      <div className="rounded-[20px] border border-hairline bg-surface-1 p-5 sm:p-6 xl:px-6 xl:py-3">
        <ServiceRequestForm initialSupplierId={initialSupplierId} />
      </div>
    </div>
  );
}
