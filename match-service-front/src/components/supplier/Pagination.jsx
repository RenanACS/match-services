/** Rodapé de tabela: "Mostrando 1 a 8 de 14 ..." e botões de página. */
export default function Pagination({ page, pages, pageSize, total, noun, onPageChange }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  const buttonClass =
    "flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 app-text transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-hairline px-5 py-4 app-text text-cream/70 sm:flex-row sm:px-6">
      <p>
        Mostrando {start} a {end} de {total} {noun}
      </p>
      <nav aria-label="Paginação" className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${buttonClass} border-hairline hover:border-orange/60`}
        >
          ‹
        </button>
        {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            type="button"
            aria-current={number === page ? "page" : undefined}
            onClick={() => onPageChange(number)}
            className={`${buttonClass} ${
              number === page
                ? "border-orange bg-orange text-ink"
                : "border-hairline hover:border-orange/60"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          aria-label="Próxima página"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className={`${buttonClass} border-hairline hover:border-orange/60`}
        >
          ›
        </button>
      </nav>
    </div>
  );
}
