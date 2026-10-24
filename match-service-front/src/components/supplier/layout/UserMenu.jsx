import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useDismiss from "./useDismiss";
import { getInitials } from "../../../utils/supplierFormat";
import { ChevronDownIcon, LogoutIcon, UserIcon } from "../icons";

/**
 * Menu do usuário (canto superior direito): avatar + nome, com Perfil e
 * Sair. Fecha ao clicar fora, ao apertar Esc e ao escolher um item.
 */
export default function UserMenu({ name, onLogout }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useDismiss(rootRef, open, () => setOpen(false));

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-cream/75 transition hover:bg-surface-3 hover:text-cream";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface-1 py-1.5 pl-1.5 pr-3 transition hover:border-orange/60"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 font-mono text-xs text-cream">
          {getInitials(name)}
        </span>
        <span className="hidden max-w-[10rem] truncate font-display text-sm sm:inline">{name}</span>
        <ChevronDownIcon width={16} height={16} className="text-cream/50" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-hairline bg-surface-2 p-1.5 shadow-lg"
        >
          <Link role="menuitem" to="/fornecedor/perfil" onClick={() => setOpen(false)} className={itemClass}>
            <UserIcon width={16} height={16} />
            Perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className={itemClass}
          >
            <LogoutIcon width={16} height={16} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
