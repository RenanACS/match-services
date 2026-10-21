import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo-mark.png";
import { ADMIN_NAV } from "../../data/adminNav";
import Icon from "./AdminIcons";

const ITEM_BASE = "adm-menu flex w-full items-center gap-3 rounded-xl border-l-2 px-4 py-2.5 text-left transition";
const ITEM_IDLE = "border-transparent text-cream/70 hover:bg-surface-2 hover:text-cream";

function navLinkClass({ isActive }) {
  return `${ITEM_BASE} ${isActive ? "border-orange bg-orange-soft text-orange" : ITEM_IDLE}`;
}

export function AdminBrand({ onClick }) {
  return (
    <Link to="/admin" onClick={onClick} className="flex items-center gap-2">
      <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
      <span className="adm-menu hidden whitespace-nowrap font-display font-semibold sm:inline">MATCH SERVICES</span>
    </Link>
  );
}

/** "ADMINISTRAÇÃO" + os 8 itens principais (sidebar e menu mobile). */
export function AdminNav({ onNavigate }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="adm-eyebrow px-8 text-cream/45">Administração</p>
      <nav aria-label="Navegação do painel administrativo" className="flex flex-col gap-1 px-4">
        {ADMIN_NAV.map((item) => (
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
 * Perfil e Sair, separados do menu principal. "Perfil" abre /admin/perfil
 * (dados demonstrativos). AINDA NÃO HÁ autenticação real: "Sair" apenas leva
 * ao /login, sem encerrar nenhuma sessão. TODO: ligar ao Django (perfil do
 * administrador e logout real).
 */
export function AdminAccountNav({ onNavigate }) {
  return (
    <nav aria-label="Conta do administrador" className="flex flex-col gap-1 border-t border-hairline px-4 pt-3">
      <NavLink to="/admin/perfil" onClick={onNavigate} className={navLinkClass}>
        <Icon name="user" size={20} />
        Perfil
      </NavLink>
      <Link to="/login" onClick={onNavigate} className={`${ITEM_BASE} ${ITEM_IDLE}`}>
        <Icon name="logOut" size={20} />
        Sair
      </Link>
    </nav>
  );
}

/** Sidebar fixa do Admin (visível a partir de md): igual em todas as telas. */
export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-hairline bg-surface-1 md:sticky md:top-0 md:flex md:h-screen">
      <div className="px-8 py-6">
        <AdminBrand />
      </div>
      <AdminNav />
      <div className="mt-auto pb-4">
        <AdminAccountNav />
      </div>
    </aside>
  );
}
