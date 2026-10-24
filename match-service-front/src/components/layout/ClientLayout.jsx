import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ClientSidebar, { ClientNav, ClientAccountNav } from "./ClientSidebar";
import ClientHeader from "./ClientHeader";

/**
 * Layout da área do cliente (/app/*), no mesmo padrão visual do painel
 * administrativo (sidebar, cabeçalho com breadcrumbs, sino e menu do perfil).
 * Independente do SupplierLayout (área do fornecedor). Sem autenticação real
 * nesta etapa.
 */
export default function ClientLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Histórico interno, só da área do cliente — não é o histórico do navegador.
  // Guarda as rotas de /app/* visitadas nesta sessão do layout (ele é
  // remontado ao sair da área do cliente, então a pilha nunca carrega uma
  // rota externa ou da área do fornecedor).
  const clientHistoryRef = useRef([]);

  useEffect(() => {
    const stack = clientHistoryRef.current;
    if (stack[stack.length - 1] !== location.pathname) stack.push(location.pathname);
  }, [location.pathname]);

  function handleBack() {
    const stack = clientHistoryRef.current;
    if (stack.length >= 2) {
      stack.pop();
      navigate(stack[stack.length - 1]);
    } else {
      // Sem histórico interno válido (acesso direto): destino seguro é o Dashboard.
      stack.length = 0;
      navigate("/app");
    }
  }

  return (
    <div className="flex min-h-screen bg-bg text-cream">
      <ClientSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <ClientHeader
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onCloseMenu={closeMenu}
          showBackButton={location.pathname !== "/app"}
          onBack={handleBack}
        />

        {menuOpen && (
          <div id="mobile-menu" className="border-b border-hairline bg-surface-1 py-3 md:hidden">
            <ClientNav onNavigate={closeMenu} />
            <div className="mt-3">
              <ClientAccountNav onNavigate={closeMenu} />
            </div>
          </div>
        )}

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 xl:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
