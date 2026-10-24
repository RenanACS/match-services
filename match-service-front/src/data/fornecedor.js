// Dados mockados da área do fornecedor (/fornecedor/*).
// Quando o Django estiver pronto, estes exports devem ser substituídos por
// chamadas em src/services/ (via api.js) — o formato é o que as telas esperam.
// Durante a sessão, o estado editável (status, serviços, respostas etc.) vive
// em context/supplier/ e usa estes exports apenas como ponto de partida.
import { CATALOG } from "./catalog";
import { toLocalIso } from "../utils/supplierFormat";

// "Hoje" fictício: os filtros de período contam a partir desta data para que
// os dados de exemplo (outubro/2026) sempre apareçam. Com a API, trocar por new Date().
export const MOCK_TODAY = "2026-10-20T12:00";

// Categorias de serviço do cadastro de fornecedor (somente leitura do catálogo).
export const SUPPLIER_CATEGORIES = CATALOG.map(({ id, label }) => ({ id, label }));

// Nomes amigáveis dos segmentos de rota para o Breadcrumb (/fornecedor/...).
// Segmentos dinâmicos (ids, "nova", "editar") são tratados em Breadcrumb.jsx.
export const SUPPLIER_ROUTE_LABELS = {
  solicitacoes: "Solicitações",
  propostas: "Propostas",
  servicos: "Serviços",
  avaliacoes: "Avaliações",
  pagamentos: "Pagamentos",
  perfil: "Perfil",
};

// ---------------------------------------------------------------------------
// Status -> rótulo e tom de cor (ver components/supplier/ToneBadge)
// ---------------------------------------------------------------------------
export const SUPPLIER_REQUEST_STATUS = {
  pending: { label: "Aguardando confirmação", tone: "warning" },
  progress: { label: "Em andamento", tone: "info" },
  // Estado intermediário: fornecedor avisou que concluiu, cliente ainda não confirmou.
  awaiting: { label: "Aguardando cliente", tone: "orange" },
  done: { label: "Concluída", tone: "success" },
  canceled: { label: "Cancelada", tone: "danger" },
};

export const PROPOSAL_STATUS = {
  sent: { label: "Enviada", tone: "info" },
  accepted: { label: "Aceita", tone: "success" },
  refused: { label: "Recusada", tone: "danger" },
  expired: { label: "Expirada", tone: "neutral" },
};

export const PAYMENT_STATUS = {
  escrow: { label: "Em custódia", tone: "orange" },
  released: { label: "Liberado", tone: "success" },
  pending: { label: "Pendente", tone: "warning" },
  refunded: { label: "Estornado", tone: "danger" },
};

// ---------------------------------------------------------------------------
// Solicitações
// ---------------------------------------------------------------------------
function slug(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ".");
}

function shift(date, hours) {
  return toLocalIso(new Date(new Date(date).getTime() + hours * 3600000));
}

function buildHistory(date, status) {
  const history = [{ at: date, text: "Solicitação recebida" }];
  if (status === "progress" || status === "done") {
    history.push({ at: shift(date, 5), text: "Solicitação aceita pelo fornecedor" });
  }
  if (status === "done") history.push({ at: shift(date, 72), text: "Serviço concluído" });
  if (status === "canceled") history.push({ at: shift(date, 24), text: "Solicitação cancelada" });
  return history;
}

