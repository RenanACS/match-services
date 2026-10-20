import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { buildCrumbs } from "../../../utils/breadcrumb";
import { SUPPLIER_ROUTE_LABELS } from "../../../data/fornecedor";
import { ChevronRightIcon } from "../icons";

// Segmentos sem nome fixo. `rest` são os segmentos depois de /fornecedor.
//   solicitacoes/2847         -> "Solicitação #2847"
//   propostas/nova | /301     -> "Nova proposta" | "Proposta #301"
//   servicos/novo             -> "Novo serviço"
//   servicos/7/editar         -> "Editar serviço" (o id 7 não vira nível)
//   propostas/301/editar      -> "Editar proposta"
function dynamicLabel(segment, rest, index) {
  const section = rest[0];
  if (index === 1) {
    if (section === "solicitacoes") return `Solicitação #${segment}`;
    if (section === "propostas") return segment === "nova" ? "Nova proposta" : `Proposta #${segment}`;
    if (section === "servicos" && segment === "novo") return "Novo serviço";
  }
  if (index === 2 && segment === "editar") {
    return section === "servicos" ? "Editar serviço" : "Editar proposta";
  }
  return null;
}

/**
 * Trilha de navegação da área do fornecedor. Descobre a rota atual com o
 * react-router (useLocation); cada nível, menos o atual, é um link.
 * Em telas pequenas a trilha rola na horizontal (sem quebrar o layout) e
 * o nível atual é sempre mantido visível.
 */
export default function Breadcrumb() {
  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  const crumbs = buildCrumbs({
    pathname,
    basePath: "/fornecedor",
    rootLabel: "Painel do fornecedor",
    labels: SUPPLIER_ROUTE_LABELS,
    dynamicLabel,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [pathname]);

  return (
    <nav
      aria-label="Trilha de navegação"
      ref={scrollRef}
      className="min-w-0 overflow-x-auto rounded-xl border border-hairline bg-surface-1 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="flex w-max items-center gap-1.5 font-display text-sm sm:text-base">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.to} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRightIcon width={14} height={14} className="text-cream/30" />}
              {isLast ? (
                <span aria-current="page" className="whitespace-nowrap font-medium text-cream">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="whitespace-nowrap text-cream/55 transition hover:text-orange"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
