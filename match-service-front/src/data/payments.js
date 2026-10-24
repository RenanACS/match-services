// Dados mockados da tela de Pagamentos (/app/pagamento).
// Formato pensado para já ser o que os componentes esperam receber quando
// isso vier da API Django — trocar este arquivo pelas respostas reais no
// futuro não deve exigir mudanças nos componentes que o consomem.
//
// "amount" fica em centavos (inteiro) para evitar erros de ponto flutuante
// em somas; formatPaymentAmount (em PaymentList.jsx) converte para exibição
// em BRL.

// Status -> variante do Badge (reaproveita as mesmas variantes do Badge
// já usado em Minhas Solicitações).
export const PAYMENT_STATUS = {
  pending: { label: "Pendente", variant: "warning" },
  paid: { label: "Pago", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

export const PAYMENT_METHOD_LABELS = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
};

export const payments = [
  {
    id: "pay-001",
    service: "Serviço de tecnologia",
    company: "NordTech Soluções",
    amountCents: 420000,
    date: "2026-09-15",
    status: "paid",
    custody: "released",
    method: "pix",
  },
  {
    id: "pay-002",
    service: "Manutenção predial",
    company: "Predial Manutenções Ltda",
    amountCents: 235000,
    date: "2026-09-22",
    status: "pending",
    method: null,
  },
  {
    id: "pay-003",
    service: "Limpeza empresarial",
    company: "Alfa Limpeza Corporativa",
    amountCents: 168000,
    date: "2026-08-30",
    status: "cancelled",
    method: null,
  },
  {
    id: "pay-004",
    service: "Suporte de TI mensal",
    company: "InovaTI Infraestrutura",
    amountCents: 98000,
    date: "2026-09-05",
    status: "paid",
    method: "credit_card",
  },
  {
    id: "pay-005",
    service: "Higienização de estofados",
    company: "Higiene Total Serviços",
    amountCents: 72000,
    date: "2026-09-28",
    status: "pending",
    method: null,
  },
];
