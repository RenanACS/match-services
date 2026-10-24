import { Link, useLocation } from "react-router-dom";
import Icon from "../ui/Icon";
import { buildClientBreadcrumbs } from "../../utils/clientBreadcrumbs";

/** Breadcrumb clicável da área do cliente: itens anteriores à página atual são links. */
export default function ClientBreadcrumbs({ className = "" }) {
  const { pathname } = useLocation();
  const crumbs = buildClientBreadcrumbs(pathname);
  return (
    <nav aria-label="Você está em" className={className}>
      <ol className="app-breadcrumb flex min-w-0 items-center gap-2">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={`${index}-${crumb.label}`} className="flex min-w-0 items-center gap-2">
              {index > 0 && <Icon name="chevronRight" size={14} className="text-cream/40" />}
              {last || !crumb.to ? (
                <span aria-current={last ? "page" : undefined} className={`truncate ${last && crumbs.length > 1 ? "font-medium text-cream" : "text-cream/60"}`}>
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className="whitespace-nowrap text-cream/60 transition hover:text-orange">
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
