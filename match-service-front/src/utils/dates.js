// Datas ISO ("2026-10-16" ou "2026-10-16T14:30:00") -> pt-BR.
export function formatDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return date.toLocaleDateString("pt-BR");
}

export function formatDateTime(iso) {
  const date = new Date(iso);
  return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
