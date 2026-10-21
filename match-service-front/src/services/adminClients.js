// Camada de acesso aos clientes do Admin. HOJE trabalha sobre dados
// fictícios em memória. Com o Django, estas funções passam a chamar a API
// (via services/api.js), por exemplo:
//   listClients   -> GET   /api/admin/clients/?q=&type=&status=&page=
//   getClient     -> GET   /api/admin/clients/:id/
//   blockClient   -> POST  /api/admin/clients/:id/block/   { reason }
//   unblockClient -> POST  /api/admin/clients/:id/unblock/
// A busca por CPF/CNPJ completo e a paginação passam a ser do servidor.
// Bloqueio NÃO cancela solicitações/contratos nem altera pagamentos/repasses.

export const PAGE_SIZE = 3;

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
const onlyDigits = (text) => text.replace(/\D/g, "");

/**
 * Filtra por busca (nome, e-mail ou CPF/CNPJ — este último só pelos dígitos
 * visíveis, pois o documento completo não existe no front), tipo e situação.
 */
export function filterClients(clients, { query = "", type = "all", status = "all" } = {}) {
  const text = normalize(query);
  const queryDigits = onlyDigits(query);
  return clients.filter((client) => {
    if (type !== "all" && client.type !== type) return false;
    if (status !== "all" && client.status !== status) return false;
    if (!text) return true;
    if (normalize(client.name).includes(text) || normalize(client.email).includes(text)) return true;
    return queryDigits.length > 0 && onlyDigits(client.document).includes(queryDigits);
  });
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, totalPages, total: items.length, start };
}
