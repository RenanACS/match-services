// Dados FICTÍCIOS do Dashboard Administrativo (/admin). Nenhum valor aqui
// é real, nem representa dinheiro efetivamente depositado, retido ou
// transferido. Quando o Django existir, este arquivo é substituído pela
// resposta da API (src/services/) mantendo o formato abaixo.
//
// Valores monetários em centavos (inteiros). Os números derivam de poucas
// constantes para permanecerem consistentes entre os indicadores.

// Comissão percentual fixa — parâmetro DEMONSTRATIVO (10% do valor do
// serviço, antes de taxas do provedor, tributos e ajustes contratuais).
export const COMMISSION_RATE_PERCENT = 10;

// Cadastros
const CLIENTS_PF = 128;
const CLIENTS_PJ = 34;
const SUPPLIERS_TOTAL = 47;
const SUPPLIERS_PENDING = 6; // aguardando análise de cadastro

// Solicitações: 214 = 150 concluídas + 38 em andamento + 14 aguardando
// propostas + 12 canceladas.
const REQUESTS_COMPLETED = 150;
const REQUESTS_IN_PROGRESS = 38;
const REQUESTS_WAITING = 14;
const REQUESTS_CANCELLED = 12;
const REQUESTS_TOTAL =
  REQUESTS_COMPLETED + REQUESTS_IN_PROGRESS + REQUESTS_WAITING + REQUESTS_CANCELLED;

// Contestações abertas (a análise é humana: conflito entre cliente e fornecedor).
const DISPUTES_OPEN = 5;

// Divergências financeiras que exigem acompanhamento (exceções; pagamentos e
// repasses normais são automáticos).
const PAYMENT_DIVERGENCES = 2;

// Financeiro: valor bruto dos serviços concluídos; comissão e repasses
// derivam dele (10% / 90%).
const COMPLETED_GROSS_CENTS = 34_700_000; // R$ 347.000,00
const COMMISSION_CENTS = (COMPLETED_GROSS_CENTS * COMMISSION_RATE_PERCENT) / 100; // R$ 34.700,00
const PAYOUTS_CENTS = COMPLETED_GROSS_CENTS - COMMISSION_CENTS; // R$ 312.300,00
const ESCROW_CENTS = 4_860_000; // R$ 48.600,00 — serviços em andamento

// Indicadores principais — uma única linha.
export const mainMetrics = [
  { id: "clients-pf", label: "Clientes PF", value: CLIENTS_PF },
  { id: "clients-pj", label: "Clientes PJ", value: CLIENTS_PJ },
  { id: "suppliers", label: "Fornecedores", value: SUPPLIERS_TOTAL },
  { id: "requests", label: "Solicitações", value: REQUESTS_TOTAL },
];

// Resumo financeiro (valores demonstrativos, em centavos).
export const financialMetrics = [
  { id: "escrow", label: "Valores em garantia", value: ESCROW_CENTS },
  { id: "payouts", label: "Repasses concluídos", value: PAYOUTS_CENTS },
  { id: "commission", label: `Comissão acumulada (${COMMISSION_RATE_PERCENT}%)`, value: COMMISSION_CENTS },
];

// Pendências: só exceções que pedem acompanhamento humano.
export const pendingItems = [
  { id: "suppliers", label: "Fornecedores aguardando análise", total: SUPPLIERS_PENDING, to: "/admin/fornecedores" },
  { id: "disputes", label: "Contestações abertas", total: DISPUTES_OPEN, to: "/admin/contestacoes" },
  { id: "payments", label: "Divergências financeiras", total: PAYMENT_DIVERGENCES, to: "/admin/pagamentos" },
];

// Três registros mais relevantes.
export const recentActivity = [
  { id: "act-1", text: "Novo fornecedor enviou cadastro para análise", time: "há 12 min" },
  { id: "act-2", text: "Contestação aberta em uma solicitação concluída", time: "há 40 min" },
  { id: "act-3", text: "Repasse registrado automaticamente", time: "há 2 h" },
];
