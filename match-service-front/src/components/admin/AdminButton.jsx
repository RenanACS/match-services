const VARIANTS = {
  primary: "border border-orange bg-orange text-ink hover:bg-orange-light",
  secondary: "border border-hairline bg-transparent text-cream hover:border-orange/60",
  danger: "border border-red-500/60 text-red-400 hover:bg-red-500/10",
  success: "border border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10",
};

/**
 * Botão padrão do Admin: Inter 13px (adm-button), sem caixa alta. O Button de
 * src/components/ui continua sendo o das áreas do cliente/fornecedor.
 * `as` permite renderizar como <Link>.
 */
export default function AdminButton({ as: Component = "button", variant = "primary", className = "", children, ...props }) {
  return (
    <Component
      className={`adm-button inline-flex min-h-[40px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 transition disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
