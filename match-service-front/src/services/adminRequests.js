// Camada de acesso às solicitações do Admin. HOJE trabalha sobre dados
// fictícios em memória. Com o Django, estas funções passam a chamar a API
// (via services/api.js), por exemplo:
//   listRequests -> GET /api/admin/requests/?q=&status=&category=&supplier=&period=&page=
//   getRequest   -> GET /api/admin/requests/:id/   (já com cliente, fornecedor,
//                   eventos de pagamento e de repasse vindos do provedor financeiro)
// Busca, filtros e paginação passam a ser do servidor. A confirmação de
// pagamento, a retenção e o repasse reais dependerão da integração futura com
// o provedor financeiro e de seus webhooks: o Admin só CONSULTA — não cria
// solicitações, não conclui serviços, não confirma pagamentos nem libera
// repasses no fluxo normal.

import { adminRequests, DEMO_NOW } from "../data/adminRequests";
import { adminClients } from "../data/adminClients";
import { adminSuppliers } from "../data/adminSuppliers";
import { COMMISSION_RATE_PERCENT } from "../data/adminCommission";

export const PAGE_SIZE = 10;

// Visão resumida (cartões e coluna Status da lista).
export const REQUEST_CATEGORIES = {
  awaiting: { label: "Aguardando confirmação", tone: "amber", icon: "clock" },
  in_progress: { label: "Em andamento", tone: "blue", icon: "settings" },
  completed: { label: "Concluída", tone: "green", icon: "check" },
  cancelled: { label: "Cancelada", tone: "red", icon: "close" },
};
export const REQUEST_STATUS_FILTERS = ["awaiting", "in_progress", "completed", "cancelled"];

export const PERIODS = [
  { value: "all", label: "Todo o período", days: null },
  { value: "7", label: "Últimos 7 dias", days: 7 },
  { value: "30", label: "Últimos 30 dias", days: 30 },
  { value: "90", label: "Últimos 90 dias", days: 90 },
];

/** Categoria resumida de um estágio detalhado. */
export function requestCategory(stage) {
  if (stage === "awaiting_acceptance" || stage === "awaiting_payment") return "awaiting";
  if (stage === "paid" || stage === "in_progress") return "in_progress";
  if (stage.startsWith("completed")) return "completed";
  return "cancelled";
}

/** Rótulo exato do estágio (cabeçalho dos detalhes). */
export function stageLabel(request) {
  switch (request.stage) {
    case "awaiting_acceptance": return "Aguardando confirmação";
    case "awaiting_payment": return "Aguardando pagamento";
    case "paid": return "Pagamento confirmado";
    case "in_progress": return "Em andamento";
    case "cancelled_supplier": return "Recusada pelo fornecedor";
    case "cancelled_client": return "Cancelada pelo cliente";
    default: return "Concluída";
  }
}

const clientsById = new Map(adminClients.map((c) => [c.id, c]));
const suppliersById = new Map(adminSuppliers.map((s) => [s.id, s]));

/** Solicitação + dados do cliente e do fornecedor referenciados. */
function hydrate(request) {
  return {
    ...request,
    category: requestCategory(request.stage),
    client: clientsById.get(request.clientId),
    supplier: suppliersById.get(request.supplierId),
  };
}

export const allRequests = adminRequests.map(hydrate);
export const getRequest = (id) => allRequests.find((r) => r.id === id);

/** Fornecedores que têm solicitações (opções do filtro). */
export const supplierOptions = [...new Map(allRequests.map((r) => [r.supplier.id, r.supplier])).values()]
  .map((s) => ({ value: s.id, label: s.name }))
  .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

export function countByCategory(requests = allRequests) {
  const counts = { awaiting: 0, in_progress: 0, completed: 0, cancelled: 0 };
  for (const request of requests) counts[request.category] += 1;
  return counts;
}

