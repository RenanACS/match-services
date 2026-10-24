// Paginação das listagens da área do cliente: 3 registros por página.
export const PAGE_SIZE = 3;

/** Fatia `items` na página pedida (corrigida para o intervalo válido). */
export function paginate(items, page = 1, pageSize = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, totalPages, total, start };
}
