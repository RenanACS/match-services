// Breadcrumbs da área do cliente (/app/*). O último item é a página atual
// (sem link). Os nomes dos detalhes vêm dos dados demonstrativos.
//
//   /app                      Dashboard
//   /app/fornecedores         Dashboard > Fornecedores
//   /app/fornecedores/:id     Dashboard > Fornecedores > {empresa}
//   /app/solicitacao          Dashboard > Solicitações > Nova solicitação
//   /app/solicitacoes         Dashboard > Solicitações
//   /app/pagamento            Dashboard > Pagamento
//   /app/assistente           Dashboard > Mia
//   /app/perfil               Dashboard > Perfil
import { suppliers } from "../data/suppliers";
import { recentRequests } from "../data/dashboard";

const ROOT = { label: "Dashboard", to: "/app" };

export function buildClientBreadcrumbs(pathname) {
  const parts = pathname.split("/").filter(Boolean); // ["app", "fornecedores", "sup-1"]
  const section = parts[1];
  if (!section) return [{ label: ROOT.label }];
  switch (section) {
    case "fornecedores": {
      if (parts.length === 2) return [ROOT, { label: "Fornecedores" }];
      const id = decodeURIComponent(parts[2]);
      const name = suppliers.find((s) => s.id === id)?.name ?? id;
      return [ROOT, { label: "Fornecedores", to: "/app/fornecedores" }, { label: name }];
    }
    case "solicitacao":
      return [ROOT, { label: "Solicitações", to: "/app/solicitacoes" }, { label: "Nova solicitação" }];
    case "solicitacoes": {
      if (parts.length === 2) return [ROOT, { label: "Solicitações" }];
      const id = decodeURIComponent(parts[2]);
      const name = recentRequests.find((r) => r.id === id)?.title ?? "Detalhes da solicitação";
      return [ROOT, { label: "Solicitações", to: "/app/solicitacoes" }, { label: name }];
    }
    case "pagamento":
      return [ROOT, { label: "Pagamento" }];
    case "assistente":
      return [ROOT, { label: "Mia" }];
    case "perfil":
      return [ROOT, { label: "Perfil" }];
    default:
      return [ROOT];
  }
}
