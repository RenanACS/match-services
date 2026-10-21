import Icon from "./AdminIcons";

// 1 2 3 4 5 … 33 / 1 … 4 5 6 … 33 / 1 … 29 30 31 32 33
function pageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "gap-end", totalPages];
  if (page >= totalPages - 3) return [1, "gap-start", ...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)];
  return [1, "gap-start", page - 1, page, page + 1, "gap-end", totalPages];
}

const BTN =
  "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 adm-text transition disabled:cursor-not-allowed disabled:opacity-40";

/** Rodapé de paginação: "Mostrando X a Y de N <item>" + páginas numeradas. */
export default function Pagination({ page, totalPages, total, start, pageSize, itemLabel = "itens", onPageChange }) {
  if (total === 0) return null;
  const first = start + 1;
  const last = Math.min(start + pageSize, total);
  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col gap-3 px-4 py-3 adm-text sm:flex-row sm:items-center sm:justify-between sm:px-6 xl:py-2.5"
    >
      <p className="text-cream/60">
        Mostrando {first} a {last} de {total} {itemLabel}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${BTN} border border-hairline text-cream hover:border-orange/60`}
        >
          <Icon name="chevronLeft" size={16} />
        </button>
        {pageItems(page, totalPages).map((item) =>
          typeof item === "string" ? (
            <span key={item} className="px-2 text-cream/40" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Página ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`${BTN} ${
                item === page ? "bg-orange font-medium text-ink" : "text-cream/70 hover:bg-surface-3 hover:text-cream"
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`${BTN} border border-hairline text-cream hover:border-orange/60`}
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </nav>
  );
}
