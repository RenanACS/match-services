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
  appearance = "default",
  leftIcon,
  className = "",
  ...props
}) {
  const app = appearance === "app";
  return (
    <div className={`flex flex-col ${app ? "gap-1" : "gap-1.5"}`}>
      {label && (
        <label
          htmlFor={id}
          className={app ? "app-small font-medium text-cream/70" : "font-mono text-xs uppercase tracking-widest text-cream/70"}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className={`pointer-events-none absolute inset-y-0 flex items-center text-cream/70 ${app ? "left-3.5" : "left-4"}`}>
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`w-full rounded-xl border border-hairline bg-surface-1 pr-4 text-cream placeholder:text-cream/70 focus:border-orange focus:outline-none ${
            app
              ? `app-filter min-h-[40px] py-1.5 ${leftIcon ? "pl-10" : "pl-3.5"}`
              : `${leftIcon ? "pl-12" : "pl-4"} ${SIZES[fieldSize]}`
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
