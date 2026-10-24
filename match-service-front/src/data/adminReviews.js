// Avaliações do Admin (/admin/avaliacoes). Não há dados novos: usa as MESMAS
// avaliações fictícias já presentes nos fornecedores (adminSuppliers[].reviews,
// as mesmas da aba Avaliações dos detalhes do fornecedor). O "cliente" é o
// nome abreviado que já existe nesses dados (ex.: "Marina B."), sem vínculo com
// um cadastro de cliente: nada é criado em nome de usuários reais.
import { adminSuppliers } from "./adminSuppliers";
import { DEMO_NOW } from "./adminRequests";

export const MODERATOR = "Administrador (demonstrativo)";

// Só entram avaliações com data até o "agora" da demonstração: alguns dados de
// fornecedores trazem avaliações com data posterior, que ainda não poderiam
// existir (continuam aparecendo na aba Avaliações dos detalhes do fornecedor, que
// não foi alterada).
const NOW_DAY = DEMO_NOW.slice(0, 10);

const base = adminSuppliers.flatMap((supplier) =>
  supplier.reviews
    .filter((review) => review.date <= NOW_DAY)
    .map((review) => ({
      id: review.id,
      supplierId: supplier.id,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
    })),
);

// Algumas das notas mais baixas já começam ocultadas, só para mostrar o estado
// "ocultada" (registro demonstrativo, com justificativa explícita de teste).
const SEEDED_HIDDEN = new Set(
  base
    .filter((r) => r.rating <= 2)
    .slice(0, 3)
    .map((r) => r.id),
);

export const adminReviews = base.map((review) => ({
  ...review,
  status: SEEDED_HIDDEN.has(review.id) ? "hidden" : "published",
  moderation: SEEDED_HIDDEN.has(review.id)
    ? [{ action: "hide", reason: "Ocultada na moderação demonstrativa (registro de teste com dados fictícios).", date: `${review.date}T15:00:00`, by: MODERATOR }]
    : [],
}));
