// Formatadores da área do fornecedor (pt-BR).

export function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// "2026-10-19T14:32" -> "19/10/2026" e "14:32"
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function getInitials(name) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Date -> "2026-10-19T14:32" (horário local, mesmo formato dos mocks).
export function toLocalIso(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Valor digitado ("1.500,50" ou "1500.5") -> número, ou NaN se inválido.
export function parseMoney(text) {
  const raw = String(text).trim().replace(/\s/g, "");
  if (!raw) return NaN;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
}
