import { Link } from "react-router-dom";
import Icon from "../AdminIcons";
import { formatBRL } from "../../../utils/currency";

/** Círculo cinza com as iniciais (cliente/fornecedor), como no protótipo. */
export function PartyAvatar({ name, size = "md" }) {
  const initials = name
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const box = size === "lg" ? "h-16 w-16 adm-section-title" : "h-9 w-9 adm-small";
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-500/70 font-medium text-white ${box}`}>
      {initials}
    </span>
  );
}

/** Nome + "Cidade - UF" com avatar (colunas Cliente e Fornecedor). */
export function PartyCell({ name, city, state }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <PartyAvatar name={name} />
      <div className="min-w-0">
        <p title={name} className="adm-table truncate font-medium text-cream">{name}</p>
        <p className="adm-small truncate text-cream/70">{city} - {state}</p>
      </div>
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
export const dateOf = (iso) => dateFmt.format(new Date(iso));
export const timeOf = (iso) => timeFmt.format(new Date(iso));

/** Data em cima e horário embaixo. */
export function DateTimeCell({ iso }) {
  return (
    <div>
      <p className="adm-table text-cream">{dateOf(iso)}</p>
      <p className="adm-small text-cream/70">{timeOf(iso)}</p>
    </div>
  );
}

export const money = (cents) => formatBRL(cents);

/** Somente o ícone de olho (sem menu de três pontinhos). */
export function ViewLink({ request, state }) {
  return (
    <Link
      to={`/admin/solicitacoes/${request.id}`}
      state={state}
      aria-label={`Ver detalhes da solicitação #${request.id}`}
      title="Ver detalhes"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-cream/80 transition hover:border-orange/60 hover:text-cream"
    >
      <Icon name="eye" size={18} />
    </Link>
  );
}
