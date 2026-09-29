/**
 * Seleção exclusiva de tipo de acesso (Cliente / Fornecedor), usada em
 * Login e Cadastro para evitar duplicar o mesmo padrão visual nas duas
 * telas. Não é um <select> — são dois controles clicáveis, só um ativo
 * por vez, com destaque em laranja (#FE5200 via token `orange`).
 */
export default function RoleToggle({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`min-h-[44px] rounded-xl border px-3 font-mono text-xs font-medium uppercase tracking-widest transition xl:min-h-[38px] ${
              active
                ? "border-orange bg-orange-soft text-orange"
                : "border-hairline text-cream/60 hover:text-cream"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
