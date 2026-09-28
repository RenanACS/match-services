import { Link } from "react-router-dom";

/**
 * Acesso compacto e discreto à Mia, a assistente de IA do Match Services.
 * Só navega para /app/assistente — nenhuma chamada ao modelo acontece aqui.
 * A IA é uma funcionalidade secundária: este bloco fica abaixo de
 * "Solicitações recentes" e não deve competir em destaque com o hub de
 * fornecedores, que é o foco principal do produto.
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
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-soft text-sm text-orange-light"
      >
        ✦
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-orange-light">
          Mia
        </span>
        <span className="truncate text-sm text-cream/70">
          Não sabe qual serviço precisa? Pergunte à Mia.
        </span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-cream/60"
      >
        Perguntar à Mia →
      </span>
    </Link>
  );
}
