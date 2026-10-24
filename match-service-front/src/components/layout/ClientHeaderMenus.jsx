import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import useClientProfile from "../../context/useClientProfile";
import { mockUser } from "../../data/dashboard";
import { getShortName } from "../../utils/displayName";
import { getInitials } from "../perfil/profileUtils";
import { listNotifications } from "../../services/clientNotifications";

const TRIGGER =
  "flex items-center rounded-xl border bg-transparent text-cream/80 transition hover:border-orange/60 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/60";
const PANEL =
  "absolute right-0 top-full z-50 mt-2 rounded-xl border border-hairline bg-surface-1 shadow-xl shadow-black/40";

/**
 * Sino de notificações + menu do perfil do cliente. Só um dropdown fica aberto
 * por vez; fecham com clique fora, Esc ou ao escolher uma opção. Os painéis
 * são posicionados de forma absoluta (não são cortados pelo cabeçalho).
 */
export default function ClientHeaderMenus() {
  const { profile } = useClientProfile();
  const displayName = (profile && getShortName(profile.name, profile.personType)) || mockUser.name;
  const initials = profile?.name ? getInitials(profile.name) : getInitials(displayName);
  const [open, setOpen] = useState(null); // null | "notifications" | "profile"
  const rootRef = useRef(null);
  const notifications = listNotifications();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(null);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(null);
        rootRef.current?.querySelector(`[data-menu="${open}"]`)?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (name) => setOpen((current) => (current === name ? null : name));

  return (
    <div ref={rootRef} className="flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          data-menu="notifications"
          aria-label="Notificações"
          aria-haspopup="true"
          aria-expanded={open === "notifications"}
          onClick={() => toggle("notifications")}
          className={`${TRIGGER} h-9 w-9 justify-center ${open === "notifications" ? "border-orange text-orange" : "border-hairline"}`}
        >
          <Icon name="bell" size={18} />
        </button>
        {open === "notifications" && (
          <div role="region" aria-label="Notificações" className={`${PANEL} w-64 sm:w-72`}>
            <p className="app-text border-b border-hairline px-4 py-2.5 font-medium text-cream">Notificações</p>
            {notifications.length === 0 ? (
              <p className="app-text px-4 py-6 text-center text-cream/70">Nenhuma notificação por enquanto.</p>
            ) : (
              <ul className="max-h-72 divide-y divide-hairline overflow-y-auto">
                {notifications.map((item) => (
                  <li key={item.id} className="app-text px-4 py-2.5 text-cream/80">
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          data-menu="profile"
          aria-label="Menu do perfil"
          aria-haspopup="true"
          aria-expanded={open === "profile"}
          onClick={() => toggle("profile")}
          className={`${TRIGGER} h-9 gap-2.5 px-2 ${open === "profile" ? "border-orange" : "border-transparent"}`}
        >
          <span className="app-text flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3 font-medium text-cream">
            {initials}
          </span>
          <span className="app-header hidden max-w-[10rem] truncate text-cream/80 sm:inline">{displayName}</span>
          <Icon name="chevronDown" size={16} className={`text-cream/70 transition ${open === "profile" ? "rotate-180" : ""}`} />
        </button>
        {open === "profile" && (
          <div role="menu" aria-label="Perfil" className={`${PANEL} w-44 p-1.5`}>
            <Link
              to="/app/perfil"
              role="menuitem"
              onClick={() => setOpen(null)}
              className="app-text flex items-center gap-2.5 rounded-lg px-3 py-2 text-cream/80 transition hover:bg-surface-2 hover:text-cream"
            >
              <Icon name="user" size={16} />
              Perfil
            </Link>
            {/* Sem autenticação real: "Sair" mantém o comportamento existente (nenhuma ação). */}
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(null)}
              className="app-text flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-cream/80 transition hover:bg-surface-2 hover:text-cream"
            >
              <Icon name="logOut" size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
