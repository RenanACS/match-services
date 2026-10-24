import { useId, useRef } from "react";
import Icon from "./AdminIcons";
import useDialogBehavior from "./suppliers/useDialogBehavior";

const TONES = {
  orange: "bg-orange-soft text-orange",
  red: "bg-red-600/25 text-red-400",
  green: "bg-emerald-500/20 text-emerald-400",
};

/**
 * Casca de modal do Admin (Esc fecha, foco preso, rolagem do fundo travada;
 * reutiliza useDialogBehavior). O conteúdo (formulário ou texto) vem em
 * `children`; `wide` aumenta a largura para leituras longas (`wide="lg"` ainda mais, para fluxos em etapas).
 */
export default function AdminDialog({ title, icon = "info", tone = "orange", description, onClose, wide = false, children }) {
  const titleId = useId();
  const containerRef = useRef(null);
  useDialogBehavior(onClose, containerRef);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className={`relative my-auto w-full ${wide === "lg" ? "max-w-2xl" : wide ? "max-w-xl" : "max-w-md"} rounded-[20px] border border-hairline bg-surface-1 p-6`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-cream/60 transition hover:text-cream"
        >
          <Icon name="close" size={18} />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TONES[tone]}`}>
            <Icon name={icon} size={20} />
          </span>
          <div className="min-w-0">
            <h2 id={titleId} className="adm-section-title text-cream">{title}</h2>
            {description && <p className="adm-text mt-1 text-cream/70">{description}</p>}
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/** Campo de texto longo com rótulo, contador de mínimo e mensagem de erro (para justificativas). */
export function DialogTextarea({ id, label, value, onChange, error, placeholder, rows = 3, required = false, textareaRef }) {
  return (
    <div>
      <label htmlFor={id} className="adm-text font-medium text-cream">
        {label}
        {required && <span className="text-orange"> *</span>}
      </label>
      <textarea
        id={id}
        ref={textareaRef}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="adm-text mt-1.5 w-full resize-none rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-cream placeholder:text-cream/40 focus:border-orange focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="adm-small mt-1 text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