// [id, cliente, cidade, serviço, categoria, data, valor, status, descrição]
const REQUEST_ROWS = [
  ["2860", "Ana Souza", "Belém - PA", "Pintura de fachada", "Manutenção Predial", "2026-10-19T14:32", 3200, "pending", "Pintura externa de prédio comercial de dois andares, com preparação da superfície e tinta antimofo."],
  ["2859", "Bruno Lima", "Ananindeua - PA", "Limpeza pós-obra", "Limpeza", "2026-10-18T10:15", 800, "progress", "Limpeza completa após obra em sala comercial, incluindo vidros e remoção de entulho fino."],
  ["2858", "Camila Rocha", "Belém - PA", "Instalação elétrica", "Manutenção Predial", "2026-10-17T16:48", 600, "done", "Instalação de quadro de distribuição e pontos de tomada em escritório."],
  ["2857", "Diego Alves", "Marituba - PA", "Revisão hidráulica", "Manutenção Predial", "2026-10-16T09:22", 450, "canceled", "Revisão de tubulação e troca de registros em galpão. Cancelada pelo cliente."],
  ["2856", "Elaine Costa", "Castanhal - PA", "Conciliação bancária", "Financeiro / BPO", "2026-10-15T11:05", 1800, "pending", "Conciliação bancária e organização dos lançamentos do último trimestre."],
  ["2855", "Fábio Mendes", "Belém - PA", "Suporte de TI mensal", "Tecnologia", "2026-10-14T15:40", 1200, "progress", "Contrato de suporte técnico mensal para 12 estações de trabalho."],
  ["2854", "Gisele Prado", "Santarém - PA", "Limpeza empresarial", "Limpeza", "2026-10-12T08:30", 950, "done", "Limpeza semanal de escritório de 150 m², com materiais inclusos."],
  ["2853", "Heitor Nunes", "Marabá - PA", "Gestão de contas a pagar", "Financeiro / BPO", "2026-10-11T13:12", 1500, "pending", "Rotina mensal de contas a pagar e a receber para empresa de pequeno porte."],
  ["2852", "Iara Menezes", "Ananindeua - PA", "Revisão elétrica predial", "Manutenção Predial", "2026-10-10T17:00", 1400, "progress", "Inspeção e correção do cabeamento do térreo de edifício comercial."],
  ["2851", "João Teles", "Belém - PA", "Desenvolvimento de site", "Tecnologia", "2026-10-08T09:45", 4200, "done", "Site institucional de cinco páginas com formulário de contato."],
  ["2850", "Karina Duarte", "Parauapebas - PA", "Gestão de redes sociais", "Marketing", "2026-10-07T10:20", 2100, "done", "Planejamento e publicação de conteúdo mensal em duas redes sociais."],
  ["2849", "Leandro Pires", "Bragança - PA", "Revisão de contratos", "Jurídico", "2026-10-05T14:05", 2800, "canceled", "Revisão de contratos de prestação de serviços. Cancelada pelo cliente."],
  ["2848", "Márcia Farias", "Belém - PA", "Recrutamento e seleção", "RH", "2026-10-03T16:30", 3500, "progress", "Seleção de três analistas administrativos, com triagem e entrevistas."],
  ["2847", "Nelson Barros", "Abaetetuba - PA", "Implantação de ERP", "Tecnologia", "2026-10-01T08:50", 9800, "pending", "Implantação e treinamento de ERP para distribuidora com 25 usuários."],
];

export const supplierRequests = REQUEST_ROWS.map(
  ([id, name, city, service, category, date, value, status, description], index) => ({
    id,
    client: {
      name,
      city,
      phone: `(91) 9${8000 + index * 37}-${1000 + index * 113}`,
      email: `${slug(name)}@exemplo.com.br`,
    },
    service,
    category,
    date,
    value,
    status,
    description,
    history: buildHistory(date, status),
  }),
);

// ---------------------------------------------------------------------------
// Propostas enviadas pelo fornecedor
// ---------------------------------------------------------------------------
// [id, cliente, serviço, valor, prazo (dias), status, enviada em, descrição, id da solicitação]
const PROPOSAL_ROWS = [
  ["312", "Sônia Matos", "Recrutamento e seleção", 3000, 25, "sent", "2026-10-18T11:45", "Seleção de dois gerentes comerciais, com mapeamento de mercado e relatório de entrevistas.", null],
  ["311", "Rafael Souza", "Desenvolvimento de aplicativo", 12500, 90, "expired", "2026-10-01T16:00", "Aplicativo mobile para agendamento de serviços, com painel administrativo.", null],
  ["310", "Quitéria Lopes", "Limpeza empresarial", 1100, 7, "expired", "2026-10-02T09:00", "Limpeza semanal de clínica com 200 m², materiais inclusos.", null],
  ["309", "Paulo Ribeiro", "Planejamento orçamentário", 2400, 20, "refused", "2026-10-02T15:20", "Elaboração de orçamento anual com projeções trimestrais.", null],
  ["308", "Leandro Pires", "Revisão de contratos", 2800, 15, "refused", "2026-10-04T10:40", "Revisão de contratos de prestação de serviços e parecer jurídico.", "2849"],
  ["307", "Karina Duarte", "Gestão de redes sociais", 2100, 30, "accepted", "2026-10-05T11:15", "Planejamento e publicação de conteúdo mensal em duas redes sociais.", "2850"],
  ["306", "Fábio Mendes", "Suporte de TI mensal", 1200, 30, "accepted", "2026-10-13T10:00", "Suporte técnico remoto e presencial para 12 estações de trabalho.", "2855"],
  ["305", "Bruno Lima", "Limpeza pós-obra", 800, 3, "accepted", "2026-10-17T09:00", "Limpeza completa de sala comercial após obra, com remoção de entulho fino.", "2859"],
  ["304", "Nelson Barros", "Implantação de ERP", 9800, 60, "sent", "2026-10-01T09:30", "Implantação, migração de dados e treinamento para 25 usuários.", "2847"],
  ["303", "Heitor Nunes", "Gestão de contas a pagar", 1500, 30, "sent", "2026-10-11T14:30", "Rotina mensal de contas a pagar e a receber, com relatório de fluxo de caixa.", "2853"],
  ["302", "Elaine Costa", "Conciliação bancária", 1800, 10, "sent", "2026-10-15T12:00", "Conciliação bancária do trimestre e organização dos lançamentos.", "2856"],
  ["301", "Ana Souza", "Pintura de fachada", 3200, 12, "sent", "2026-10-19T15:10", "Pintura externa com preparação da superfície e tinta antimofo.", "2860"],
];

