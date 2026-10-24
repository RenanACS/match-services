// Pequenos auxiliares compartilhados pelas abas dos detalhes do fornecedor.

/** Último evento do histórico com a ação informada (ou undefined). */
export function lastEntry(history, action) {
  return [...history].reverse().find((entry) => entry.action === action);
}

export const HISTORY_LABELS = {
  registered: "Cadastro realizado",
  approved: "Cadastro aprovado",
  rejected: "Cadastro rejeitado",
  blocked: "Fornecedor bloqueado",
  unblocked: "Fornecedor desbloqueado",
};

// Rótulo do texto livre de cada evento: justificativa (obrigatória) ou mensagem (opcional).
export const HISTORY_TEXT_LABEL = {
  approved: "Mensagem",
  unblocked: "Mensagem",
  rejected: "Justificativa",
  blocked: "Justificativa",
};

export const TABS = [
  { key: "visao-geral", label: "Visão geral" },
  { key: "servicos", label: "Serviços" },
  { key: "documentos", label: "Documentos" },
  { key: "avaliacoes", label: "Avaliações" },
  { key: "historico", label: "Histórico" },
  { key: "financeiro", label: "Financeiro" },
];

/** Situação de cada serviço, derivada do status do fornecedor (atualiza com as decisões). */
export function serviceSituation(supplier, service) {
  if (supplier.status === "review") return { label: "Aguardando aprovação", tone: "amber" };
  if (supplier.status === "rejected") return { label: "Não publicado", tone: "zinc" };
  if (supplier.status === "blocked") return { label: "Indisponível", tone: "red" };
  return service.paused ? { label: "Pausado", tone: "zinc" } : { label: "Ativo", tone: "green" };
}
