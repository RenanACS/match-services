import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

/**
 * Acesso compacto e discreto à Mia, a assistente de IA do Match Services.
 * Só navega para /app/assistente — nenhuma chamada ao modelo acontece aqui.
 */
export default function AssistantPromo() {
  return (
    <Link
      to="/app/assistente"
      aria-label="Mia — assistente do Match Services. Não sabe qual serviço precisa? Pergunte à Mia."
      className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-2 px-4 py-2.5 transition hover:border-orange/40 sm:gap-4 sm:px-5"
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-soft text-orange-light"
      >
        <Icon name="sparkles" size={16} />
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
        <span className="app-text font-semibold text-orange-light">Mia</span>
        <span className="app-text truncate text-cream/70">Não sabe qual serviço precisa? Pergunte à Mia.</span>
      </span>
      <span aria-hidden="true" className="app-text inline-flex shrink-0 items-center gap-1.5 text-cream/60">
        Perguntar à Mia
        <Icon name="arrowRight" size={14} />
      </span>
    </Link>
  );
}
