// Camada de acesso aos pagamentos do Admin. HOJE os pagamentos são DERIVADOS
// das solicitações fictícias (services/adminRequests.js): cada pagamento
// aponta para uma solicitação real dos mocks (requestId), então cliente,
// fornecedor, valor e datas nunca divergem. Com o Django, estas funções passam
// a chamar a API (via services/api.js), por exemplo:
//   listPayments -> GET /api/admin/payments/?q=&status=&method=&period=&page=
//   getPayment   -> GET /api/admin/payments/:id/  (com cliente, fornecedor e
//                   os dados da transação vindos do provedor financeiro)
// Busca, filtros, indicadores e paginação passam a ser do servidor.
//
// COERÊNCIA: o status do pagamento só é "confirmado/retido/repassado" quando
// existe o evento correspondente na solicitação (paidAt / payout.at). Nada é
// apresentado como transferido sem confirmação, e valores ainda não efetivados
// são marcados como PREVISTOS. O Admin só CONSULTA: não confirma pagamentos
// nem libera repasses (a confirmação real virá do provedor, por webhook).

import { allRequests, splitValue, PERIODS, paginate, PAGE_SIZE } from "./adminRequests";
import { DEMO_NOW } from "../data/adminRequests";

export { PERIODS, paginate, PAGE_SIZE };

// pending   Pendente   — cobrança registrada, ainda não confirmada pelo provedor
// failed    Falhou     — tentativa não concluída no provedor (nada foi cobrado)
// confirmed Confirmado — pago e confirmado; o serviço ainda não começou
// held      Retido     — pago e em custódia da plataforma (serviço em andamento,
//                        concluído com repasse a liberar, ou em contestação)
// released  Repassado  — repasse ao fornecedor concluído (existe data do evento)
// refunded  Estornado  — pago e devolvido ao cliente (ver nota em statusOf)
export const PAYMENT_STATUSES = {
  pending: { label: "Pendente", tone: "amber", icon: "clock" },
  failed: { label: "Falhou", tone: "red", icon: "xCircle" },
  confirmed: { label: "Confirmado", tone: "teal", icon: "checkCircle" },
  held: { label: "Em custódia", tone: "blue", icon: "lock" },
  released: { label: "Repassado", tone: "green", icon: "check" },
  refunded: { label: "Estornado", tone: "red", icon: "refresh" },
};
export const PAYMENT_STATUS_ORDER = ["pending", "confirmed", "held", "released", "failed", "refunded"];
export const PAYMENT_METHODS = ["Cartão de crédito", "Pix", "Cartão de débito"];

// Descrição do estado (cartão "Informações do pagamento").
const STATUS_NOTE = {
  pending: "Aguardando confirmação do pagamento pelo provedor.",
  failed: "A tentativa de pagamento não foi concluída. Nenhum valor foi cobrado.",
  confirmed: "Pagamento confirmado pelo provedor. O serviço ainda não começou.",
  held: "Pagamento confirmado. O valor fica em custódia até o repasse.",
  released: "Pagamento confirmado e repasse ao fornecedor concluído.",
  refunded: "Pagamento devolvido ao cliente.",
};

function statusOf(request) {
  const { stage, payout } = request;
  // Estorno só existe se a solicitação foi cancelada DEPOIS de paga. Os mocks
  // atuais não têm esse caso (cancelamentos acontecem antes do pagamento),
  // mas o caminho fica pronto para os dados reais.
  if (stage.startsWith("cancelled")) return request.paidAt ? "refunded" : null;
  if (!request.paidAt) {
    // Algumas tentativas de cartão recusadas (as solicitações seguem aguardando pagamento).
    return failedIds.has(request.id) ? "failed" : "pending";
  }
  if (payout.status === "done") return "released";
  if (stage === "paid") return "confirmed";
  return "held";
}

