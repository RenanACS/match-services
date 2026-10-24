import { AdminBrand } from "./AdminSidebar";
import AdminBreadcrumbs from "./AdminBreadcrumbs";
import AdminHeaderMenus from "./AdminHeaderMenus";

/**
 * Cabeçalho do Admin: breadcrumb clicável (compartilhado) e, à direita, o sino
 * de notificações e o menu do perfil (AdminHeaderMenus). Não há autenticação
 * real nesta etapa. No celular o breadcrumb passa para uma segunda linha.
 */
export default function AdminHeader({ menuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className="adm-header relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-hairline bg-surface-1/60 px-4 py-2.5 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-3 md:hidden">
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-menu"
          onClick={onToggleMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline text-cream/70 hover:border-orange/60 hover:text-orange"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <AdminBrand onClick={onCloseMenu} />
      </div>

      <AdminBreadcrumbs className="order-last w-full min-w-0 md:order-first md:w-auto" />

      <div className="flex shrink-0 items-center">
        <AdminHeaderMenus />
      </div>
    </header>
  );
}
