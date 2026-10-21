import { ClientBrand } from "./ClientSidebar";
import ClientBreadcrumbs from "./ClientBreadcrumbs";
import ClientHeaderMenus from "./ClientHeaderMenus";
import BackButton from "./BackButton";

/**
 * Cabeçalho do cliente (mesmo padrão do Admin): breadcrumb clicável e, à
 * direita, sino de notificações e menu do perfil. Mantém o botão "Voltar"
 * (histórico interno da área do cliente). No celular o breadcrumb passa para
 * uma segunda linha.
 */
export default function ClientHeader({ menuOpen, onToggleMenu, onCloseMenu, showBackButton, onBack }) {
  return (
    <header className="app-header relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-hairline bg-surface-1/60 px-4 py-2.5 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-3 md:hidden">
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={onToggleMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline text-cream/70 hover:border-orange/60 hover:text-orange"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <ClientBrand onClick={onCloseMenu} />
      </div>

      <div className="order-last flex w-full min-w-0 items-center gap-3 md:order-first md:w-auto">
        {showBackButton && (
          <>
            <BackButton onClick={onBack} />
            <span className="h-4 w-px bg-hairline" aria-hidden="true" />
          </>
        )}
        <ClientBreadcrumbs className="min-w-0" />
      </div>

      <div className="flex shrink-0 items-center">
        <ClientHeaderMenus />
      </div>
    </header>
  );
}
