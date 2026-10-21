// Camada de acesso às solicitações do cliente. HOJE funciona só com dados
// DEMONSTRATIVOS (data/dashboard.js + data/clientRequestDetails.js) e com um
// pequeno registro de ações simuladas em sessionStorage (utils abaixo).
//
// IMPORTANTE (financeiro): o React NUNCA libera pagamentos. As funções que
// mudam o fluxo (acceptProposal, confirmCompletion) apenas REGISTRAM a intenção
// do cliente. No Django, cada uma vira uma chamada de API e o estado vem da
// resposta do servidor:
//
//   listRequests()                 -> GET  /api/requests/
//   getRequestDetail(id)           -> GET  /api/requests/:id/   (com propostas,
//                                         contratação, pagamento e liberação)
//   acceptProposal(id, proposalId) -> POST /api/requests/:id/proposals/:proposalId/accept/
//        o backend cria a cobrança no provedor; a solicitação só passa a
//        "Contratado" depois que o provedor CONFIRMA o pagamento (webhook).
//   confirmCompletion(id)          -> POST /api/requests/:id/confirm-completion/
//        o backend valida a operação e SOLICITA ao provedor a liberação do
//        pagamento ao fornecedor; "Pagamento liberado" só aparece após a
//        confirmação do provedor (release.confirmedAt).
//
// O sessionStorage abaixo existe só para a demonstração: NÃO é mecanismo de
// autorização financeira e nada dele deve ser usado como fonte de verdade.

import { recentRequests } from "../data/dashboard";
import { REQUEST_DETAILS } from "../data/clientRequestDetails";
import { suppliers } from "../data/suppliers";

const STORAGE_KEY = "match-services:client-requests-demo";

function readOverrides() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) ?? {};
  } catch {
    // sessionStorage indisponível ou JSON inválido: sem ações simuladas
  }
  return {};
}

function writeOverride(id, patch) {
  const all = readOverrides();
  all[id] = { ...(all[id] ?? {}), ...patch };
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // sem persistência: a ação vale só enquanto a página está aberta
  }
}

/** "req-001" -> "001" (número exibido: #001). */
export const requestNumber = (id) => String(id).replace(/^req-/, "");

/** Lista as solicitações já com o efeito das ações simuladas. */
export function listRequests() {
  const overrides = readOverrides();
  return recentRequests.map((request) => ({ ...request, ...(overrides[request.id]?.status ? { status: overrides[request.id].status } : {}) }));
}

/** Solicitação + detalhes (com ações simuladas aplicadas) ou null se não existir. */
export function getRequestDetail(id) {
  const base = recentRequests.find((request) => request.id === id);
  const detail = REQUEST_DETAILS[id];
  if (!base || !detail) return null;
  const override = readOverrides()[id] ?? {};
  const status = override.status ?? base.status;
  const merged = {
    ...detail,
    dates: { ...detail.dates, ...(override.dates ?? {}) },
    ...(override.completion ? { completion: override.completion } : {}),
    ...(override.release ? { release: override.release } : {}),
    acceptedProposalId: override.acceptedProposalId ?? null,
  };
  return {
    request: { ...base, status },
    detail: merged,
    simulated: Boolean(override.status),
    supplierOf: (supplierId) => suppliers.find((s) => s.id === supplierId) ?? null,
  };
}

/**
 * O botão "Confirmar conclusão do serviço" só vale para solicitações
 * contratadas, com pagamento retido pela plataforma, serviço em execução e
 * sem conclusão já informada.
 */
export function canConfirmCompletion({ request, detail }) {
  return (
    request.status === "hired" &&
    detail.payment?.status === "held" &&
    detail.contract?.execution === "in_progress" &&
    !detail.completion
  );
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 250));

/**
 * SIMULADO. Registra que o cliente escolheu uma proposta. NÃO contrata: a
 * solicitação fica "Aguardando pagamento" até o provedor confirmar a cobrança.
 */
export async function acceptProposal(id, proposalId) {
  await pause();
  writeOverride(id, {
    status: "awaiting_payment",
    acceptedProposalId: proposalId,
    dates: { acceptedAt: new Date().toISOString().slice(0, 10) },
  });
  return { simulated: true };
}

/**
 * SIMULADO. Registra que o cliente informou a conclusão. A liberação fica
 * "Aguardando liberação" até o backend validar e o provedor confirmar.
 */
export async function confirmCompletion(id) {
  await pause();
  const today = new Date().toISOString().slice(0, 10);
  writeOverride(id, {
    status: "completed",
    dates: { completedAt: today },
    completion: { confirmedAt: today, confirmedBy: "Cliente" },
    release: { status: "awaiting_release", requestedAt: null, confirmedAt: null },
  });
  return { simulated: true };
}
