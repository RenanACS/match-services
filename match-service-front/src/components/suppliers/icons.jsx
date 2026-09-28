// Ícone pequeno específico da tela de fornecedores (sem biblioteca de
// ícones), seguindo o mesmo padrão de src/components/dashboard/icons.jsx.
export function StarIcon({ className = "", ...props }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 2.5l2.9 6.2 6.8.7-5 4.7 1.4 6.8L12 17.6l-6.1 3.3 1.4-6.8-5-4.7 6.8-.7z" />
    </svg>
  );
}
