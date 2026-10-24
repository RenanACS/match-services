import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AREAS = { admin: "Administração", app: "Cliente", fornecedor: "Fornecedor" };
const SECTIONS = {
  clientes: "Clientes",
  fornecedores: "Fornecedores",
  solicitacoes: "Solicitações",
  solicitacao: "Nova solicitação",
  pagamentos: "Pagamentos",
  pagamento: "Pagamento",
  contestacoes: "Contestações",
  avaliacoes: "Avaliações",
  configuracoes: "Configurações",
  perfil: "Perfil",
  assistente: "Mia",
  propostas: "Propostas",
  servicos: "Serviços",
};
const PUBLIC = { "/login": "Entrar", "/cadastro": "Criar conta", "/recuperar-senha": "Recuperar senha" };

/** Mantém o título da aba coerente com a área e a seção (ajuda leitores de tela e o histórico). */
export default function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [area, section] = pathname.split("/").filter(Boolean);
    const parts = [];
    if (PUBLIC[pathname]) parts.push(PUBLIC[pathname]);
    else if (AREAS[area]) parts.push(SECTIONS[section] ?? "Painel", AREAS[area]);
    document.title = [...parts, "MATCH SERVICES"].join(" · ");
  }, [pathname]);
  return null;
}
