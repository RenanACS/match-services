// Dados FICTÍCIOS da tela Clientes do Admin (/admin/clientes). Nada aqui é
// real. Os 162 registros são gerados de forma determinística (sempre os
// mesmos) e batem com o Dashboard: 128 clientes PF + 34 clientes PJ.
//
// CPF/CNPJ existem SOMENTE já parcialmente mascarados — o documento completo
// nunca fica no front. Com o Django, a API deve devolver o documento já
// mascarado e a busca por CPF/CNPJ completo deve ser feita no servidor.
//
// Formato pensado para ser o mesmo da futura API: trocar este arquivo pela
// resposta real não deve exigir mudanças nos componentes.

export const CLIENT_TYPE_LABELS = { PF: "Pessoa Física", PJ: "Pessoa Jurídica" };
export const CLIENT_STATUS_LABELS = { active: "Ativo", blocked: "Bloqueado" };

export const REQUEST_STATUS = {
  awaiting: { label: "Aguardando propostas", variant: "neutral" },
  in_progress: { label: "Em andamento", variant: "warning" },
  completed: { label: "Concluída", variant: "success" },
  cancelled: { label: "Cancelada", variant: "danger" },
};

// --- gerador determinístico -------------------------------------------------
function makeRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const FIRST_NAMES = [
  "Ana", "Bruno", "Carla", "Daniel", "Elisa", "Felipe", "Gabriela", "Henrique", "Isabela", "João",
  "Karina", "Lucas", "Marina", "Nicolas", "Olívia", "Paulo", "Queila", "Rafael", "Sofia", "Tiago",
  "Úrsula", "Vinícius", "Wanda", "Yuri", "Beatriz", "Caio", "Débora", "Eduardo", "Fernanda", "Gustavo",
];
const LAST_NAMES = [
  "Almeida", "Barbosa", "Cardoso", "Dias", "Esteves", "Ferreira", "Gomes", "Hoffmann", "Ibiapina", "Junqueira",
  "Lima", "Machado", "Nogueira", "Oliveira", "Pereira", "Queiroz", "Ribeiro", "Santos", "Teixeira", "Uchoa",
  "Vieira", "Xavier", "Barros", "Campos", "Duarte", "Farias", "Guedes", "Moraes", "Nunes", "Rocha",
];
const COMPANY_WORDS = [
  "Aurora", "Horizonte", "Vértice", "Atlântica", "Boreal", "Cedro", "Delta", "Esmeralda", "Faro", "Granito",
  "Ipê", "Jade", "Litoral", "Marajó", "Nova Era", "Orquídea", "Pioneira", "Quasar", "Raiz", "Sinergia",
];
const COMPANY_KINDS = ["Comércio", "Serviços", "Construções", "Tecnologia", "Alimentos", "Logística", "Consultoria"];
const COMPANY_SUFFIXES = ["Ltda.", "ME", "EPP", "S.A."];
const PLACES = [
  { city: "Belém", state: "PA", ddd: "91", cep: "660" },
  { city: "Ananindeua", state: "PA", ddd: "91", cep: "670" },
  { city: "São Paulo", state: "SP", ddd: "11", cep: "010" },
  { city: "Rio de Janeiro", state: "RJ", ddd: "21", cep: "200" },
  { city: "Fortaleza", state: "CE", ddd: "85", cep: "600" },
  { city: "Brasília", state: "DF", ddd: "61", cep: "700" },
];
const STREETS = [
  "Rua das Flores", "Avenida Central", "Travessa do Comércio", "Rua Bela Vista", "Avenida Paulista Norte",
  "Rua dos Ipês", "Travessa São José", "Avenida Beira-Rio", "Rua Quinze de Novembro", "Rua da Paz",
];
const DISTRICTS = ["Centro", "Nazaré", "Umarizal", "Batista Campos", "Marco", "Jardim América", "Boa Vista", "Cidade Nova"];
const BLOCK_REASONS = [
  "Suspeita de dados cadastrais inconsistentes, em verificação.",
  "Múltiplas contestações abertas contra o mesmo cliente.",
  "Solicitação de bloqueio feita pelo próprio titular.",
  "Atividade incompatível com os termos de uso.",
];
const SERVICES = [
  { title: "Reparo elétrico residencial", min: 18000, max: 90000 },
  { title: "Pintura de fachada", min: 120000, max: 350000 },
  { title: "Suporte de TI para escritório", min: 30000, max: 120000 },
  { title: "Limpeza pós-obra", min: 25000, max: 80000 },
  { title: "Instalação de ar-condicionado", min: 40000, max: 110000 },
  { title: "Manutenção hidráulica", min: 15000, max: 60000 },
  { title: "Montagem de móveis planejados", min: 50000, max: 180000 },
  { title: "Consultoria contábil mensal", min: 60000, max: 200000 },
];
const SUPPLIERS = [
  "Reformas Alfa Ltda", "Tech Suporte ME", "Limpa Brasil Serviços", "Eletro Norte EPP",
  "Frio Certo Climatização", "Pintura Prime Ltda", "Contábil Horizonte", "Marcenaria Ipê ME",
];
const REQUEST_STATUS_KEYS = ["completed", "completed", "completed", "in_progress", "awaiting", "cancelled"];

