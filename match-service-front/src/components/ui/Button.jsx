const VARIANTS = {
  primary:
    "bg-orange text-ink hover:bg-orange/90 disabled:opacity-40 disabled:cursor-not-allowed",
  secondary:
    "border border-hairline text-cream hover:border-orange/60 disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "text-cream/70 hover:text-orange disabled:opacity-40 disabled:cursor-not-allowed",
};

const SIZES = {
  md: "min-h-[44px] px-5",
  lg: "min-h-[52px] px-6",
};

/**
 * Botão base do design system das telas internas.
 * Mantém a identidade da landing (font-mono, uppercase, tracking-widest)
 * mas com raio ~12px em vez de pill, conforme definido para o app.
 *
 * `as` permite renderizar como outro elemento (ex.: <Link>) para navegação,
 * evitando <button> dentro de <a>.
 */
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-mono text-xs font-medium uppercase tracking-widest transition ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
