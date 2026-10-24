// Propostas ilustrativas vinculadas pelo ID da solicitação.
// No backend Django, este conjunto será substituído pela API de propostas.
// Valores em centavos, para evitar erros de arredondamento.
export const proposalsByRequest = {
  "req-002": [
    {
      id: "prop-002-01",
      requestId: "req-002",
      supplierName: "Predial Manutenções Ltda",
      amountCents: 235000,
      sentAt: "2026-09-21",
      pdfUrl: "/propostas/proposta-manutencao-predial-demo.pdf",
      fileName: "proposta-manutencao-predial-demo.pdf",
      illustrative: true,
    },
  ],
};

export function getRequestProposals(requestId) {
  return proposalsByRequest[requestId] ?? [];
}

export function formatProposalAmount(amountCents) {
  return (amountCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