const pick = (list, rand) => list[Math.floor(rand() * list.length)];
const digits = (count, rand) =>
  Array.from({ length: count }, () => Math.floor(rand() * 10)).join("");
const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
const addDays = (isoDate, days) => {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const TOTAL_CLIENTS = 162;
const TOTAL_PJ = 34; // + 128 PF = 162 (Dashboard)
const NEWEST_DATE = "2026-10-16";

function buildClients() {
  const rand = makeRandom(20261019);

  // Define quais posições da lista são PJ (34 no total, espalhadas).
  const order = Array.from({ length: TOTAL_CLIENTS }, (_, index) => ({ index, key: rand() }))
    .sort((a, b) => a.key - b.key)
    .slice(0, TOTAL_PJ)
    .map((item) => item.index);
  const pjPositions = new Set(order);
  // Contas bloqueadas (9), também espalhadas.
  const blockedPositions = new Set([4, 17, 29, 45, 63, 78, 101, 120, 143]);

  return Array.from({ length: TOTAL_CLIENTS }, (_, index) => {
    const type = pjPositions.has(index) ? "PJ" : "PF";
    const place = pick(PLACES, rand);
    const registeredAt = addDays(NEWEST_DATE, -Math.round(index * 3.6));
    const phoneBody = `9${digits(4, rand)}-${digits(4, rand)}`;

    let name;
    let email;
    let document;
    if (type === "PF") {
      name = `${pick(FIRST_NAMES, rand)} ${pick(LAST_NAMES, rand)} ${pick(LAST_NAMES, rand)}`;
      email = `${slug(name).split(".").slice(0, 2).join(".")}@exemplo.com.br`;
      document = `***.${digits(3, rand)}.${digits(3, rand)}-**`;
    } else {
      const word = pick(COMPANY_WORDS, rand);
      name = `${word} ${pick(COMPANY_KINDS, rand)} ${pick(COMPANY_SUFFIXES, rand)}`;
      email = `contato@${slug(word)}.exemplo.com.br`;
      document = `${digits(2, rand)}.${digits(3, rand)}.***/****-${digits(2, rand)}`;
    }

    const id = `cli-${String(index + 1).padStart(3, "0")}`;
    const blocked = blockedPositions.has(index);
    const history = blocked
      ? [
          {
            id: `${id}-h1`,
            action: "blocked",
            reason: pick(BLOCK_REASONS, rand),
            date: `${addDays(registeredAt, 20 + (index % 30))}T14:30:00`,
            by: "Administrador (demonstrativo)",
          },
        ]
      : [];

    const requestCount = Math.floor(rand() * 5); // 0 a 4
    const requests = Array.from({ length: requestCount }, (_, n) => {
      const service = pick(SERVICES, rand);
      const status = pick(REQUEST_STATUS_KEYS, rand);
      const value = service.min + Math.round(rand() * (service.max - service.min));
      return {
        id: `${id}-r${n + 1}`,
        title: service.title,
        supplier: status === "awaiting" ? null : pick(SUPPLIERS, rand),
        date: addDays(registeredAt, 3 + n * 11),
        value: status === "awaiting" ? null : Math.round(value / 100) * 100,
        status,
      };
    }).reverse(); // mais recentes primeiro

    return {
      id,
      type,
      name,
      document,
      email,
      phone: `(${place.ddd}) ${phoneBody}`,
      address: {
        street: pick(STREETS, rand),
        number: String(10 + Math.floor(rand() * 990)),
        district: pick(DISTRICTS, rand),
        city: place.city,
        state: place.state,
        cep: `${place.cep}${digits(2, rand)}-${digits(3, rand)}`,
      },
      registeredAt,
      status: blocked ? "blocked" : "active",
      history,
      requests,
    };
  });
}

export const adminClients = buildClients();
