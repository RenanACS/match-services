// Camada de acesso às contestações do Admin. HOJE trabalha sobre dados
// fictícios (data/adminDisputes.js) + as decisões demonstrativas guardadas no
// navegador (context/AdminDisputesProvider). Com o Django, estas funções passam
// a chamar a API (via services/api.js), por exemplo:
//   listDisputes   -> GET  /api/admin/disputes/?q=&status=&reason=&period=&page=
//   getDispute     -> GET  /api/admin/disputes/:id/
//   assumeDispute  -> POST /api/admin/disputes/:id/assume/
//   addNote        -> POST /api/admin/disputes/:id/notes/        { text }
//   resolveDispute -> POST /api/admin/disputes/:id/resolve/      { decision, justification }
// Busca, filtros e paginação passam a ser do servidor.
//
// IMPORTANTE: registrar uma DECISÃO é diferente de EXECUTAR uma operação
// financeira. Nada aqui reembolsa, estorna ou repassa dinheiro, e a decisão não
// muda o status do pagamento nem do repasse: isso dependerá do backend e do
// provedor financeiro.

import { adminDisputes, DISPUTE_REASONS, DISPUTE_DECISIONS } from "../data/adminDisputes";
import { DEMO_NOW } from "../data/adminRequests";
import { getRequest, PERIODS, paginate, PAGE_SIZE } from "./adminRequests";

export { DISPUTE_REASONS, DISPUTE_DECISIONS, PERIODS, paginate, PAGE_SIZE };

export const DISPUTE_STATUSES = {
  open: { label: "Aberta", tone: "amber", icon: "clock" },
  analysis: { label: "Em análise", tone: "blue", icon: "search" },
  resolved: { label: "Resolvida", tone: "green", icon: "checkCircle" },
};
export const DISPUTE_STATUS_ORDER = ["open", "analysis", "resolved"];

/** Contestação base + solicitação, cliente e fornecedor referenciados. */
function hydrate(dispute) {
  const request = getRequest(dispute.requestId);
  return { ...dispute, request, client: request.client, supplier: request.supplier };
}

export const baseDisputes = adminDisputes.map(hydrate);

/** Aplica o estado demonstrativo (overrides) sobre a base; sem override = valor original. */
export function applyOverrides(overrides = {}) {
  return baseDisputes.map((d) => {
    const o = overrides[d.id];
    if (!o) return d;
    return {
      ...d,
      status: o.status ?? d.status,
      decision: o.decision ?? d.decision,
      notes: [...d.notes, ...(o.notes ?? [])],
      history: [...d.history, ...(o.history ?? [])],
    };
  });
}

const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Busca (ID, cliente, fornecedor ou solicitação), situação, motivo e período. */
export function filterDisputes(disputes, { query = "", status = "all", reason = "all", period = "all" } = {}) {
  const text = normalize(query.replace(/^#/, ""));
  const days = PERIODS.find((p) => p.value === period)?.days;
  const since = days ? Date.parse(DEMO_NOW) - days * 86400000 : null;
  return disputes.filter((d) => {
    if (status !== "all" && d.status !== status) return false;
    if (reason !== "all" && d.reason !== reason) return false;
    if (since && Date.parse(d.openedAt) < since) return false;
    if (!text) return true;
    return [d.id, d.requestId, d.client.name, d.supplier.name, d.supplier.tradeName ?? ""].some((v) => normalize(String(v)).includes(text));
  });
}

export function countByStatus(disputes) {
  const counts = { open: 0, analysis: 0, resolved: 0, total: disputes.length };
  for (const d of disputes) counts[d.status] += 1;
  return counts;
}

/** Lista ordenada da mais recente para a mais antiga. */
export const sortNewestFirst = (disputes) => [...disputes].sort((a, b) => b.openedAt.localeCompare(a.openedAt));

/** O que pede ação vem primeiro (aberta, depois em análise, depois resolvida); dentro de cada grupo, a mais antiga primeiro. */
export const sortByUrgency = (disputes) =>
  [...disputes].sort(
    (a, b) =>
      DISPUTE_STATUS_ORDER.indexOf(a.status) - DISPUTE_STATUS_ORDER.indexOf(b.status) ||
      (a.status === "resolved" ? b.openedAt.localeCompare(a.openedAt) : a.openedAt.localeCompare(b.openedAt)),
  );

export const MIN_TEXT = 10;
