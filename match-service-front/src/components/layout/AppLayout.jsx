import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../../assets/logo-mark.png";

const CLIENT_NAV = [
  { to: "/app", label: "Dashboard", end: true },
  { to: "/app/fornecedores", label: "Fornecedores" },
  { to: "/app/solicitacoes", label: "Solicitações" },
  { to: "/app/assistente", label: "Mia" },
  { to: "/app/pagamento", label: "Pagamento" },
];

const SUPPLIER_NAV = [
  { to: "/fornecedor", label: "Dashboard", end: true },
  { to: "/fornecedor/solicitacoes", label: "Solicitações recebidas" },
  { to: "/fornecedor/propostas", label: "Propostas" },
  { to: "/fornecedor/servicos", label: "Serviços" },
];

function navLinkClass({ isActive }) {
  return `block rounded-xl px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition ${
    isActive
      ? "bg-orange-soft text-orange"
      : "text-cream/60 hover:bg-surface-2 hover:text-cream"
  }`;
}

function Brand({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2">
      <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
      <span className="font-display text-sm font-semibold">MATCH SERVICES</span>
    </Link>
  );
}

// Navegação compartilhada entre a sidebar (desktop) e o menu recolhível (mobile).
function SidebarNav({ nav, perfilHref, onNavigate }) {
  return (
    <>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={navLinkClass}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-hairline p-3">
        <NavLink to={perfilHref} onClick={onNavigate} className={navLinkClass}>
          Perfil
        </NavLink>
        {/* Logout ainda sem função real — não há autenticação nesta etapa */}
        <button
          type="button"
          className="mt-1 w-full rounded-xl px-4 py-2.5 text-left font-mono text-xs uppercase tracking-widest text-cream/40 transition hover:bg-surface-2 hover:text-cream/70"
        >
          Sair
        </button>
      </div>
    </>
  );
}

/**
 * Layout compartilhado das áreas autenticadas (/app/* e /fornecedor/*).
 * Estrutura apenas visual por enquanto — sem autenticação real, sem
 * dados de usuário reais. `area` decide quais itens de navegação e qual
 * link de perfil aparecem. No mobile a sidebar vira um menu recolhível.
 */
export default function AppLayout({ area = "client" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = area === "fornecedor" ? SUPPLIER_NAV : CLIENT_NAV;
  const perfilHref = area === "fornecedor" ? "/fornecedor/perfil" : "/app/perfil";
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-bg text-cream">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-hairline bg-surface-1 md:flex">
        <div className="px-6 py-6">
          <Brand />
        </div>
        <SidebarNav nav={nav} perfilHref={perfilHref} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col xl:h-screen">
        <header className="flex shrink-0 items-center justify-between border-b border-hairline bg-surface-1/60 px-4 py-3 backdrop-blur sm:px-6 sm:py-4 xl:py-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline text-cream/70 hover:border-orange/60 hover:text-orange md:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
            <div className="md:hidden">
              <Brand onClick={closeMenu} />
            </div>
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-cream/50 md:inline">
              {area === "fornecedor" ? "Área do fornecedor" : "Área do cliente"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Notificações — placeholder visual, sem dados reais ainda */}
            <button
              type="button"
              aria-label="Notificações"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-cream/60 hover:border-orange/60 hover:text-orange"
            >
              <span aria-hidden="true">●</span>
            </button>
            <div className="h-9 w-9 rounded-full border border-hairline bg-surface-2" />
          </div>
        </header>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="flex flex-col border-b border-hairline bg-surface-1 py-3 md:hidden"
          >
            <SidebarNav nav={nav} perfilHref={perfilHref} onNavigate={closeMenu} />
          </div>
        )}

        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 xl:flex xl:flex-col xl:py-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
