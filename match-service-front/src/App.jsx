
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import NotFound from "./pages/NotFound";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SupplierLayout from "./components/supplier/layout/SupplierLayout";

// Páginas do cliente
import Dashboard from "./pages/client/Dashboard";
import Fornecedores from "./pages/client/Fornecedores";
import FornecedorDetalhes from "./pages/client/FornecedorDetalhes";
import NovaSolicitacao from "./pages/client/NovaSolicitacao";
import Solicitacoes from "./pages/client/Solicitacoes";
import Pagamento from "./pages/client/Pagamento";
import Perfil from "./pages/client/Perfil";
import Assistente from "./pages/client/Assistente";

// Páginas do fornecedor
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierRequests from "./pages/supplier/Solicitacoes";
import SupplierRequestDetails from "./pages/supplier/SolicitacaoDetalhes";
import SupplierProposals from "./pages/supplier/Propostas";
import SupplierProposalDetails from "./pages/supplier/PropostaDetalhes";
import SupplierProposalForm from "./pages/supplier/PropostaForm";
import SupplierServices from "./pages/supplier/Servicos";
import SupplierServiceForm from "./pages/supplier/ServicoForm";
import SupplierReviews from "./pages/supplier/Avaliacoes";
import SupplierPayments from "./pages/supplier/Pagamentos";
import SupplierProfile from "./pages/supplier/Perfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Área do cliente (abre sem login como antes; bloqueia só quem está logado como fornecedor) */}
        <Route element={<ProtectedRoute role="cliente" allowAnonymous />}>
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

        </Route>

        {/* Área do fornecedor — exige sessão de fornecedor */}
        <Route element={<ProtectedRoute role="fornecedor" />}>
        <Route
          path="/fornecedor"
          element={<SupplierLayout />}
        >
          <Route index element={<SupplierDashboard />} />

          <Route path="solicitacoes" element={<SupplierRequests />} />
          <Route path="solicitacoes/:id" element={<SupplierRequestDetails />} />

          <Route path="propostas" element={<SupplierProposals />} />
          <Route path="propostas/nova" element={<SupplierProposalForm />} />
          <Route path="propostas/:id" element={<SupplierProposalDetails />} />
          <Route path="propostas/:id/editar" element={<SupplierProposalForm />} />

          <Route path="servicos" element={<SupplierServices />} />
          <Route path="servicos/novo" element={<SupplierServiceForm />} />
          <Route path="servicos/:id/editar" element={<SupplierServiceForm />} />

          <Route path="avaliacoes" element={<SupplierReviews />} />
          <Route path="pagamentos" element={<SupplierPayments />} />
          <Route path="perfil" element={<SupplierProfile />} />
        </Route>

        </Route>

        {/* Página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
