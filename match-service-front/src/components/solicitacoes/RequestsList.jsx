import Badge from "../ui/Badge";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import { REQUEST_STATUS } from "../../data/dashboard";
import { getRequestProposals, formatProposalAmount } from "../../data/proposals";
import { readDemoProposalAcceptances } from "../../services/proposalAcceptance";

export function formatRequestDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RequestRow({ request, acceptances }) {
  const accepted = acceptances[request.id];
  const status = accepted && request.status === "proposals"
    ? { label: "Aguardando pagamento", variant: "warning" }
    : REQUEST_STATUS[request.status];
  const proposals = getRequestProposals(request.id);
  const onlyProposal = proposals.length === 1 ? proposals[0] : null;
  const selectedProposal = accepted || (request.status === "proposals" ? onlyProposal : null);
  // Para serviços contratados/concluídos, usar os dados da contratação,
  // mesmo que não exista proposta demonstrativa vinculada ao registro.
  const contracted = request.status === "hired" || request.status === "completed";
  const contractedSupplier = contracted ? request.contractedSupplierName : null;
  const contractedAmount = contracted && Number.isInteger(request.contractedAmountCents)
    ? request.contractedAmountCents
    : null;
  const supplierLabel = contractedSupplier || selectedProposal?.supplierName || (
    proposals.length > 1
      ? `${proposals.length} propostas recebidas`
      : "Aguardando propostas"
  );
  const amountLabel = contractedAmount !== null
    ? formatProposalAmount(contractedAmount)
    : selectedProposal
      ? formatProposalAmount(selectedProposal.amountCents)
      : "—";
  const hasAmount = contractedAmount !== null || Boolean(selectedProposal);

  return (
    <tr className="border-t border-hairline align-middle transition-colors hover:bg-white/[0.025]">
      <td className="px-5 py-4 align-middle">
        <div className="app-text break-words font-medium text-cream">{supplierLabel}</div>
        {proposals.length > 1 && accepted && (
          <div className="app-small mt-1 text-cream/50">{proposals.length} propostas recebidas</div>
        )}
      </td>
      <td className="px-5 py-4 align-middle">
        <div className="app-text break-words font-medium text-cream">{request.title}</div>
        <div className="app-small mt-1 break-words text-cream/50">
          {request.category} · {formatRequestDate(request.date)}
        </div>
      </td>
      <td className="px-5 py-4 align-middle">
        <span className={`app-text font-semibold ${hasAmount ? "text-orange" : "text-cream/50"}`}>
          {amountLabel}
        </span>
      </td>
      <td className="px-5 py-4 align-middle">
        <Badge variant={status.variant} appearance="app">{status.label}</Badge>
      </td>
      <td className="px-5 py-4 text-right align-middle">
        <Link
          to={`/app/solicitacoes/${encodeURIComponent(request.id)}`}
          className="app-text inline-flex items-center justify-end gap-1.5 text-cream/70 transition hover:text-orange"
        >
          Ver detalhes
          <Icon name="arrowRight" size={14} />
        </Link>
      </td>
    </tr>
  );
}

/** Tabela de solicitações. Preserva os filtros e a paginação controlados pela página. */
export default function RequestsList({ requests, pageData, onPageChange }) {
  if (pageData.total === 0) {
    return (
      <div className="rounded-[20px] border border-hairline bg-surface-1 px-6 py-8 text-center">
        <p className="app-text text-cream/60">Nenhuma solicitação encontrada para essa busca ou filtro.</p>
      </div>
    );
  }

  const acceptances = readDemoProposalAcceptances();

  return (
    <section aria-label="Lista de solicitações" className="overflow-hidden rounded-[20px] border border-hairline bg-surface-1">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[27%]" />
            <col className="w-[15%]" />
            <col className="w-[19%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="bg-white/[0.025]">
            <tr className="app-small text-cream/55">
              <th scope="col" className="px-5 py-4 font-medium">Fornecedor</th>
              <th scope="col" className="px-5 py-4 font-medium">Serviço</th>
              <th scope="col" className="px-5 py-4 font-medium">Valor</th>
              <th scope="col" className="px-5 py-4 font-medium">Status</th>
              <th scope="col" className="px-5 py-4 text-right font-medium">Ação</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <RequestRow key={request.id} request={request} acceptances={acceptances} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-hairline">
        <Pagination
          page={pageData.page}
          totalPages={pageData.totalPages}
          total={pageData.total}
          start={pageData.start}
          pageSize={pageData.pageSize}
          itemLabel="solicitações"
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