export const supplierProposals = PROPOSAL_ROWS.map(
  ([id, client, service, value, days, status, sentAt, description, requestId]) => ({
    id,
    client,
    service,
    value,
    days,
    status,
    sentAt,
    description,
    requestId,
  }),
);

// ---------------------------------------------------------------------------
// Serviços oferecidos
// ---------------------------------------------------------------------------
// [id, nome, categoria, preço mínimo, preço máximo, descrição, ativo]
const SERVICE_ROWS = [
  ["1", "Reforma e pintura de fachadas", "Manutenção Predial", 2500, 9000, "Pintura externa, correção de reboco e impermeabilização.", true],
  ["2", "Instalação elétrica comercial", "Manutenção Predial", 400, 3500, "Quadros, pontos de tomada e iluminação para escritórios e lojas.", true],
  ["3", "Revisão hidráulica predial", "Manutenção Predial", 300, 1800, "Detecção de vazamentos, troca de registros e tubulações.", true],
  ["4", "Limpeza pós-obra", "Limpeza", 600, 2500, "Limpeza fina após obras, com remoção de entulho e vidros.", true],
  ["5", "Limpeza empresarial recorrente", "Limpeza", 800, 4000, "Contratos semanais ou mensais para escritórios e clínicas.", true],
  ["6", "Suporte de TI mensal", "Tecnologia", 900, 3500, "Suporte remoto e presencial, backup e gestão de equipamentos.", true],
  ["7", "Desenvolvimento de sites", "Tecnologia", 3000, 12000, "Sites institucionais e lojas virtuais sob medida.", true],
  ["8", "Implantação de ERP", "Tecnologia", 8000, 30000, "Implantação, migração de dados e treinamento de equipes.", false],
  ["9", "Conciliação bancária", "Financeiro / BPO", 1200, 3000, "Conciliação mensal e relatórios de divergências.", true],
  ["10", "Gestão de contas a pagar e a receber", "Financeiro / BPO", 1500, 4500, "Rotina financeira completa com fluxo de caixa.", true],
  ["11", "Gestão de redes sociais", "Marketing", 1800, 5000, "Planejamento, criação e publicação de conteúdo.", false],
];

export const supplierServices = SERVICE_ROWS.map(
  ([id, name, category, minPrice, maxPrice, description, active]) => ({
    id,
    name,
    category,
    minPrice,
    maxPrice,
    description,
    active,
  }),
);

