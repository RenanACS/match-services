import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar, { AdminNav, AdminAccountNav } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

/**
 * Layout independente da área administrativa (/admin/*). Não substitui nem
 * reaproveita o AppLayout do cliente/fornecedor.
 *
 * ATENÇÃO: ainda não há autenticação. Hoje o acesso é direto por /admin
 * (demonstração). A proteção por perfil administrativo será implementada
 * depois, no Django e no Front-End (ex.: guarda de rota que verifica o papel
 * "admin" retornado pela API). Login e Cadastro não redirecionam ao Admin.
 */
export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-bg text-cream">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onCloseMenu={closeMenu}
        />

        {menuOpen && (
          <div
            id="admin-mobile-menu"
            className="border-b border-hairline bg-surface-1 py-3 md:hidden"
          >
            <AdminNav onNavigate={closeMenu} />
            <div className="mt-3">
              <AdminAccountNav onNavigate={closeMenu} />
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
