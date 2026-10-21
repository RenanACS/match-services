
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import AdminClientsProvider from "./context/AdminClientsProvider";
import ClientesAdmin from "./pages/admin/ClientesAdmin";
import ClienteDetalhe from "./pages/admin/ClienteDetalhe";
import AdminSuppliersProvider from "./context/AdminSuppliersProvider";
import FornecedoresAdmin from "./pages/admin/FornecedoresAdmin";
import FornecedorAdminDetalhe from "./pages/admin/FornecedorAdminDetalhe";
import SolicitacoesAdmin from "./pages/admin/SolicitacoesAdmin";
import SolicitacaoDetalhe from "./pages/admin/SolicitacaoDetalhe";
import PagamentosAdmin from "./pages/admin/PagamentosAdmin";
import PagamentoDetalhe from "./pages/admin/PagamentoDetalhe";
import AdminDisputesProvider from "./context/AdminDisputesProvider";
import AdminReviewsProvider from "./context/AdminReviewsProvider";
import ContestacoesAdmin from "./pages/admin/ContestacoesAdmin";
import ContestacaoDetalhe from "./pages/admin/ContestacaoDetalhe";
import AvaliacoesAdmin from "./pages/admin/AvaliacoesAdmin";
import ConfiguracoesAdmin from "./pages/admin/ConfiguracoesAdmin";
import PerfilAdmin from "./pages/admin/PerfilAdmin";
import { ADMIN_PLACEHOLDERS } from "./data/adminNav";

// Páginas do cliente
import Dashboard from "./pages/client/Dashboard";
import Fornecedores from "./pages/client/Fornecedores";
import FornecedorDetalhes from "./pages/client/FornecedorDetalhes";
import NovaSolicitacao from "./pages/client/NovaSolicitacao";
import Solicitacoes from "./pages/client/Solicitacoes";
import Pagamento from "./pages/client/Pagamento";
import Perfil from "./pages/client/Perfil";
import Assistente from "./pages/client/Assistente";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Área do cliente */}
        <Route path="/app" element={<AppLayout area="client" />}>
          <Route index element={<Dashboard />} />

          <Route
            path="fornecedores"
            element={<Fornecedores />}
          />

          <Route
            path="fornecedores/:id"
            element={<FornecedorDetalhes />}
          />

          <Route
            path="solicitacao"
            element={<NovaSolicitacao />}
          />

          <Route
            path="solicitacoes"
            element={<Solicitacoes />}
          />

          {/* Nova tela de Pagamentos */}
          <Route
            path="pagamento"
            element={<Pagamento />}
          />

          <Route
            path="assistente"
            element={<Assistente />}
          />

          <Route
            path="perfil"
            element={<Perfil />}
          />
        </Route>

        {/* Área do fornecedor — preservada */}
        <Route
          path="/fornecedor"
          element={<AppLayout area="fornecedor" />}
        >
          <Route
            index
            element={
              <PlaceholderPage title="Dashboard do fornecedor" />
            }
          />

          <Route
            path="solicitacoes"
            element={
              <PlaceholderPage title="Solicitações recebidas" />
            }
          />

          <Route
            path="propostas"
            element={
              <PlaceholderPage title="Propostas enviadas" />
            }
          />

          <Route
            path="servicos"
            element={
              <PlaceholderPage title="Serviços cadastrados" />
            }
          />

          <Route
            path="perfil"
            element={
              <PlaceholderPage title="Perfil da empresa" />
            }
          />
        </Route>

        {/* Área administrativa — acesso demonstrativo direto por /admin.
            TODO: proteger por perfil administrativo (Django + Front-End).
            Fornecedores: /admin/fornecedores e /admin/fornecedores/:id. */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          {/* Clientes: lista e detalhes (consulta; bloqueio demonstrativo) */}
          <Route path="clientes" element={<AdminClientsProvider />}>
            <Route index element={<ClientesAdmin />} />
            <Route path=":id" element={<ClienteDetalhe />} />
          </Route>
          {/* Fornecedores: lista, detalhes/análise de cadastro e decisões em modais */}
          <Route path="fornecedores" element={<AdminSuppliersProvider />}>
            <Route index element={<FornecedoresAdmin />} />
            <Route path=":id" element={<FornecedorAdminDetalhe />} />
          </Route>
          {/* Solicitações: lista e detalhes (somente consulta) */}
          <Route path="solicitacoes">
            <Route index element={<SolicitacoesAdmin />} />
            <Route path=":id" element={<SolicitacaoDetalhe />} />
          </Route>
          {/* Pagamentos: listagem e detalhes (somente consulta) */}
          <Route path="pagamentos">
            <Route index element={<PagamentosAdmin />} />
            <Route path=":id" element={<PagamentoDetalhe />} />
          </Route>
          {/* Contestações: lista e detalhes (decisões demonstrativas, guardadas só neste navegador) */}
          <Route path="contestacoes" element={<AdminDisputesProvider />}>
            <Route index element={<ContestacoesAdmin />} />
            <Route path=":id" element={<ContestacaoDetalhe />} />
          </Route>
          {/* Avaliações: lista e moderação demonstrativa */}
          <Route path="avaliacoes" element={<AdminReviewsProvider />}>
            <Route index element={<AvaliacoesAdmin />} />
          </Route>
          <Route path="configuracoes" element={<ConfiguracoesAdmin />} />
          <Route path="perfil" element={<PerfilAdmin />} />
          {Object.entries(ADMIN_PLACEHOLDERS).map(([path, info]) => (
            <Route
              key={path}
              path={path}
              element={<AdminPlaceholder title={info.title} description={info.description} />}
            />
          ))}
        </Route>

        {/* Página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