// ---------------------------------------------------------------------------
// Avaliações recebidas
// ---------------------------------------------------------------------------
// [id, cliente, nota, comentário, data, serviço, resposta]
const REVIEW_ROWS = [
  ["1", "Camila Rocha", 5, "Equipe pontual e serviço muito bem executado, sem sujeira no local.", "2026-10-18T18:00", "Instalação elétrica", { text: "Obrigado, Camila! Foi um prazer atender você.", at: "2026-10-18T19:10" }],
  ["2", "Gisele Prado", 5, "Atendimento excelente e escritório impecável toda semana.", "2026-10-14T09:30", "Limpeza empresarial recorrente", null],
  ["3", "João Teles", 5, "Entregaram o site antes do prazo e com ótima qualidade.", "2026-10-10T15:20", "Desenvolvimento de sites", { text: "Agradecemos a confiança, João. Seguimos à disposição!", at: "2026-10-10T16:00" }],
  ["4", "Karina Duarte", 4, "Bom trabalho nas redes, só atrasou um pouco o primeiro relatório.", "2026-10-09T11:00", "Gestão de redes sociais", null],
  ["5", "Tânia Gomes", 5, "Resolveram o vazamento no mesmo dia. Muito profissionais.", "2026-10-12T17:45", "Revisão hidráulica predial", null],
  ["6", "Ubirajara Nery", 4, "Serviço bom e preço justo.", "2026-10-11T10:10", "Reforma e pintura de fachadas", null],
  ["7", "Vera Lúcia Matos", 5, "Organizaram nossas contas e hoje temos clareza do caixa.", "2026-10-09T14:25", "Gestão de contas a pagar e a receber", null],
  ["8", "Wagner Cruz", 4, "Suporte rápido, mas a comunicação inicial poderia ser mais clara.", "2026-10-07T08:55", "Suporte de TI mensal", null],
  ["9", "Yasmin Ferreira", 5, "Time atencioso e entrega dentro do combinado.", "2026-10-06T13:40", "Limpeza pós-obra", null],
  ["10", "Zeca Almeida", 3, "O serviço foi correto, mas houve atraso de dois dias.", "2026-10-05T16:15", "Instalação elétrica comercial", null],
  ["11", "Adriana Lobo", 4, "Ótima conciliação, relatórios claros.", "2026-10-04T10:50", "Conciliação bancária", null],
  ["12", "Breno Castro", 2, "Faltou acabamento em alguns pontos da pintura.", "2026-10-03T12:20", "Reforma e pintura de fachadas", null],
  ["13", "Cláudia Reis", 1, "Não compareceram no horário combinado.", "2026-10-02T09:05", "Limpeza empresarial recorrente", null],
  ["14", "Davi Moreira", 5, "Superou as expectativas, voltarei a contratar.", "2026-10-01T18:30", "Desenvolvimento de sites", null],
];

export const supplierReviews = REVIEW_ROWS.map(
  ([id, client, rating, comment, date, service, reply]) => ({
    id,
    client,
    rating,
    comment,
    date,
    service,
    reply,
  }),
);

// ---------------------------------------------------------------------------
// Pagamentos
// ---------------------------------------------------------------------------
// [id, cliente, serviço, valor, data, status, id da solicitação]
const PAYMENT_ROWS = [
  ["PG-5114", "Ana Souza", "Pintura de fachada (sinal)", 1600, "2026-10-19T15:30", "escrow", "2860"],
  ["PG-5113", "Bruno Lima", "Limpeza pós-obra", 800, "2026-10-18T11:00", "escrow", "2859"],
  ["PG-5112", "Camila Rocha", "Instalação elétrica", 600, "2026-10-17T18:20", "released", "2858"],
  ["PG-5111", "Diego Alves", "Revisão hidráulica", 450, "2026-10-16T10:05", "refunded", "2857"],
  ["PG-5110", "Elaine Costa", "Conciliação bancária", 1800, "2026-10-15T12:40", "pending", "2856"],
  ["PG-5109", "Fábio Mendes", "Suporte de TI mensal", 1200, "2026-10-14T16:10", "escrow", "2855"],
  ["PG-5108", "Gisele Prado", "Limpeza empresarial", 950, "2026-10-13T09:15", "released", "2854"],
  ["PG-5107", "Iara Menezes", "Revisão elétrica predial", 700, "2026-10-10T17:30", "escrow", "2852"],
  ["PG-5106", "João Teles", "Desenvolvimento de site", 4200, "2026-10-09T14:00", "released", "2851"],
  ["PG-5105", "Karina Duarte", "Gestão de redes sociais", 2100, "2026-10-08T10:45", "released", "2850"],
  ["PG-5104", "Leandro Pires", "Revisão de contratos", 1400, "2026-10-06T15:25", "refunded", "2849"],
  ["PG-5103", "Márcia Farias", "Recrutamento e seleção", 1750, "2026-10-04T09:50", "pending", "2848"],
  ["PG-5102", "Tânia Gomes", "Revisão hidráulica predial", 520, "2026-10-12T18:00", "released", null],
  ["PG-5101", "Vera Lúcia Matos", "Gestão de contas a pagar e a receber", 1500, "2026-10-09T15:00", "released", null],
];

export const supplierPayments = PAYMENT_ROWS.map(
  ([id, client, service, value, date, status, requestId]) => ({
    id,
    client,
    service,
    value,
    date,
    status,
    requestId,
  }),
);
