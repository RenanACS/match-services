import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo-mark.png";
import { HomeIcon, InboxIcon, LogoutIcon, SendIcon, StarIcon, UserIcon, WalletIcon, WrenchIcon } from "../icons";

const NAV = [
  { to: "/fornecedor", label: "Dashboard", icon: HomeIcon, end: true },
  { to: "/fornecedor/solicitacoes", label: "Solicitações", icon: InboxIcon },
  { to: "/fornecedor/propostas", label: "Propostas", icon: SendIcon },
  { to: "/fornecedor/servicos", label: "Serviços", icon: WrenchIcon },
  { to: "/fornecedor/avaliacoes", label: "Avaliações", icon: StarIcon },
  { to: "/fornecedor/pagamentos", label: "Pagamentos", icon: WalletIcon },
];

// Item ativo: fundo laranja suave e texto laranja (igual ao cliente e ao admin).
function itemClass({ isActive }) {
  return `flex items-center gap-3 rounded-xl px-4 py-2.5 app-menu transition ${
    isActive
      ? "bg-orange-soft text-orange"
      : "text-cream/70 hover:bg-surface-2 hover:text-cream"
  }`;
}

/**
 * Conteúdo da sidebar do fornecedor. É renderizado fixo em telas grandes e
 * dentro da gaveta recolhível em telas pequenas (ver SupplierLayout).
 */
export default function SupplierSidebar({ onNavigate, onLogout }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2">
          <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
          <span className="whitespace-nowrap font-display app-text font-semibold">MATCH SERVICES</span>
        </Link>
      </div>

      <p className="px-6 pb-2 app-small font-medium text-cream/70">
        Fornecedor
      </p>
      <nav aria-label="Menu do fornecedor" className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={itemClass}>
            <Icon width={20} height={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-hairline p-3">
        <NavLink to="/fornecedor/perfil" onClick={onNavigate} className={itemClass}>
          <UserIcon width={20} height={20} />
          Perfil
        </NavLink>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left app-text text-cream/70 transition hover:bg-surface-2 hover:text-cream"
        >
          <LogoutIcon width={20} height={20} />
          Sair
        </button>
      </div>
    </div>
  );
}
