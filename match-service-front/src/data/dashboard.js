// Dados mockados do Dashboard do Cliente.
// Quando o Django estiver pronto, estes exports devem ser substituídos por
// chamadas em src/services/ (via api.js) — o formato abaixo já é o que os
// componentes esperam receber.

export const mockUser = {
  name: "Cliente",
};

// Jornada do produto, exibida como linha discreta abaixo da saudação.
export const journeySteps = [
  "Encontrar",
  "Solicitar",
  "Comparar",
  "Contratar",
  "Acompanhar",
];

export const searchPlaceholder =
  "Ex.: limpeza empresarial, manutenção predial...";

export const summaryStats = [
  { id: "requests", label: "Solicitações", value: "02" },
  { id: "proposals", label: "Propostas recebidas", value: "03" },
  { id: "hiring", label: "Em contratação", value: "01" },
];

// Status -> variante do Badge (reaproveita as variantes existentes).
export const REQUEST_STATUS = {
  analysis: { label: "Em análise", variant: "warning" },
  proposals: { label: "Propostas recebidas", variant: "orange" },
  hired: { label: "Contratado", variant: "success" },
};

export const recentRequests = [
  {
    id: "req-001",
    title: "Limpeza empresarial",
    category: "Limpeza",
    date: "2026-09-24",
    status: "analysis",
  },
  {
    id: "req-002",
    title: "Manutenção predial",
    category: "Manutenção",
    date: "2026-09-20",
    status: "proposals",
  },
  {
    id: "req-003",
    title: "Serviço de tecnologia",
    category: "Tecnologia",
    date: "2026-09-12",
    status: "hired",
  },
];

// Ações principais (botões sob a busca).
export const primaryActions = [
  { id: "search", label: "Buscar fornecedor", to: "/app/fornecedores", variant: "primary" },
  { id: "new", label: "Nova solicitação", to: "/app/solicitacao", variant: "secondary" },
];

// Ações rápidas (lista lateral). `icon` referencia components/dashboard/icons.jsx.
export const quickActions = [
  { id: "search", label: "Buscar fornecedores", to: "/app/fornecedores", icon: "search" },
  { id: "new", label: "Nova solicitação", to: "/app/solicitacao", icon: "plus" },
  { id: "list", label: "Minhas solicitações", to: "/app/solicitacoes", icon: "list" },
];
