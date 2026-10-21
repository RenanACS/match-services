import { Link, useLocation } from "react-router-dom";
import Icon from "./AdminIcons";
import { buildAdminBreadcrumbs } from "../../utils/adminBreadcrumbs";

/** Breadcrumb clicável compartilhado: os itens anteriores à página atual são links. */
export default function AdminBreadcrumbs({ className = "" }) {
  const { pathname, state } = useLocation();
  const crumbs = buildAdminBreadcrumbs(pathname, state);
  return (
    <nav aria-label="Você está em" className={className}>
      <ol className="adm-breadcrumb flex min-w-0 items-center gap-2">
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
