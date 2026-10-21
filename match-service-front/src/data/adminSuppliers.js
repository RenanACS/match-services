// Dados FICTÍCIOS da área Fornecedores do Admin (/admin/fornecedores). Nada
// aqui é real: nomes, CNPJs, e-mails, documentos, avaliações e valores são
// inventados e gerados de forma determinística (sempre os mesmos).
//
// Os totais batem com o Dashboard administrativo: 47 fornecedores, dos quais
// 6 aguardam análise de cadastro.
//   47 = 6 em análise + 34 ativos + 4 bloqueados + 3 rejeitados
//
// Formato pensado para ser o mesmo da futura API Django: trocar este arquivo
// pela resposta real não deve exigir mudanças nos componentes. Valores
// monetários em centavos.

export const SUPPLIER_STATUS_LABELS = {
  review: "Em análise",
  active: "Ativo",
  blocked: "Bloqueado",
  rejected: "Rejeitado",
};

export const SUPPLIER_CATEGORIES = [
  "Construção",
  "Manutenção",
  "Limpeza",
  "Refrigeração",
  "Eventos",
  "Tecnologia",
  "Elétrica",
  "Pintura",
  "Contabilidade",
];

// [nome, descrição, preço mínimo, preço máximo | null = sob orçamento]
const CATALOG = {
  Construção: [
    ["Reforma residencial", "Serviços de reforma completa de imóveis residenciais.", 800000, 4500000],
    ["Construção civil", "Construção de casas e edifícios.", null, null],
    ["Manutenção predial", "Serviços de manutenção preventiva e corretiva.", 120000, 600000],
  ],
  Manutenção: [
    ["Manutenção hidráulica", "Reparos e desentupimentos em instalações hidráulicas.", 15000, 60000],
    ["Reparos gerais", "Pequenos reparos residenciais e comerciais.", 12000, 70000],
    ["Montagem de móveis", "Montagem e ajuste de móveis planejados.", 50000, 180000],
  ],
  Limpeza: [
    ["Limpeza residencial", "Limpeza completa de casas e apartamentos.", 18000, 45000],
    ["Limpeza pós-obra", "Remoção de resíduos e limpeza fina após reformas.", 25000, 80000],
    ["Limpeza comercial", "Rotina de limpeza para escritórios e lojas.", null, null],
  ],
  Refrigeração: [
    ["Instalação de ar-condicionado", "Instalação de aparelhos split e multi-split.", 40000, 110000],
    ["Manutenção preventiva de split", "Limpeza e revisão periódica de aparelhos.", 15000, 35000],
    ["Reparo de câmaras frias", "Diagnóstico e reparo de refrigeração comercial.", null, null],
  ],
  Eventos: [
    ["Decoração de eventos", "Ambientação e decoração para festas e confraternizações.", 150000, 900000],
    ["Buffet e coffee break", "Serviço de alimentação para eventos e reuniões.", 60000, 500000],
    ["Locação de estrutura", "Tendas, mesas, cadeiras e palcos.", null, null],
  ],
  Tecnologia: [
    ["Suporte de TI para escritório", "Atendimento e manutenção de equipamentos e redes.", 30000, 120000],
    ["Rede e cabeamento estruturado", "Projeto e instalação de redes cabeadas e Wi-Fi.", 90000, 400000],
    ["Desenvolvimento de sites", "Sites institucionais e páginas de captação.", null, null],
  ],
  Elétrica: [
    ["Reparo elétrico residencial", "Correção de curtos, tomadas e iluminação.", 18000, 90000],
    ["Instalação de quadros", "Montagem e adequação de quadros de distribuição.", 80000, 350000],
    ["Projeto elétrico", "Dimensionamento e projeto para obras e reformas.", null, null],
  ],
  Pintura: [
    ["Pintura de fachada", "Preparação e pintura de fachadas e muros.", 120000, 350000],
    ["Pintura residencial", "Pintura interna de casas e apartamentos.", 60000, 250000],
    ["Textura e grafiato", "Acabamentos texturizados em paredes.", 50000, 200000],
  ],
  Contabilidade: [
    ["Consultoria contábil mensal", "Rotina contábil, fiscal e de folha para pequenas empresas.", 60000, 200000],
    ["Abertura de empresas", "Constituição e regularização de CNPJ.", 45000, 150000],
    ["Declarações fiscais", "Elaboração e entrega de declarações obrigatórias.", null, null],
  ],
};

