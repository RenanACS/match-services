const SIZES = {
  md: "min-h-[44px] py-3 text-sm",
  lg: "min-h-[56px] py-4 text-base",
};

/**
 * Input de texto padrão das telas internas. Usa os mesmos tokens visuais
 * (borda hairline, foco laranja, raio ~12px) já usados nos formulários
 * de demo da landing (DiagnosisDemo/DemandForm).
 *
 * `fieldSize` ("md" | "lg") e `leftIcon` (ReactNode) são opcionais e não
 * alteram o uso existente em Login/Cadastro.
 */
export default function Input({
  label,
  id,
  fieldSize = "md",
  leftIcon,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-[11px] uppercase tracking-widest text-cream/60"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-cream/40">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`w-full rounded-xl border border-hairline bg-surface-1 pr-4 text-cream placeholder:text-cream/35 focus:border-orange focus:outline-none ${
            leftIcon ? "pl-12" : "pl-4"
          } ${SIZES[fieldSize]} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
