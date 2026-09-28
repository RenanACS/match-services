// Dados mockados de fornecedores (hub de empresas prestadoras de serviço).
// Quando o Django estiver pronto, `suppliers` deve ser substituído por uma
// chamada em src/services/ (via api.js) — o formato abaixo já é o que os
// componentes de fornecedores (catálogo e detalhes) esperam receber.
//
// `name`, `category`, `description`, `rating`, `location` e `tags` são
// usados pela busca/filtros da tela de Fornecedores (não alterados aqui).
// `cnpj`, `phone`, `memberSince`, `fullDescription`, `services`,
// `reviewsCount` e `reviews` foram adicionados só para a página de
// detalhes do fornecedor.

export const suppliers = [
  {
    id: "sup-001",
    name: "Alfa Limpeza Corporativa",
    category: "Limpeza",
    description: "Limpeza e conservação para ambientes corporativos.",
    rating: 4.9,
    location: "Belém - PA",
    tags: ["limpeza", "conservação", "corporativo"],
    cnpj: "12.345.678/0001-90",
    phone: "(91) 99999-1010",
    memberSince: 2025,
    fullDescription:
      "Empresa especializada em limpeza e conservação para escritórios, condomínios comerciais e ambientes corporativos, com equipe própria treinada e materiais adequados a cada tipo de superfície.",
    services: [
      "Limpeza empresarial",
      "Limpeza pós-obra",
      "Conservação de ambientes",
      "Higienização de espaços",
    ],
    reviewsCount: 28,
    reviews: [
      {
        author: "Cliente",
        rating: 5,
        text: "Ótimo atendimento e serviço realizado dentro do prazo.",
      },
      {
        author: "Cliente",
        rating: 5,
        text: "Equipe organizada e serviço de qualidade.",
      },
    ],
  },
  {
    id: "sup-002",
    name: "NordTech Soluções",
    category: "Tecnologia",
    description: "Suporte técnico e infraestrutura de TI para empresas.",
    rating: 4.8,
    location: "Belém - PA",
    tags: ["tecnologia", "ti", "suporte"],
    cnpj: "23.456.789/0001-01",
    phone: "(91) 99999-2020",
    memberSince: 2024,
    fullDescription:
      "Atua com suporte técnico e infraestrutura de TI para pequenas e médias empresas, cobrindo desde o atendimento a chamados até a manutenção preventiva de redes e servidores.",
    services: [
      "Suporte técnico",
      "Infraestrutura de TI",
      "Manutenção de redes",
      "Backup e segurança de dados",
    ],
    reviewsCount: 19,
    reviews: [
      {
        author: "Cliente",
        rating: 5,
        text: "Resolveram um problema de rede que já durava semanas.",
      },
      {
        author: "Cliente",
        rating: 4,
        text: "Bom suporte, comunicação clara durante todo o atendimento.",
      },
    ],
  },
  {
    id: "sup-003",
    name: "Predial Manutenções Ltda",
    category: "Manutenção",
    description: "Manutenção predial preventiva e corretiva.",
    rating: 4.7,
    location: "Ananindeua - PA",
    tags: ["manutenção", "predial", "elétrica", "hidráulica"],
    cnpj: "34.567.890/0001-12",
    phone: "(91) 99999-3030",
    memberSince: 2023,
    fullDescription:
      "Presta serviços de manutenção predial preventiva e corretiva para condomínios e empresas, com equipe própria para chamados elétricos, hidráulicos e reparos gerais.",
    services: [
      "Manutenção elétrica",
      "Manutenção hidráulica",
      "Manutenção preventiva",
      "Reparos gerais",
    ],
    reviewsCount: 34,
    reviews: [
      {
        author: "Cliente",
        rating: 5,
        text: "Atenderam um chamado urgente no mesmo dia.",
      },
      {
        author: "Cliente",
        rating: 4,
        text: "Serviço bem-feito, equipe pontual.",
      },
    ],
  },
  {
    id: "sup-004",
    name: "Vigia Segurança Patrimonial",
    category: "Segurança",
    description: "Vigilância e monitoramento para condomínios e empresas.",
    rating: 4.6,
    location: "Belém - PA",
    tags: ["segurança", "vigilância", "monitoramento"],
    cnpj: "45.678.901/0001-23",
    phone: "(91) 99999-4040",
    memberSince: 2022,
    fullDescription:
      "Oferece vigilância patrimonial e monitoramento para condomínios e empresas da região, com equipe treinada e supervisão contínua das rondas e postos de trabalho.",
    services: [
      "Vigilância patrimonial",
      "Monitoramento por câmeras",
      "Portaria terceirizada",
      "Rondas periódicas",
    ],
    reviewsCount: 15,
    reviews: [
      {
        author: "Cliente",
        rating: 5,
        text: "Equipe atenta e bem treinada, nos sentimos seguros.",
      },
      {
        author: "Cliente",
        rating: 4,
        text: "Bom custo-benefício para o condomínio.",
      },
    ],
  },
  {
    id: "sup-005",
    name: "Contas Certas Contabilidade",
    category: "Contabilidade",
    description: "Contabilidade e consultoria fiscal para pequenas empresas.",
    rating: 4.5,
    location: "São Paulo - SP",
    tags: ["contabilidade", "fiscal", "consultoria"],
    cnpj: "56.789.012/0001-34",
    phone: "(11) 99999-5050",
    memberSince: 2025,
    fullDescription:
      "Escritório de contabilidade voltado a pequenas e médias empresas, com consultoria fiscal, apoio na abertura de empresas e acompanhamento tributário mensal.",
    services: [
      "Contabilidade fiscal",
      "Folha de pagamento",
      "Consultoria tributária",
      "Abertura de empresas",
    ],
    reviewsCount: 12,
    reviews: [
      {
        author: "Cliente",
        rating: 5,
        text: "Ajudaram a organizar a contabilidade da empresa rapidamente.",
      },
      {
        author: "Cliente",
        rating: 4,
        text: "Equipe atenciosa e sempre disponível para dúvidas.",
      },
    ],
  },
  {
    id: "sup-006",
    name: "Higiene Total Serviços",
    category: "Limpeza",
    description: "Limpeza pós-obra e higienização industrial.",
    rating: 4.4,
    location: "Curitiba - PR",
    tags: ["limpeza", "higienização", "pós-obra"],
    cnpj: "67.890.123/0001-45",
    phone: "(41) 99999-6060",
    memberSince: 2024,
    fullDescription:
      "Especializada em limpeza pós-obra e higienização industrial, atendendo empresas de construção civil e indústrias que precisam de limpeza técnica especializada.",
    services: [
      "Limpeza pós-obra",
      "Higienização industrial",
      "Limpeza de estofados",
      "Desinfecção de ambientes",
    ],
    reviewsCount: 9,
    reviews: [
      {
        author: "Cliente",
        rating: 4,
        text: "Deixaram o espaço pronto para uso logo após a obra.",
      },
      {
        author: "Cliente",
        rating: 5,
        text: "Serviço caprichado e dentro do prazo combinado.",
      },
    ],
  },
  {
    id: "sup-007",
    name: "InovaTI Infraestrutura",
    category: "Tecnologia",
    description: "Redes, servidores e suporte remoto especializado.",
    rating: 4.3,
    location: "São Paulo - SP",
    tags: ["tecnologia", "redes", "servidores"],
    cnpj: "78.901.234/0001-56",
    phone: "(11) 99999-7070",
    memberSince: 2023,
    fullDescription:
      "Atua com infraestrutura de redes e servidores, incluindo suporte remoto especializado e cabeamento estruturado para empresas de pequeno e médio porte.",
    services: [
      "Redes corporativas",
      "Servidores e cloud",
      "Suporte remoto",
      "Cabeamento estruturado",
    ],
    reviewsCount: 7,
    reviews: [
      {
        author: "Cliente",
        rating: 4,
        text: "Suporte remoto ágil, resolveram sem precisar vir ao local.",
      },
      {
        author: "Cliente",
        rating: 4,
        text: "Bom conhecimento técnico, recomendo.",
      },
    ],
  },
];

// Opções do filtro de categoria — derivadas das categorias presentes em
// `suppliers`, na ordem em que aparecem pela primeira vez.
export const supplierCategories = [...new Set(suppliers.map((s) => s.category))];

// Opções do filtro de localização — mesma lógica, a partir de `location`.
export const supplierLocations = [...new Set(suppliers.map((s) => s.location))];

// Opções do filtro de avaliação (nota mínima).
export const supplierRatingOptions = [
  { value: "4.5", label: "4,5 ★ ou mais" },
  { value: "4.0", label: "4,0 ★ ou mais" },
  { value: "3.5", label: "3,5 ★ ou mais" },
];