// Identificador da transação no provedor (fictício, determinístico).
function txnId(paymentId) {
  let h = 2166136261;
  for (const ch of `${paymentId}:match`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const h2 = Math.imul(h ^ 0x9e3779b9, 2246822519) >>> 0;
  return `txn_${h.toString(16).padStart(8, "0")}${h2.toString(16).padStart(8, "0")}`.slice(0, 20);
}

// Tentativas que falharam: solicitações "aguardando pagamento" cujo método já
// foi escolhido e cuja cobrança não foi concluída (o cliente pode tentar de novo).
const failedIds = new Set(
  allRequests.filter((r) => r.stage === "awaiting_payment" && r.payment.method).map((r) => r.id),
);

/**
 * Situação do repasse ao fornecedor, SEM presumir transferência:
 *  waiting  Aguardando pagamento (ainda não há valor recebido)
 *  service  Aguardando conclusão do serviço
 *  pending  Pendente  | processing Em processamento | held Retido (contestação)
 *  done     Concluído (só com data do evento)
 *  na       Não se aplica (falha/estorno)
 */
function payoutInfo(request, status) {
  const { payout } = request;
  if (status === "failed" || status === "pending") return { key: "waiting", label: "Aguardando pagamento", when: "Após a confirmação do pagamento e a conclusão do serviço", effective: false };
  if (status === "refunded") return { key: "na", label: "Não se aplica", when: "Pagamento estornado ao cliente", effective: false };
  if (status === "confirmed" || status === "held") {
    switch (payout.status) {
      case "pending": return { key: "pending", label: "Pendente", when: "Não definida", effective: false };
      case "processing": return { key: "processing", label: "Em processamento", when: "Não definida", effective: false };
      case "held": return { key: "held", label: "Retido por contestação", when: "Após a análise da contestação", effective: false };
      default: return { key: "service", label: "Aguardando conclusão do serviço", when: "Após a conclusão do serviço", effective: false };
    }
  }
  return { key: "done", label: "Repassado", when: null, doneAt: payout.at, effective: true };
}

function build(request) {
  const status = statusOf(request);
  if (!status) return null;
  const id = `PG${request.id}`;
  const { commissionRate, commissionCents, payoutCents } = splitValue(request.valueCents);
  const method = request.payment.method ?? null;
  const received = ["confirmed", "held", "released"].includes(status);
  return {
    id,
    requestId: request.id,
    status,
    statusNote: STATUS_NOTE[status],
    createdAt: request.createdAt,
    confirmedAt: received ? request.paidAt : null,
    method,
    methodDetail: request.payment.detail,
    // O identificador só existe quando há cobrança registrada no provedor.
    txnId: method ? txnId(id) : null,
    clientId: request.clientId,
    supplierId: request.supplierId,
    client: request.client,
    supplier: request.supplier,
    totalCents: request.valueCents,
    commissionRate,
    commissionCents,
    payoutCents,
    // Efetivos só com o evento; senão são previstos.
    commissionEffective: status === "released",
    payoutValueEffective: status === "released",
    payout: payoutInfo(request, status),
  };
}

export const allPayments = allRequests.map(build).filter(Boolean);
export const getPayment = (id) => allPayments.find((p) => p.id === id);

const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Busca (ID do pagamento/solicitação/transação, cliente ou fornecedor), situação, método e período. */
export function filterPayments(payments, { query = "", status = "all", method = "all", period = "all" } = {}) {
  const text = normalize(query.replace(/^#/, ""));
  const days = PERIODS.find((p) => p.value === period)?.days;
  const since = days ? Date.parse(DEMO_NOW) - days * 86400000 : null;
  return payments.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (method !== "all" && p.method !== method) return false;
    if (since && Date.parse(p.createdAt) < since) return false;
    if (!text) return true;
    return [p.id, p.requestId, p.txnId ?? "", p.client.name, p.supplier.name, p.supplier.tradeName ?? ""].some((v) => normalize(String(v)).includes(text));
  });
}

/**
 * Indicadores (sempre sobre TODOS os pagamentos, não sobre o filtro):
 *  confirmed  total pago e confirmado (confirmado + retido + repassado)
 *  held       parte do confirmado ainda em custódia (não repassada)
 *  commission comissão EFETIVADA (só repasses concluídos); prevista à parte
 *  released   valor ao fornecedor já repassado (repasses concluídos)
 */
export function summarizePayments(payments = allPayments) {
  const sum = (items, pick) => items.reduce((total, p) => total + pick(p), 0);
  const released = payments.filter((p) => p.status === "released");
  const held = payments.filter((p) => p.status === "confirmed" || p.status === "held");
  const confirmed = payments.filter((p) => ["confirmed", "held", "released"].includes(p.status));
  return {
    confirmed: { cents: sum(confirmed, (p) => p.totalCents), count: confirmed.length },
    held: { cents: sum(held, (p) => p.totalCents), count: held.length },
    commission: { cents: sum(released, (p) => p.commissionCents), plannedCents: sum(held, (p) => p.commissionCents) },
    released: { cents: sum(released, (p) => p.payoutCents), count: released.length },
  };
}
