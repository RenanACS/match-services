import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/client/Dashboard";
import Fornecedores from "./pages/client/Fornecedores";
import FornecedorDetalhes from "./pages/client/FornecedorDetalhes";
import NovaSolicitacao from "./pages/client/NovaSolicitacao";
import Assistente from "./pages/client/Assistente";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública — landing intocada */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Área do cliente */}
        <Route path="/app" element={<AppLayout area="client" />}>
          <Route index element={<Dashboard />} />
          <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="fornecedores/:id" element={<FornecedorDetalhes />} />
          <Route path="solicitacao" element={<NovaSolicitacao />} />
          <Route
            path="solicitacoes"
            element={<PlaceholderPage title="Minhas solicitações" />}
          />
          <Route
            path="pagamento"
            element={<PlaceholderPage title="Pagamento" />}
          />
          <Route path="assistente" element={<Assistente />} />
          <Route
            path="perfil"
            element={<PlaceholderPage title="Perfil" />}
          />
        </Route>

        {/* Área do fornecedor */}
        <Route path="/fornecedor" element={<AppLayout area="fornecedor" />}>
          <Route
            index
            element={<PlaceholderPage title="Dashboard do fornecedor" />}
          />
          <Route
            path="solicitacoes"
            element={<PlaceholderPage title="Solicitações recebidas" />}
          />
          <Route
            path="propostas"
            element={<PlaceholderPage title="Propostas enviadas" />}
          />
          <Route
            path="servicos"
            element={<PlaceholderPage title="Serviços cadastrados" />}
          />
          <Route
            path="perfil"
            element={<PlaceholderPage title="Perfil da empresa" />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
