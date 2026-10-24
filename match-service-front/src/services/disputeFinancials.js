// Resolução FINANCEIRA DEMONSTRATIVA das contestações (Admin).
//
// Este módulo concentra as regras de valores para que a tela, o provider e a
// área de Pagamentos usem a MESMA lógica e o MESMO registro (a decisão guardada
// em AdminDisputesProvider). Não existe um segundo registro financeiro.
//
// TRÊS ESTADOS DIFERENTES (nunca confundir):
//  1. Decisão administrativa registrada  -> dispute.status === "resolved"
//  2. Destinação financeira autorizada   -> financial.authorizationStatus === "demo_authorized"
//     (apenas um REGISTRO demonstrativo: o admin definiu e confirmou os valores)
//  3. Movimentação financeira executada  -> financial.executionStatus. Nesta
//     etapa é SEMPRE "not_executed": só o provedor de pagamentos, via backend,
//     poderá confirmar uma transferência ou um reembolso reais.
//
// Valores sempre em CENTAVOS INTEIROS. Nada aqui reembolsa, estorna ou repassa
// dinheiro, e nada altera o status do pagamento.
//
// DJANGO (futuro) — o backend deve ser a fonte de verdade e repetir TODAS estas
// validações (React não é barreira de segurança financeira):
//   GET  /api/admin/disputes/:id/financial-balance/   saldo retido elegível + taxa de comissão vigente
//   POST /api/admin/disputes/:id/resolve/             payload = `toApiPayload(resolution, justification)`
//        -> valida permissão do admin, saldo, comissão e idempotência (uma só
//           resolução por contestação), grava auditoria e só então solicita ao
//           provedor o reembolso/repasse; o status "executed" vem de webhook.

import { loadDemoState } from "../utils/demoStorage";
import { COMMISSION_RATE_PERCENT } from "../data/adminDashboard";
import { parseMoneyToCents } from "../utils/money";

export const DISPUTES_STORAGE_KEY = "matchservice.admin.disputes.v1";
export const FINANCIAL_SCHEMA_VERSION = 1;

export const AUTHORIZATION_STATUS = {
  demo_authorized: "Destinação autorizada (demonstrativa)",
  not_applicable: "Sem destinação financeira",
};
export const EXECUTION_STATUS = {
  not_executed: "Não executada (depende do backend e do provedor financeiro)",
};
export const REFUND_TYPES = { full: "Reembolso integral", partial: "Reembolso parcial" };
export const REMAINDER_DESTINATIONS = {
  supplier: "Destinar o saldo restante ao fornecedor",
  retained: "Manter o saldo restante retido",
};

/**
 * Comissão da plataforma. Reutiliza a taxa que JÁ existe no projeto
 * (data/adminDashboard.js, usada em Pagamentos e Configurações) e que é
 * demonstrativa. Se um dia não houver taxa configurada (ratePercent null), a
 * comissão fica "pendente de configuração" e nenhum líquido é calculado.
 * Não inclui taxas do processador de pagamentos.
 */
export function getCommissionConfig() {
  const ratePercent = Number.isFinite(COMMISSION_RATE_PERCENT) ? COMMISSION_RATE_PERCENT : null;
  return { ratePercent, definitive: false };
}

/** Comissão (centavos) sobre o valor BRUTO destinado ao fornecedor. null = taxa pendente. */
export function commissionOn(grossCents, ratePercent) {
  if (ratePercent == null) return null;
  if (grossCents === 0) return 0;
  const basisPoints = Math.round(ratePercent * 100);
  return Math.round((grossCents * basisPoints) / 10000);
}

/**
 * Saldo EFETIVAMENTE disponível para resolver a contestação, a partir do
 * pagamento vinculado. Só há saldo quando o pagamento está retido pela
 * plataforma e o repasse está retido por contestação. Os dados demonstrativos
 * não têm um campo de "saldo" separado: para pagamentos retidos, o saldo é o
 * valor pago que segue em custódia (nenhum repasse ou estorno parcial existe
 * nos dados). Sem esses dados, NÃO se inventa saldo.
 * @returns {{ available: boolean, cents: number, reason: string|null }}
 */
export function getAvailableBalance(payment) {
  if (!payment) return { available: false, cents: 0, reason: "Não há pagamento vinculado a esta contestação." };
  if (payment.status !== "held") {
    return { available: false, cents: 0, reason: "O pagamento vinculado não está retido pela plataforma, então não há saldo a destinar." };
  }
  if (payment.payout?.key !== "held") {
    return { available: false, cents: 0, reason: "O repasse deste pagamento não está retido por contestação." };
  }
  if (!Number.isSafeInteger(payment.totalCents) || payment.totalCents <= 0) {
    return { available: false, cents: 0, reason: "O valor retido do pagamento não está disponível nos dados." };
  }
  return { available: true, cents: payment.totalCents, reason: null };
}

