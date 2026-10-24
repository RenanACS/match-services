// Dados FICTÍCIOS do Dashboard Administrativo (/admin). Nenhum valor aqui
// é real, nem representa dinheiro efetivamente depositado, retido ou
// transferido. Quando o Django existir, este arquivo é substituído pela
// resposta da API (src/services/) mantendo o formato abaixo.
//
// Valores monetários em centavos (inteiros). Cadastros, contestações e
// pagamentos derivam das MESMAS listas das telas de detalhe, para o dashboard
// bater com o que o administrador vê ao clicar.

import { adminSuppliers } from "./adminSuppliers";
import { baseDisputes } from "../services/adminDisputes";
import { allPayments, summarizePayments } from "../services/adminPayments";

import { COMMISSION_RATE_PERCENT } from "./adminCommission";
export { COMMISSION_RATE_PERCENT };

// Cadastros
const CLIENTS_PF = 128;
const CLIENTS_PJ = 34;
const SUPPLIERS_TOTAL = adminSuppliers.length;
const SUPPLIERS_PENDING = adminSuppliers.filter((s) => s.status === "review").length; // aguardando análise de cadastro

// Solicitações: 214 = 150 concluídas + 38 em andamento + 14 aguardando
// propostas + 12 canceladas.
const REQUESTS_COMPLETED = 150;
const REQUESTS_IN_PROGRESS = 38;
const REQUESTS_WAITING = 14;
const REQUESTS_CANCELLED = 12;
const REQUESTS_TOTAL =
  REQUESTS_COMPLETED + REQUESTS_IN_PROGRESS + REQUESTS_WAITING + REQUESTS_CANCELLED;

// Contestações abertas (a análise é humana: conflito entre cliente e fornecedor).
const DISPUTES_OPEN = baseDisputes.filter((d) => d.status === "open").length;

// Pagamentos com falha (exceções; pagamentos e repasses normais são automáticos).
const PAYMENTS_FAILED = allPayments.filter((p) => p.status === "failed").length;

// Financeiro: mesmos totais da tela de Pagamentos (retido = em custódia).
const finance = summarizePayments(allPayments);
const ESCROW_CENTS = finance.held.cents;
const PAYOUTS_CENTS = finance.released.cents;
const COMMISSION_CENTS = finance.commission.cents;

// Indicadores principais — uma única linha.
export const mainMetrics = [
  { id: "clients-pf", label: "Clientes PF", value: CLIENTS_PF },
  { id: "clients-pj", label: "Clientes PJ", value: CLIENTS_PJ },
  { id: "suppliers", label: "Fornecedores", value: SUPPLIERS_TOTAL },
  { id: "requests", label: "Solicitações", value: REQUESTS_TOTAL },
];

// Resumo financeiro (valores demonstrativos, em centavos).
export const financialMetrics = [
  { id: "escrow", label: "Em custódia", value: ESCROW_CENTS },
  { id: "payouts", label: "Repasses concluídos", value: PAYOUTS_CENTS },
  { id: "commission", label: `Comissão acumulada (${COMMISSION_RATE_PERCENT}%)`, value: COMMISSION_CENTS },
];

// Pendências: só exceções que pedem acompanhamento humano.
export const pendingItems = [
  { id: "suppliers", label: "Fornecedores aguardando análise", total: SUPPLIERS_PENDING, to: "/admin/fornecedores?situacao=review" },
  { id: "disputes", label: "Contestações abertas", total: DISPUTES_OPEN, to: "/admin/contestacoes?situacao=open" },
  { id: "payments", label: "Pagamentos com falha", total: PAYMENTS_FAILED, to: "/admin/pagamentos?situacao=failed" },
];

// Três registros mais relevantes.
export const recentActivity = [
  { id: "act-1", text: "Novo fornecedor enviou cadastro para análise", time: "há 12 min" },
  { id: "act-2", text: "Contestação aberta em uma solicitação concluída", time: "há 40 min" },
  { id: "act-3", text: "Repasse registrado automaticamente", time: "há 2 h" },
];
