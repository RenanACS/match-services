import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo-mark.png";
import { CLIENT_NAV } from "../../data/clientNav";
import Icon from "../ui/Icon";

const ITEM_BASE = "app-menu flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition";
const ITEM_IDLE = "text-cream/70 hover:bg-surface-2 hover:text-cream";

function navLinkClass({ isActive }) {
  return `${ITEM_BASE} ${isActive ? "bg-orange-soft text-orange" : ITEM_IDLE}`;
}

export function ClientBrand({ onClick }) {
  return (
    <Link to="/app" onClick={onClick} className="flex items-center gap-2">
      <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
      <span className="app-menu hidden whitespace-nowrap font-display font-semibold sm:inline">MATCH SERVICES</span>
    </Link>
  );
}

/** "CLIENTE" + os itens principais (sidebar e menu mobile). */
export function ClientNav({ onNavigate }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="app-eyebrow px-8 text-cream/70">Cliente</p>
      <nav aria-label="Navegação da área do cliente" className="flex flex-col gap-1 px-4">
        {CLIENT_NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={navLinkClass}>
            <Icon name={item.icon} size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

/**
 * Perfil e Sair, separados do menu principal. AINDA NÃO HÁ autenticação: o
 * "Sair" mantém o comportamento que já existia (nenhuma ação) para não
 * simular um logout real. TODO: ligar ao logout real quando houver login.
 */
export function ClientAccountNav({ onNavigate }) {
  return (
    <nav aria-label="Conta do cliente" className="flex flex-col gap-1 border-t border-hairline px-4 pt-3">
      <NavLink to="/app/perfil" onClick={onNavigate} className={navLinkClass}>
        <Icon name="user" size={20} />
        Perfil
      </NavLink>
      <button type="button" onClick={onNavigate} className={`${ITEM_BASE} ${ITEM_IDLE}`}>
        <Icon name="logOut" size={20} />
        Sair
      </button>
    </nav>
  );
}

/** Sidebar fixa do cliente (visível a partir de md), no mesmo padrão do Admin. */
export default function ClientSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-hairline bg-surface-1 md:sticky md:top-0 md:flex md:h-screen">
      <div className="px-8 py-6">
        <ClientBrand />
      </div>
      <ClientNav />
      <div className="mt-auto pb-4">
        <ClientAccountNav />
      </div>
    </aside>
  );
}
