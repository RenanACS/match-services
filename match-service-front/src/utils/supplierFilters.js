import { MOCK_TODAY } from "../data/fornecedor";

// Texto sem acento e em minúsculas, para a busca.
export function normalize(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export const PERIOD_OPTIONS = [
  { value: "all", label: "Todo o período" },
  { value: "7", label: "Últimos 7 dias" },
  { value: "15", label: "Últimos 15 dias" },
];

// `period` é "all" ou a quantidade de dias, contada a partir de MOCK_TODAY.
export function matchesPeriod(iso, period) {
  if (period === "all") return true;
  const limit = new Date(MOCK_TODAY).getTime() - Number(period) * 86400000;
  return new Date(iso).getTime() >= limit;
}

// Recorta a página atual (a página é limitada ao intervalo válido, para o caso
// de a lista encolher por filtro ou exclusão).
export function paginate(items, page, size) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(page, 1), pages);
  return { pageItems: items.slice((current - 1) * size, current * size), pages, page: current };
}
