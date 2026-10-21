import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../ui/Icon";
import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";
import { Card, DemoNote, formatMoney } from "./RequestParts";

function AcceptDialog({ proposal, supplier, busy, onConfirm, onClose }) {
  return (
    <Dialog title="Aceitar proposta?" titleId="accept-proposal-title" onClose={busy ? () => {} : onClose}>
      <p className="app-text text-cream/70">
        Você está aceitando a proposta de <strong className="font-medium text-cream">{supplier?.name}</strong> no valor de{" "}
        <strong className="font-medium text-cream">{formatMoney(proposal.valueCents)}</strong>, com prazo de {proposal.leadTime}.
      </p>
      <ol className="app-text mt-3 flex list-decimal flex-col gap-1 pl-5 text-cream/70">
        <li>Aceitar a proposta não contrata o serviço automaticamente.</li>
        <li>O próximo passo é o pagamento à plataforma, que fica retido até a conclusão.</li>
        <li>O serviço só é contratado depois que o provedor financeiro confirmar o pagamento.</li>
      </ol>
      <div className="mt-3">
        <DemoNote>Operação simulada: nenhum pagamento é gerado e nada é enviado a um servidor nesta etapa.</DemoNote>
      </div>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" appearance="app" disabled={busy} onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" variant="primary" appearance="app" disabled={busy} onClick={onConfirm}>
          {busy ? "Registrando..." : "Aceitar proposta"}
        </Button>
      </div>
    </Dialog>
  );
}

/**
 * Propostas recebidas (solicitações com propostas). "Aceitar proposta" abre a
 * confirmação e apenas registra a escolha (ver services/clientRequests.js).
 */
export default function ProposalsCard({ proposals, supplierOf, onAccept }) {
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onAccept(selected.id);
    } finally {
      setBusy(false);
      setSelected(null);
    }
  }

  return (
    <Card title={`Propostas recebidas (${proposals.length})`} icon="mail" id="proposals-title">
      <ul className="flex flex-col gap-3">
        {proposals.map((proposal) => {
          const supplier = supplierOf(proposal.supplierId);
          return (
            <li key={proposal.id} className="rounded-xl border border-hairline bg-surface-2 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="app-text flex items-center gap-2 font-semibold text-cream">
                    <Icon name="building" size={16} className="text-cream/60" />
                    {supplier?.name ?? "Fornecedor"}
                  </p>
                  <p className="app-small mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-cream/50">
                    {supplier && (
                      <>
                        <span>{supplier.category}</span>
                        <span className="inline-flex items-center gap-1">
                          <Icon name="star" size={12} className="fill-current text-orange-light" />
                          {supplier.rating.toFixed(1).replace(".", ",")}
                        </span>
                        <Link to={`/app/fornecedores/${supplier.id}`} className="text-cream/70 underline-offset-2 hover:text-orange hover:underline">
                          Ver fornecedor
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="app-stat-number text-cream">{formatMoney(proposal.valueCents)}</p>
                  <p className="app-small text-cream/50">Prazo estimado: {proposal.leadTime}</p>
                </div>
              </div>
              <p className="app-text mt-2 text-cream/60">{proposal.details}</p>
              <div className="mt-3 flex justify-end">
                <Button type="button" variant="primary" appearance="app" onClick={() => setSelected(proposal)}>
                  Aceitar proposta
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      {selected && (
        <AcceptDialog
          proposal={selected}
          supplier={supplierOf(selected.supplierId)}
          busy={busy}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}
    </Card>
  );
}
