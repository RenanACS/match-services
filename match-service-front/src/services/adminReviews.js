// Camada de acesso às avaliações do Admin. HOJE trabalha sobre as avaliações
// fictícias dos fornecedores + a moderação demonstrativa guardada no navegador
// (context/AdminReviewsProvider). Com o Django, estas funções passam a chamar a
// API (via services/api.js), por exemplo:
//   listReviews   -> GET  /api/admin/reviews/?q=&rating=&status=&period=&page=
//   hideReview    -> POST /api/admin/reviews/:id/hide/      { reason }
//   restoreReview -> POST /api/admin/reviews/:id/restore/   { reason? }
// O administrador só MODERA (oculta/restaura): nunca altera a nota nem reescreve
// o comentário do cliente. Avaliação ocultada NÃO é publicada e não entra na média.

import { adminReviews } from "../data/adminReviews";
import { adminSuppliers } from "../data/adminSuppliers";
import { DEMO_NOW } from "../data/adminRequests";
import { PERIODS, paginate, PAGE_SIZE } from "./adminRequests";

export { PERIODS, paginate, PAGE_SIZE };
export { MODERATOR } from "../data/adminReviews";
export const MIN_REASON = 10;

export const REVIEW_STATUSES = {
  published: { label: "Publicada", tone: "green", icon: "checkCircle" },
  hidden: { label: "Ocultada", tone: "amber", icon: "eyeOff" },
};

const suppliersById = new Map(adminSuppliers.map((s) => [s.id, s]));

export const baseReviews = adminReviews.map((review) => ({ ...review, supplier: suppliersById.get(review.supplierId) }));

/** Aplica a moderação demonstrativa (overrides) sobre a base. */
export function applyOverrides(overrides = {}) {
  return baseReviews.map((r) => {
    const o = overrides[r.id];
    return o ? { ...r, status: o.status ?? r.status, moderation: [...r.moderation, ...(o.moderation ?? [])] } : r;
  });
}

const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Busca (cliente, fornecedor ou conteúdo), nota, situação e período. */
export function filterReviews(reviews, { query = "", rating = "all", status = "all", period = "all" } = {}) {
  const text = normalize(query);
  const days = PERIODS.find((p) => p.value === period)?.days;
  const since = days ? Date.parse(DEMO_NOW) - days * 86400000 : null;
  return reviews.filter((r) => {
    if (rating !== "all" && r.rating !== Number(rating)) return false;
    if (status !== "all" && r.status !== status) return false;
    if (since && Date.parse(`${r.date}T12:00:00`) < since) return false;
    if (!text) return true;
    return [r.author, r.supplier.name, r.supplier.tradeName ?? "", r.comment].some((v) => normalize(v).includes(text));
  });
}

export const sortNewestFirst = (reviews) => [...reviews].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));

/** Totais; a média considera SOMENTE as avaliações publicadas. */
export function summarizeReviews(reviews) {
  const published = reviews.filter((r) => r.status === "published");
  const average = published.length ? published.reduce((sum, r) => sum + r.rating, 0) / published.length : null;
  return { total: reviews.length, published: published.length, hidden: reviews.length - published.length, average };
}
