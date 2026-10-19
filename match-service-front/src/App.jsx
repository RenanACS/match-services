
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

import AppLayout from "./components/layout/AppLayout";

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

        {/* Página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