const ABOUT = {
  Construção: "especializada em construção civil, reformas e manutenções prediais, atuando há mais de 10 anos no mercado de Belém e região.",
  Manutenção: "focada em manutenção residencial e comercial, com equipe própria e atendimento rápido na região metropolitana.",
  Limpeza: "prestadora de serviços de limpeza residencial, comercial e pós-obra, com equipe treinada e materiais próprios.",
  Refrigeração: "atuante em instalação e manutenção de ar-condicionado e refrigeração comercial.",
  Eventos: "organizadora de eventos sociais e corporativos, da decoração ao serviço de alimentação.",
  Tecnologia: "oferece suporte de TI, infraestrutura de redes e desenvolvimento de soluções digitais para pequenas empresas.",
  Elétrica: "realiza instalações e reparos elétricos residenciais e comerciais com profissionais habilitados.",
  Pintura: "executa pintura residencial, comercial e de fachadas, com acabamento e prazo combinados em orçamento.",
  Contabilidade: "escritório de contabilidade para pequenas empresas e profissionais autônomos.",
};

const BRANDS = [
  "Amazônia", "Tapajós", "Guamá", "Marajó", "Nazaré", "Umarizal", "Cidade Velha", "Batista", "Mangueirão", "Icoaraci",
  "Outeiro", "Atalaia", "Pioneira", "Horizonte", "Vértice", "Aurora", "Boreal", "Cedro", "Delta", "Faro",
  "Granito", "Ipê", "Jade", "Litoral", "Orquídea", "Quasar", "Raiz", "Sinergia", "Tucumã", "Açaí",
];
const CATEGORY_NOUN = {
  Construção: "Construtora",
  Manutenção: "Manutenções",
  Limpeza: "Limpeza",
  Refrigeração: "Climatização",
  Eventos: "Eventos",
  Tecnologia: "Tecnologia",
  Elétrica: "Instalações Elétricas",
  Pintura: "Pinturas",
  Contabilidade: "Contabilidade",
};
const SUFFIXES = ["LTDA", "ME", "EPP"];
const STREETS = ["Av. Nazaré", "Rua dos Mundurucus", "Travessa Quintino Bocaiúva", "Av. Almirante Barroso", "Rua Boaventura da Silva", "Av. Governador José Malcher", "Travessa Padre Eutíquio", "Rua Municipalidade"];
const DISTRICTS = ["Nazaré", "Umarizal", "Batista Campos", "Marco", "Reduto", "Pedreira", "Cidade Velha", "Guamá"];
const FIRST_NAMES = ["Ana", "Bruno", "Carla", "Daniel", "Elisa", "Felipe", "Gabriela", "Henrique", "Isabela", "João", "Karina", "Lucas", "Marina", "Paulo", "Rafael", "Sofia"];
const COMMENTS = [
  "Serviço bem executado e dentro do prazo combinado.",
  "Atendimento atencioso, explicaram tudo antes de começar.",
  "Profissionais pontuais e organizados. Recomendo.",
  "Bom custo-benefício. O acabamento ficou ótimo.",
  "Resolveram o problema rapidamente.",
  "Tive um pequeno atraso, mas a comunicação foi clara.",
  "Orçamento transparente, sem surpresas no final.",
  "O resultado foi bom, porém demoraram para responder as mensagens.",
];
const REJECT_REASONS = [
  "Documentação incompleta: comprovante de endereço ilegível.",
  "CNPJ informado não corresponde à razão social enviada.",
  "Contrato social desatualizado; reenviar com a última alteração.",
];
const BLOCK_REASONS = [
  "Múltiplas contestações abertas contra o fornecedor em curto período.",
  "Descumprimento reiterado de prazos acordados com clientes.",
  "Indícios de divergência cadastral identificados após aprovação.",
  "Conduta incompatível com os termos de uso da plataforma.",
];
const DOCUMENTS = [
  ["Contrato social", "contrato-social.pdf", "1,2 MB"],
  ["Cartão CNPJ", "cartao-cnpj.pdf", "240 KB"],
  ["Comprovante de endereço", "comprovante-endereco.pdf", "380 KB"],
  ["Documento do responsável", "documento-responsavel.pdf", "910 KB"],
];

function makeRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
const addDays = (isoDate, days) => {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

// Fornecedores que reproduzem a listagem do protótipo (primeiras cinco linhas).
const CURATED = [
  { name: "Lima Construções LTDA", tradeName: "Lima Construções", cnpj: "12.345.678/0001-90", ie: "15.678.901-2", category: "Construção", status: "review", at: "2026-10-10T14:32:00", phone: "(91) 98765-4321", email: "contato@limaconstrucoes.com.br", address: { street: "Av. Nazaré", number: "1234", district: "Nazaré", city: "Belém", state: "PA", cep: "66035-170" }, about: "Empresa especializada em construção civil, reformas e manutenções prediais, atuando há mais de 10 anos no mercado de Belém e região." },
  { name: "Aguiar Serviços", tradeName: "Aguiar Serviços", cnpj: "98.765.432/0001-11", category: "Manutenção", status: "active", at: "2026-10-08T09:15:00" },
  { name: "Norte Limpeza Profissional", tradeName: "Norte Limpeza", cnpj: "45.678.901/0001-22", category: "Limpeza", status: "active", at: "2026-10-06T16:40:00" },
  { name: "Freitas Refrigeração", tradeName: "Freitas Refrigeração", cnpj: "33.444.555/0001-33", category: "Refrigeração", status: "blocked", at: "2026-10-05T11:05:00" },
  { name: "Belém Eventos", tradeName: "Belém Eventos", cnpj: "77.888.999/0001-44", category: "Eventos", status: "active", at: "2026-10-02T13:20:00" },
];

// Status dos 42 fornecedores gerados (índice → status; o resto é "active").
const GENERATED_STATUS = {
  0: "review", 3: "review", 9: "review", 17: "review", 25: "review",
  6: "blocked", 14: "blocked", 30: "blocked",
  11: "rejected", 22: "rejected", 36: "rejected",
};
const GENERATED_COUNT = 42;

function buildSuppliers() {
  const rand = makeRandom(20261019);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const digits = (count) => Array.from({ length: count }, () => Math.floor(rand() * 10)).join("");
  const between = (min, max) => min + Math.floor(rand() * (max - min + 1));

  const base = [
    ...CURATED,
    ...Array.from({ length: GENERATED_COUNT }, (_, i) => {
      const category = SUPPLIER_CATEGORIES[(i * 7 + 3) % SUPPLIER_CATEGORIES.length];
      const brand = BRANDS[i % BRANDS.length];
      const tradeName = `${brand} ${CATEGORY_NOUN[category]}`;
      const day = addDays("2026-10-01", -Math.round(i * 6.5));
      return {
        name: `${tradeName} ${pick(SUFFIXES)}`,
        tradeName,
        cnpj: `${digits(2)}.${digits(3)}.${digits(3)}/0001-${digits(2)}`,
        ie: rand() < 0.2 ? null : `${digits(2)}.${digits(3)}.${digits(3)}-${digits(1)}`,
        category,
        status: GENERATED_STATUS[i] ?? "active",
        at: `${day}T${String(between(8, 18)).padStart(2, "0")}:${String(between(0, 59)).padStart(2, "0")}:00`,
        email: `contato@${slug(tradeName)}.exemplo.com.br`,
        phone: `(91) 9${digits(4)}-${digits(4)}`,
        address: { street: pick(STREETS), number: String(between(10, 2999)), district: pick(DISTRICTS), city: "Belém", state: "PA", cep: `660${digits(2)}-${digits(3)}` },
        // Alguns ativos já passaram por bloqueio + desbloqueio (histórico mais rico).
        reinstated: GENERATED_STATUS[i] === undefined && (i === 5 || i === 20),
      };
    }),
  ];

  return base.map((item, index) => {
    const id = `forn-${String(index + 1).padStart(3, "0")}`;
    const registeredAt = item.at;
    const day = registeredAt.slice(0, 10);
    const ADMIN = "Administrador (demonstrativo)";

    // --- histórico administrativo ---
    const history = [{ id: `${id}-h1`, action: "registered", reason: "", date: registeredAt, by: "Fornecedor (cadastro)" }];
    const push = (action, offsetDays, reason, hour = "10:30:00") =>
      history.push({ id: `${id}-h${history.length + 1}`, action, reason, date: `${addDays(day, offsetDays)}T${hour}`, by: ADMIN });
    if (item.status === "active" || item.status === "blocked") push("approved", between(1, 3), "");
    if (item.status === "blocked") push("blocked", between(20, 60), pick(BLOCK_REASONS), "15:10:00");
    if (item.status === "rejected") push("rejected", between(1, 2), pick(REJECT_REASONS));
    if (item.reinstated) {
      push("blocked", 40, "Bloqueio preventivo durante apuração de uma contestação.", "09:50:00");
      push("unblocked", 47, "Contestação encerrada sem irregularidades.", "11:20:00");
    }

    // --- serviços ---
    const catalog = CATALOG[item.category];
    const count = item.name === "Lima Construções LTDA" ? 3 : between(2, 3);
    const services = catalog.slice(0, count).map(([title, description, min, max], n) => ({
      id: `${id}-s${n + 1}`,
      name: title,
      category: item.category,
      description,
      priceCents: min === null ? null : Math.round((min + rand() * (max - min)) / 1000) * 1000 || min,
      paused: n === 2 && rand() < 0.3,
    }));

    // --- avaliações e financeiro (só quem já operou) ---
    const operated = item.status === "active" || item.status === "blocked";
    const reviews = operated
      ? Array.from({ length: between(1, 5) }, (_, n) => ({
          id: `${id}-v${n + 1}`,
          author: `${pick(FIRST_NAMES)} ${String.fromCharCode(65 + between(0, 25))}.`,
          rating: item.status === "blocked" && n < 2 ? between(1, 2) : between(3, 5),
          comment: pick(COMMENTS),
          date: addDays(day, 10 + n * 9 + between(0, 5)),
        }))
      : [];
    const completed = operated ? between(2, 38) : 0;
    const inProgress = operated ? between(0, 4) : 0;
    const average = Math.round(between(150000, 700000) / 100) * 100;
    const finance = {
      contracted: completed + inProgress,
      completed,
      inProgress,
      paidCents: completed * average,
      awaitingCents: inProgress * average,
    };

    return {
      id,
      name: item.name,
      tradeName: item.tradeName,
      cnpj: item.cnpj,
      stateRegistration: item.ie ?? null,
      category: item.category,
      status: item.status,
      registeredAt,
      phone: item.phone ?? `(91) 9${digits(4)}-${digits(4)}`,
      email: item.email ?? `contato@${slug(item.tradeName)}.exemplo.com.br`,
      address: item.address ?? { street: pick(STREETS), number: String(between(10, 2999)), district: pick(DISTRICTS), city: "Belém", state: "PA", cep: `660${digits(2)}-${digits(3)}` },
      about: item.about ?? `Empresa ${ABOUT[item.category]}`,
      services,
      documents: DOCUMENTS.map(([title, file, size], n) => ({ id: `${id}-d${n + 1}`, name: title, file, size, sentAt: registeredAt })),
      reviews,
      history,
      finance,
    };
  });
}

export const adminSuppliers = buildSuppliers();
