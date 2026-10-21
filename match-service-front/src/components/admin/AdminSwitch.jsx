/** Interruptor acessível (role="switch") para preferências demonstrativas. */
export default function AdminSwitch({ id, checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <label htmlFor={id} className="adm-text block cursor-pointer font-medium text-cream">{label}</label>
        {description && <p className="adm-small mt-0.5 text-cream/60">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition ${checked ? "border-orange bg-orange" : "border-hairline bg-surface-3"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
        <span className="sr-only">{checked ? "Ativado" : "Desativado"}</span>
      </button>
    </div>
  );
}
