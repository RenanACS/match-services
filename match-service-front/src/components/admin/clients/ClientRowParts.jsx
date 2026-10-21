import { Link } from "react-router-dom";
import Icon from "../AdminIcons";

/** Círculo com ícone de pessoa (PF) ou empresa (PJ). */
export function ClientAvatar({ type, size = "md" }) {
  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10 xl:h-9 xl:w-9";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-surface-3 text-cream/70 ${box}`}>
      <Icon name={type === "PJ" ? "building" : "user"} size={18} />
    </span>
  );
}

export function DetailsLink({ client, state, className = "" }) {
  return (
    <Link
      to={`/admin/clientes/${client.id}`}
      state={state}
      className={`inline-flex items-center gap-1 adm-text font-medium text-orange transition hover:text-orange-light ${className}`}
    >
      Detalhes
      <Icon name="chevronRight" size={14} />
    </Link>
  );
}

/** Ação direta Bloquear/Desbloquear — discreta, mas legível e clicável. */
export function BlockAction({ client, onToggleBlock, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onToggleBlock(client)}
      className={`adm-text text-cream/60 underline-offset-4 transition hover:text-cream hover:underline ${className}`}
    >
      {client.status === "blocked" ? "Desbloquear" : "Bloquear"}
    </button>
  );
}
