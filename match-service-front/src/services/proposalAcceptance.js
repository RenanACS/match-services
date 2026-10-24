// Aceite exclusivamente demonstrativo. Não cria contrato, cobrança ou pagamento.
const STORAGE_KEY = "match-service-demo-proposal-acceptances-v1";

export function readDemoProposalAcceptances() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

export function saveDemoProposalAcceptance(requestId, proposal) {
  if (!requestId || !proposal || proposal.requestId !== requestId) {
    throw new Error("Proposta inválida para esta solicitação.");
  }
  const current = readDemoProposalAcceptances();
  if (current[requestId]) return current[requestId];
  const acceptance = {
    proposalId: proposal.id,
    supplierName: proposal.supplierName,
    amountCents: proposal.amountCents,
    acceptedAt: new Date().toISOString(),
    mode: "demo",
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [requestId]: acceptance }));
  } catch {
    throw new Error("Não foi possível salvar o aceite demonstrativo neste navegador.");
  }
  return acceptance;
}
