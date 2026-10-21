// Dados DEMONSTRATIVOS dos detalhes das solicitações do cliente
// (/app/solicitacoes/:id). Complementam `recentRequests` (data/dashboard.js)
// pelo mesmo `id`. Com o Django, estes dados passam a vir de
// GET /api/requests/:id/ (ver services/clientRequests.js); o formato abaixo é
// o que os componentes esperam.
//
// Valores em centavos. Datas ISO (YYYY-MM-DD). Nada aqui representa dinheiro
// realmente cobrado, retido ou transferido: o estado financeiro REAL só pode
// vir do backend/provedor financeiro.
//
// release.status (só em solicitações concluídas):
//   awaiting_release  Aguardando liberação (backend ainda não validou/solicitou)
//   processing        Liberação em processamento (solicitada ao provedor)
//   released          Pagamento liberado — SÓ com `confirmedAt` vindo do provedor

export const REQUEST_DETAILS = {
  "req-001": {
    description:
      "Limpeza completa de escritório de 180 m² com 12 estações de trabalho, copa e dois banheiros, incluindo higienização de carpetes e vidros internos. Serviço previsto para um fim de semana, sem funcionamento da empresa.",
    location: "Belém - PA",
    period: "11/10/2026 a 13/10/2026",
    dates: { createdAt: "2026-09-24", analysisAt: "2026-09-24" },
  },
  "req-002": {
    description:
      "Manutenção predial preventiva e corretiva em prédio comercial de 3 andares: revisão das instalações hidráulicas e elétricas, reparo de infiltrações na cobertura e pintura de áreas comuns.",
    location: "Ananindeua - PA",
    period: "20/10/2026 a 30/10/2026",
    dates: { createdAt: "2026-09-20", analysisAt: "2026-09-20", proposalsAt: "2026-09-23" },
    proposals: [
      {
        id: "prop-001",
        supplierId: "sup-003",
        valueCents: 235000,
        leadTime: "7 dias úteis",
        details:
          "Inclui vistoria prévia, mão de obra e materiais básicos. Garantia de 90 dias sobre o serviço executado.",
      },
      {
        id: "prop-002",
        supplierId: "sup-006",
        valueCents: 278000,
        leadTime: "5 dias úteis",
        details:
          "Equipe própria, materiais inclusos e limpeza final da obra. Início em até 3 dias após a contratação.",
      },
      {
        id: "prop-003",
        supplierId: "sup-001",
        valueCents: 219000,
        leadTime: "10 dias úteis",
        details:
          "Serviços de conservação e pequenos reparos. Pintura e infiltrações dependem de avaliação no local.",
      },
    ],
  },
  "req-003": {
    description:
      "Suporte técnico e reestruturação da rede de uma empresa de 25 colaboradores: troca de roteadores, organização do cabeamento, configuração de backup e treinamento básico da equipe.",
    location: "Belém - PA",
    period: "15/09/2026 a 25/10/2026",
    dates: {
      createdAt: "2026-09-12",
      analysisAt: "2026-09-12",
      proposalsAt: "2026-09-13",
      acceptedAt: "2026-09-14",
      paidAt: "2026-09-15",
      startedAt: "2026-09-16",
    },
    contract: {
      supplierId: "sup-002",
      proposalId: "prop-hired-003",
      service: "Suporte técnico e reestruturação de rede",
      valueCents: 420000,
      hiredAt: "2026-09-15",
      expectedAt: "2026-10-25",
      execution: "in_progress",
    },
    // Pagamento retido: valor pago à plataforma e mantido em custódia.
    payment: { status: "held", amountCents: 420000, paidAt: "2026-09-15" },
  },
  "req-004": {
    description:
      "Limpeza pós-obra em sala comercial de 90 m²: remoção de resíduos de obra, limpeza de pisos, vidros e esquadrias e higienização final.",
    location: "Belém - PA",
    period: "22/08/2026 a 05/09/2026",
    dates: {
      createdAt: "2026-08-18",
      analysisAt: "2026-08-18",
      proposalsAt: "2026-08-19",
      acceptedAt: "2026-08-21",
      paidAt: "2026-08-22",
      startedAt: "2026-08-24",
      completedAt: "2026-09-10",
    },
    contract: {
      supplierId: "sup-001",
      service: "Limpeza pós-obra",
      valueCents: 195000,
      hiredAt: "2026-08-22",
      expectedAt: "2026-09-05",
      execution: "completed",
    },
    payment: { status: "held", amountCents: 195000, paidAt: "2026-08-22" },
    completion: { confirmedAt: "2026-09-10", confirmedBy: "Cliente" },
    release: { status: "awaiting_release", requestedAt: null, confirmedAt: null },
  },
  "req-005": {
    description:
      "Instalação de 8 câmeras de monitoramento com gravador, cabeamento e configuração de acesso remoto em galpão comercial.",
    location: "Belém - PA",
    period: "09/08/2026 a 28/08/2026",
    dates: {
      createdAt: "2026-08-05",
      analysisAt: "2026-08-05",
      proposalsAt: "2026-08-06",
      acceptedAt: "2026-08-08",
      paidAt: "2026-08-09",
      startedAt: "2026-08-12",
      completedAt: "2026-08-30",
    },
    contract: {
      supplierId: "sup-004",
      service: "Instalação de câmeras de monitoramento",
      valueCents: 340000,
      hiredAt: "2026-08-09",
      expectedAt: "2026-08-28",
      execution: "completed",
    },
    payment: { status: "held", amountCents: 340000, paidAt: "2026-08-09" },
    completion: { confirmedAt: "2026-08-30", confirmedBy: "Cliente" },
    release: { status: "processing", requestedAt: "2026-08-31", confirmedAt: null },
  },
  "req-006": {
    description:
      "Consultoria contábil trimestral: conferência da escrituração, apuração de tributos do trimestre e orientações de planejamento tributário.",
    location: "Belém - PA",
    period: "26/07/2026 a 10/08/2026",
    dates: {
      createdAt: "2026-07-22",
      analysisAt: "2026-07-22",
      proposalsAt: "2026-07-23",
      acceptedAt: "2026-07-25",
      paidAt: "2026-07-26",
      startedAt: "2026-07-27",
      completedAt: "2026-08-12",
    },
    contract: {
      supplierId: "sup-005",
      service: "Consultoria contábil trimestral",
      valueCents: 260000,
      hiredAt: "2026-07-26",
      expectedAt: "2026-08-10",
      execution: "completed",
    },
    payment: { status: "held", amountCents: 260000, paidAt: "2026-07-26" },
    completion: { confirmedAt: "2026-08-12", confirmedBy: "Cliente" },
    // Liberado: só aparece assim com `confirmedAt` (confirmação do provedor).
    release: { status: "released", requestedAt: "2026-08-13", confirmedAt: "2026-08-15" },
  },
};
