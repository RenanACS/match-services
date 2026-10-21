// Navegação do painel administrativo (/admin). Exatamente oito itens.
// A análise de cadastro de fornecedores NÃO é um item próprio: ela acontece
// dentro de "Fornecedores", na rota /admin/fornecedores/:id.
export const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: "home", end: true },
  { to: "/admin/clientes", label: "Clientes", icon: "users" },
  { to: "/admin/fornecedores", label: "Fornecedores", icon: "suppliers" },
  { to: "/admin/solicitacoes", label: "Solicitações", icon: "requests" },
  { to: "/admin/pagamentos", label: "Pagamentos", icon: "payments" },
  { to: "/admin/contestacoes", label: "Contestações", icon: "disputes" },
  { to: "/admin/avaliacoes", label: "Avaliações", icon: "star" },
  { to: "/admin/configuracoes", label: "Configurações", icon: "settings" },
];

// Todas as telas do Admin já existem; não restam placeholders. O objeto continua
// exportado (vazio) para que o App.jsx não precise mudar se surgir uma nova tela.
export const ADMIN_PLACEHOLDERS = {};