const MIN_JUSTIFICATION = 10;
const empty = { decision: "", refundType: "", refundText: "", remainderDestination: "", remainderConfirmed: false, clientText: "", supplierText: "", retainedConfirmed: false, justification: "" };
export const emptyFields = () => ({ ...empty });

function split(decision, refundType, available, clientCents, supplierCents, destination) {
  const retainedCents = available - clientCents - supplierCents;
  const { ratePercent } = getCommissionConfig();
  const commissionCents = commissionOn(supplierCents, ratePercent);
  return {
    decisionType: decision,
    refundType: refundType || null,
    remainderDestination: destination || null,
    availableCents: available,
    clientCents,
    supplierGrossCents: supplierCents,
    retainedCents,
    commissionRatePercent: ratePercent,
    commissionCents,
    supplierNetCents: commissionCents == null ? null : supplierCents - commissionCents,
  };
}

/**
 * Valida os campos da tela e calcula a distribuição. É a ÚNICA função que
 * monta a resolução (a tela e o provider a chamam).
 * `stage` limita a validação às etapas já preenchidas: "decision" | "financial" | "justification" | "all".
 * @returns {{ ok: boolean, errors: Record<string,string>, resolution: object|null }}
 */
export function validateResolution(fields, balance, stage = "all") {
  const errors = {};
  const f = { ...empty, ...fields };
  const all = stage === "all";
  const upTo = (s) => all || ["decision", "financial", "justification"].indexOf(stage) >= ["decision", "financial", "justification"].indexOf(s);

  if (!DECISIONS.includes(f.decision)) {
    errors.decision = "Escolha a decisão administrativa.";
    return { ok: false, errors, resolution: null };
  }

  const needsMoney = f.decision !== "dismissed";
  if (needsMoney && !balance.available) {
    errors.balance = `Saldo indisponível: ${balance.reason} Decisões com destinação financeira não podem ser registradas.`;
    return { ok: false, errors, resolution: null };
  }
  if (stage === "decision") return { ok: true, errors, resolution: null };
  const available = balance.available ? balance.cents : null;

  let resolution = null;
  if (f.decision === "dismissed") {
    resolution = {
      decisionType: "dismissed", refundType: null, remainderDestination: null,
      availableCents: available, clientCents: 0, supplierGrossCents: 0,
      retainedCents: available, commissionRatePercent: getCommissionConfig().ratePercent,
      commissionCents: 0, supplierNetCents: 0,
    };
  } else if (f.decision === "favor_supplier") {
    resolution = split("favor_supplier", null, available, 0, available, "supplier");
  } else if (f.decision === "favor_client") {
    if (!["full", "partial"].includes(f.refundType)) {
      errors.refundType = "Escolha entre reembolso integral e parcial.";
    } else if (f.refundType === "full") {
      resolution = split("favor_client", "full", available, available, 0, null);
    } else {
      const parsed = parseMoneyToCents(f.refundText);
      if (!parsed.ok) errors.refund = parsed.error;
      else if (parsed.cents <= 0) errors.refund = "O reembolso parcial deve ser maior que zero.";
      else if (parsed.cents > available) errors.refund = "O reembolso não pode ser maior que o saldo disponível.";
      else if (parsed.cents === available) errors.refund = "Para devolver todo o saldo, use o reembolso integral.";
      else if (!["supplier", "retained"].includes(f.remainderDestination)) {
        errors.remainderDestination = "Defina o destino do saldo restante.";
      } else {
        const rest = available - parsed.cents;
        resolution = split("favor_client", "partial", available, parsed.cents, f.remainderDestination === "supplier" ? rest : 0, f.remainderDestination);
        if (f.remainderConfirmed !== true && upTo("financial")) {
          errors.remainderConfirmed = "Confirme expressamente a destinação do saldo restante.";
        }
      }
    }
  } else if (f.decision === "agreement") {
    const client = parseMoneyToCents(f.clientText);
    const supplier = parseMoneyToCents(f.supplierText);
    if (!client.ok) errors.clientAmount = client.error;
    if (!supplier.ok) errors.supplierAmount = supplier.error;
    if (client.ok && supplier.ok) {
      if (client.cents > available) errors.clientAmount = "O valor ao cliente não pode ser maior que o saldo disponível.";
      else if (supplier.cents > available) errors.supplierAmount = "O valor ao fornecedor não pode ser maior que o saldo disponível.";
      else if (client.cents + supplier.cents > available) errors.sum = "A soma das destinações ultrapassa o saldo disponível.";
      else if (client.cents + supplier.cents === 0) errors.sum = "Informe ao menos uma destinação (cliente ou fornecedor).";
      else {
        resolution = split("agreement", null, available, client.cents, supplier.cents, null);
        if (resolution.retainedCents > 0 && f.retainedConfirmed !== true && upTo("financial")) {
          errors.retainedConfirmed = "Confirme que o saldo não destinado permanecerá retido.";
        }
      }
    }
  }

  const stepErrors = Object.keys(errors).filter((k) => k !== "justification");
  if (upTo("justification") && (stage === "all" || stage === "justification")) {
    const text = String(f.justification ?? "").trim();
    if (!text) errors.justification = "Informe a justificativa da decisão.";
    else if (text.length < MIN_JUSTIFICATION) errors.justification = `Descreva a justificativa com ao menos ${MIN_JUSTIFICATION} caracteres.`;
  }

  if (resolution && stepErrors.length === 0) {
    // Invariante: nada some nem aparece. cliente + fornecedor (bruto) + retido === disponível.
    if (available != null && resolution.clientCents + resolution.supplierGrossCents + resolution.retainedCents !== available) {
      errors.sum = "A soma das destinações diverge do saldo disponível.";
      return { ok: false, errors, resolution: null };
    }
    if ([resolution.clientCents, resolution.supplierGrossCents, resolution.retainedCents].some((n) => n != null && n < 0)) {
      errors.sum = "Valores negativos não são permitidos.";
      return { ok: false, errors, resolution: null };
    }
  }

  const ok = Object.keys(errors).length === 0 && resolution != null;
  return { ok, errors, resolution: stepErrors.length === 0 ? resolution : null };
}

