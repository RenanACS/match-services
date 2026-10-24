function ArrowLeftIcon(props) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

/**
 * Botão "Voltar" discreto do cabeçalho da área do cliente. Puramente
 * apresentacional — a lógica de para onde voltar (histórico interno da
 * área do cliente) fica centralizada em AppLayout.jsx.
 *
 * Em telas pequenas o texto "Voltar" fica oculto e só o ícone aparece,
 * para não disputar espaço com o menu/marca no cabeçalho mobile.
 */
export default function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="app-breadcrumb flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-cream/70 transition hover:text-orange"
    >
      <ArrowLeftIcon />
      <span className="hidden sm:inline">Voltar</span>
    </button>
  );
}