const normalize = (text) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Filtros: busca (cliente, fornecedor, serviço ou ID), status, categoria, fornecedor e período. */
export function filterRequests(requests, { query = "", status = "all", category = "all", supplier = "all", period = "all" } = {}) {
  const text = normalize(query.replace(/^#/, ""));
  const days = PERIODS.find((p) => p.value === period)?.days;
  const since = days ? Date.parse(DEMO_NOW) - days * 86400000 : null;
  return requests.filter((r) => {
    if (status !== "all" && r.category !== status) return false;
    if (category !== "all" && r.service.category !== category) return false;
    if (supplier !== "all" && r.supplierId !== supplier) return false;
    if (since && Date.parse(r.createdAt) < since) return false;
    if (!text) return true;
    return [r.id, r.client.name, r.supplier.name, r.supplier.tradeName, r.service.name].some((v) => normalize(v).includes(text));
  });
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, totalPages, total: items.length, start };
}

/** Comissão demonstrativa (10%) e repasse (90%), antes de taxas e tributos. */
export function splitValue(valueCents) {
  const commissionCents = Math.round((valueCents * COMMISSION_RATE_PERCENT) / 100);
  return { commissionRate: COMMISSION_RATE_PERCENT, commissionCents, payoutCents: valueCents - commissionCents };
}

/**
 * Linha do tempo derivada dos EVENTOS da solicitação. Uma etapa só fica
 * concluída se o evento existir; em recusa/cancelamento a etapa em que o fluxo
 * parou mostra a situação (vermelha) e as seguintes permanecem inativas.
 */
export function buildTimeline(request) {
  const steps = [
    { key: "created", label: "Solicitação criada", at: request.createdAt },
    { key: "accepted", label: "Aguardando aceite do fornecedor", at: request.acceptedAt },
    { key: "paid", label: "Pagamento confirmado", at: request.paidAt },
    { key: "started", label: "Serviço em andamento", at: request.startedAt },
    { key: "completed", label: "Concluída", at: request.completedAt },
  ];
  const firstPending = steps.findIndex((s) => !s.at);
  return steps.map((step, index) => {
    if (step.at) return { ...step, state: "done" };
    if (request.cancellation && index === firstPending) {
      const label = request.cancellation.by === "supplier" ? "Recusada pelo fornecedor" : "Cancelada pelo cliente";
      return { ...step, label, at: request.cancellation.at, state: "stopped" };
    }
    if (!request.cancellation && index === firstPending) return { ...step, state: "current" };
    return { ...step, state: "inactive" };
  });
}

/**
 * Resumo do pagamento COERENTE com o estágio: só mostra "pago", "retido" ou
 * "repassado" quando existe o evento (paidAt / payout.at). Nunca presume
 * transferência apenas porque o serviço terminou.
 */
export function summarizePayment(request) {
  const { valueCents, payment, payout, stage } = request;
  const { commissionRate, commissionCents, payoutCents } = splitValue(valueCents);
  const confirmed = Boolean(request.paidAt);
  const cancelled = stage.startsWith("cancelled");

  const method = cancelled
    ? { value: "—", hint: "Sem cobrança" }
    : confirmed
      ? { value: payment.method, hint: payment.detail }
      : payment.method
        ? { value: payment.method, hint: payment.detail ? `${payment.detail} · método escolhido` : "Método escolhido" }
        : { value: "Não selecionado", hint: null };

  const paid = cancelled
    ? { value: "—", hint: "Nenhum valor cobrado" }
    : confirmed
      ? { value: valueCents, money: true, hint: "Pagamento confirmado" }
      : { value: "Pendente", hint: "Valor contratado:", ref: valueCents };

  const date = confirmed ? { value: request.paidAt, datetime: true } : { value: "Não disponível", hint: cancelled ? null : "Pagamento ainda não confirmado" };

  let commission;
  let transfer;
  if (cancelled) {
    commission = { value: "—", hint: "Não aplicável" };
    transfer = { value: "—", hint: "Não aplicável" };
  } else {
    const settled = payout.status === "done";
    commission = { value: commissionCents, money: true, hint: settled ? "Efetivada" : confirmed ? "Prevista — após a conclusão" : "Prevista — ainda não efetivada" };
    const transferHint = {
      done: "Repasse concluído",
      processing: "Repasse em processamento",
      pending: "Repasse pendente",
      held: "Repasse retido (contestação aberta)",
      not_due: "Previsto — após a conclusão",
      none: "Previsto — ainda não efetivado",
    }[payout.status];
    transfer = { value: payoutCents, money: true, hint: transferHint, hintAt: payout.status === "done" ? payout.at : null };
  }

  return { commissionRate, paid, method, date, commission, transfer, banner: bannerFor(request, confirmed) };
}

function bannerFor(request, confirmed) {
  const { stage, payout } = request;
  switch (stage) {
    case "awaiting_acceptance":
      return { tone: "amber", title: "Pagamento pendente", text: "O cliente ainda não pagou. Nenhuma cobrança foi efetuada: a solicitação aguarda o aceite do fornecedor.", pill: "Aguardando confirmação" };
    case "awaiting_payment":
      return { tone: "amber", title: "Pagamento pendente", text: "O fornecedor aceitou a solicitação. Aguardando a confirmação do pagamento pelo cliente.", pill: "Aguardando pagamento" };
    case "paid":
    case "in_progress":
      return { tone: "orange", title: "Pagamento retido na plataforma", text: "O valor permanecerá em custódia até a confirmação de conclusão do serviço.", pill: stage === "paid" ? "Pagamento confirmado" : "Em andamento" };
    case "cancelled_client":
    case "cancelled_supplier":
      return { tone: "red", title: "Solicitação encerrada sem cobrança", text: confirmed ? "" : "Nenhum pagamento foi efetuado e nenhum valor foi retido ou repassado.", pill: stage === "cancelled_supplier" ? "Recusada" : "Cancelada" };
    default:
      if (payout.status === "done") return { tone: "green", title: "Repasse concluído", text: "O serviço foi concluído e o repasse ao fornecedor foi registrado.", pill: "Repasse concluído", at: payout.at };
      if (payout.status === "processing") return { tone: "amber", title: "Repasse em processamento", text: "Serviço concluído. O repasse ao fornecedor ainda está em processamento e não foi concluído.", pill: "Em processamento" };
      if (payout.status === "held") return { tone: "red", title: "Repasse retido", text: "Há uma contestação aberta. O repasse permanece retido até a análise (tratada em Contestações).", pill: "Retido" };
      return { tone: "amber", title: "Repasse pendente", text: "Serviço concluído. O repasse ao fornecedor ainda está pendente: concluir o serviço não significa que o valor já foi transferido.", pill: "Repasse pendente" };
  }
}