const DECISIONS = ["favor_client", "favor_supplier", "agreement", "dismissed"];

/** Registro financeiro que acompanha a decisão (um único registro, dentro da decisão). */
export function buildFinancialRecord(resolution, { disputeId, requestId, paymentId }) {
  const authorized = resolution.decisionType !== "dismissed";
  return {
    schemaVersion: FINANCIAL_SCHEMA_VERSION,
    disputeId, requestId, paymentId,
    ...resolution,
    authorizationStatus: authorized ? "demo_authorized" : "not_applicable",
    executionStatus: "not_executed",
  };
}

const intOrNull = (v) => v === null || Number.isSafeInteger(v);

/** Confere um registro lido do navegador: descarta qualquer coisa adulterada ou incoerente. */
export function sanitizeFinancial(f) {
  if (!f || typeof f !== "object" || f.schemaVersion !== FINANCIAL_SCHEMA_VERSION) return null;
  if (!DECISIONS.includes(f.decisionType)) return null;
  const ints = [f.clientCents, f.supplierGrossCents, f.retainedCents];
  if (!ints.every((n) => Number.isSafeInteger(n) && n >= 0)) return null;
  if (!intOrNull(f.availableCents) || !intOrNull(f.commissionCents) || !intOrNull(f.supplierNetCents)) return null;
  if (f.availableCents != null && f.clientCents + f.supplierGrossCents + f.retainedCents !== f.availableCents) return null;
  if (f.commissionCents != null && f.supplierNetCents != null && f.supplierGrossCents - f.commissionCents !== f.supplierNetCents) return null;
  if (!(f.authorizationStatus in AUTHORIZATION_STATUS)) return null;
  // Nesta etapa NUNCA existe movimentação executada.
  if (f.executionStatus !== "not_executed") return null;
  return f;
}

/** Texto curto de um registro, usado no histórico. */
export function summarizeFinancial(f, formatMoney) {
  if (f.authorizationStatus === "not_applicable") {
    return "Sem destinação financeira: o estado financeiro foi preservado e qualquer liberação posterior depende do fluxo financeiro apropriado.";
  }
  const parts = [`Cliente ${formatMoney(f.clientCents)}`, `Fornecedor (bruto) ${formatMoney(f.supplierGrossCents)}`];
  parts.push(f.commissionCents == null ? "Comissão pendente de configuração" : `Comissão ${formatMoney(f.commissionCents)}`);
  if (f.supplierNetCents != null) parts.push(`Líquido do fornecedor ${formatMoney(f.supplierNetCents)}`);
  parts.push(`Retido ${formatMoney(f.retainedCents)}`);
  return `${parts.join(" · ")}. Autorização demonstrativa; nenhuma movimentação foi executada.`;
}

/** Forma pensada para a futura API Django (o backend recalcula e valida tudo). */
export function toApiPayload(financial, justification) {
  return {
    decision: financial.decisionType,
    refund_type: financial.refundType,
    remainder_destination: financial.remainderDestination,
    client_amount_cents: financial.clientCents,
    supplier_gross_amount_cents: financial.supplierGrossCents,
    retained_amount_cents: financial.retainedCents,
    justification,
  };
}

/** Autorização registrada para uma solicitação (lida do MESMO armazenamento das decisões). */
export function readAuthorizationForRequest(requestId) {
  const stored = loadDemoState(DISPUTES_STORAGE_KEY, {});
  for (const [disputeId, value] of Object.entries(stored)) {
    const financial = sanitizeFinancial(value?.decision?.financial);
    if (financial && financial.requestId === requestId && value.status === "resolved") {
      return { disputeId, decision: value.decision, financial };
    }
  }
  return null;
}
