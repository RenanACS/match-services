import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../context/auth/useAuth";
import { homeForRole } from "../../context/auth/authStore";

/**
 * Guarda de rota. Use como rota "layout" em volta das rotas protegidas:
 * <Route element={<ProtectedRoute role="fornecedor" />}>...</Route>
 *
 *  - Sem sessão: vai para /login (a menos que `allowAnonymous`).
 *  - Sessão de outro papel: vai para a área correta desse papel.
 * Sempre com `replace`, para o botão voltar não reabrir a tela bloqueada.
 *
 * `allowAnonymous` existe só para a área do cliente, que hoje abre sem login;
 * ela continua assim, mas passa a bloquear quem está logado como fornecedor.
 */
export default function ProtectedRoute({ role, allowAnonymous = false }) {
  const { session } = useAuth();

  if (!session) {
    return allowAnonymous ? <Outlet /> : <Navigate to="/login" replace />;
  }
  if (session.role !== role) {
    return <Navigate to={homeForRole(session.role)} replace />;
  }
  return <Outlet />;
}
