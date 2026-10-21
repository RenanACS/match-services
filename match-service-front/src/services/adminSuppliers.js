// Camada de acesso aos fornecedores do Admin. HOJE trabalha sobre dados
// fictícios em memória. Com o Django, estas funções passam a chamar a API
// (via services/api.js), por exemplo:
//   listSuppliers   -> GET  /api/admin/suppliers/?q=&category=&status=&page=
//   getSupplier     -> GET  /api/admin/suppliers/:id/
//   approveSupplier -> POST /api/admin/suppliers/:id/approve/   { message }
//   rejectSupplier  -> POST /api/admin/suppliers/:id/reject/    { reason }
//   blockSupplier   -> POST /api/admin/suppliers/:id/block/     { reason }
//   unblockSupplier -> POST /api/admin/suppliers/:id/unblock/   { message }
// Busca, filtros e paginação passam a ser do servidor. Bloqueio NÃO cancela
// serviços já contratados, pagamentos ou obrigações existentes.

import { COMMISSION_RATE_PERCENT } from "../data/adminDashboard";

export const PAGE_SIZE = 3;

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
const onlyDigits = (text) => text.replace(/\D/g, "");

/** Filtra por busca (nome, CNPJ ou e-mail), categoria e status. */
export function filterSuppliers(suppliers, { query = "", category = "all", status = "all" } = {}) {
  const text = normalize(query);
  const queryDigits = onlyDigits(query);
  return suppliers.filter((supplier) => {
    if (category !== "all" && supplier.category !== category) return false;
    if (status !== "all" && supplier.status !== status) return false;
    if (!text) return true;
    if (
      normalize(supplier.name).includes(text) ||
      normalize(supplier.tradeName).includes(text) ||
      normalize(supplier.email).includes(text)
    ) {
      return true;
    }
    return queryDigits.length > 0 && onlyDigits(supplier.cnpj).includes(queryDigits);
  });
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, totalPages, total: items.length, start };
}

/** Ações permitidas para cada status (menu "..." e cabeçalho dos detalhes). */
export const ACTIONS_BY_STATUS = {
  review: ["details", "analyze", "approve", "reject"],
  active: ["details", "block"],
  blocked: ["details", "unblock"],
  rejected: ["details", "reason"],
};

/** Status resultante de cada decisão administrativa. */
export const NEXT_STATUS = { approve: "active", reject: "rejected", block: "blocked", unblock: "active" };
/** Status exigido para cada decisão (impede ações contraditórias). */
export const REQUIRED_STATUS = { approve: "review", reject: "review", block: "active", unblock: "blocked" };
/** Tipo do evento gravado no histórico. */
export const HISTORY_ACTION = { approve: "approved", reject: "rejected", block: "blocked", unblock: "unblocked" };

/**
 * Resumo financeiro demonstrativo: comissão de 10% sobre o valor pago e 90%
 * de repasse ao fornecedor, antes de taxas e tributos aplicáveis.
 */
export function summarizeFinance(finance) {
  const commissionCents = Math.round((finance.paidCents * COMMISSION_RATE_PERCENT) / 100);
  return {
    ...finance,
    commissionRate: COMMISSION_RATE_PERCENT,
    commissionCents,
    payoutCents: finance.paidCents - commissionCents,
  };
}

export function averageRating(reviews) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}
