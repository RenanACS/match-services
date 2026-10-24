// Breadcrumbs do Admin, compartilhados por todas as telas (/admin/*).
// Cada item pode ter `to` (link). O último é a página atual (sem link).
//
//   /admin                          Painel administrativo
//   /admin/clientes                 Painel administrativo > Clientes
//   /admin/clientes/:id             Painel administrativo > Clientes > {nome}
//   /admin/fornecedores/:id         Painel administrativo > Fornecedores > {empresa}
//   /admin/solicitacoes/:id         Painel administrativo > Solicitações > Solicitação #{id}
//   /admin/pagamentos/:id           Painel administrativo > Pagamentos > #{id} (ex.: #PG2847)
//   /admin/contestacoes/:id         Painel administrativo > Contestações > #{id} (ex.: #CT0001)
//   /admin/perfil                   Painel administrativo > Perfil
//
// Os nomes dos detalhes vêm dos dados demonstrativos. Com o Django, trocar
// `detailLabel` por um contexto/rota que receba o nome já carregado pela página.
import { ADMIN_NAV } from "../data/adminNav";
import { adminClients } from "../data/adminClients";
import { adminSuppliers } from "../data/adminSuppliers";

const detailLabel = {
  clientes: (id) => adminClients.find((c) => c.id === id)?.name,
  fornecedores: (id) => adminSuppliers.find((s) => s.id === id)?.name,
  solicitacoes: (id) => `Solicitação #${id}`,
  pagamentos: (id) => `#${id}`,
  contestacoes: (id) => `#${id}`,
};

/**
 * @param {string} pathname  caminho atual
 * @param {{fromSearch?: string}} [state]  state do router: filtros da lista de
 *   origem, para que o link da seção volte com a busca/página preservadas.
 */
export function buildAdminBreadcrumbs(pathname, state) {
  const parts = pathname.split("/").filter(Boolean); // ["admin", "clientes", "cli-001"]
  const root = { label: "Painel administrativo", to: "/admin" };
  if (parts.length <= 1) return [{ label: root.label }];

  // Perfil do administrador: acessado pelo menu inferior, fora dos 8 itens principais.
  if (parts[1] === "perfil") return parts.length === 2 ? [root, { label: "Perfil" }] : [root];

  const section = ADMIN_NAV.find((item) => item.to === `/admin/${parts[1]}`);
  if (!section) return [root];
  if (parts.length === 2) return [root, { label: section.label }];

  const id = decodeURIComponent(parts[2]);
  const label = detailLabel[parts[1]]?.(id) ?? id;
  return [root, { label: section.label, to: `${section.to}${state?.fromSearch ?? ""}` }, { label }];
}
