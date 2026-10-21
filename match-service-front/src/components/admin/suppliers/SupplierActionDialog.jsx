import { useId, useRef, useState } from "react";
import Icon from "../AdminIcons";
import useDialogBehavior from "./useDialogBehavior";

const MIN_REASON = 10;

const MODES = {
  approve: {
    icon: "check",
    circle: "bg-emerald-600/25 text-emerald-400",
    title: "Aprovar cadastro",
    text: (name) => `Confirme a aprovação do cadastro de ${name}.`,
    label: "Mensagem opcional para o fornecedor",
    placeholder: "Escreva uma mensagem (opcional)…",
    required: false,
    confirm: "Aprovar cadastro",
    confirmClass: "bg-orange text-ink hover:bg-orange-light",
    note: "Ação demonstrativa: a mensagem fica registrada no histórico e nenhum e-mail é enviado.",
  },
  reject: {
    icon: "close",
    circle: "bg-red-600/25 text-red-400",
    title: "Rejeitar cadastro",
    text: (name) => `Informe o motivo da rejeição do cadastro de ${name}.`,
    label: "Motivo da rejeição",
    placeholder: "Descreva o motivo da rejeição…",
    required: true,
    errorEmpty: "Informe o motivo da rejeição.",
    confirm: "Rejeitar cadastro",
    confirmClass: "bg-red-600 text-white hover:bg-red-500",
    note: "Ação demonstrativa: o motivo fica registrado no histórico e nenhum e-mail é enviado.",
  },
  block: {
    icon: "lock",
    circle: "bg-red-600/25 text-red-400",
    title: "Bloquear fornecedor",
    text: (name) => `Informe o motivo do bloqueio de ${name}.`,
    label: "Motivo do bloqueio",
    placeholder: "Descreva o motivo do bloqueio…",
    required: true,
    errorEmpty: "Informe o motivo do bloqueio.",
    confirm: "Bloquear fornecedor",
    confirmClass: "bg-red-600 text-white hover:bg-red-500",
    note: "O bloqueio impede novas contratações, mas não cancela serviços já contratados, pagamentos ou obrigações existentes. Ação demonstrativa: nenhum e-mail é enviado.",
  },
  unblock: {
    icon: "unlock",
    circle: "bg-emerald-600/25 text-emerald-400",
    title: "Desbloquear fornecedor",
    text: (name) => `Deseja desbloquear ${name}?`,
    label: "Mensagem opcional",
    placeholder: "Adicione uma mensagem (opcional)…",
    required: false,
    confirm: "Desbloquear fornecedor",
    confirmClass: "bg-emerald-600 text-white hover:bg-emerald-500",
    note: "Ação demonstrativa: a mensagem fica registrada no histórico e nenhum e-mail é enviado.",
  },
};

/**
 * Modal de decisão administrativa sobre a página atual (sem rota própria).
 * Modos: approve | reject | block | unblock. Rejeitar e bloquear exigem
 * justificativa; aprovar e desbloquear têm mensagem opcional.
 */
export default function SupplierActionDialog({ supplier, mode, onConfirm, onClose }) {
  const config = MODES[mode];
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const titleId = useId();
  const fieldId = useId();
  const errorId = useId();
  const containerRef = useRef(null);
  const fieldRef = useRef(null);
  useDialogBehavior(onClose, containerRef, fieldRef);

  function handleSubmit(event) {
    event.preventDefault();
    const value = text.trim();
    if (config.required) {
      if (!value) return setError(config.errorEmpty);
      if (value.length < MIN_REASON) return setError(`Descreva o motivo com ao menos ${MIN_REASON} caracteres.`);
    }
    onConfirm(value);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <form
        ref={containerRef}
        onSubmit={handleSubmit}
        noValidate
        className="relative w-full max-w-md rounded-[20px] border border-hairline bg-surface-1 p-6"
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

        <div className="flex flex-col items-center text-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full ${config.circle}`}>
            <Icon name={config.icon} size={26} />
          </span>
          <h2 id={titleId} className="mt-4 adm-section-title text-cream">
            {config.title}
          </h2>
          <p className="mt-1.5 adm-text text-cream/70">{config.text(supplier.name)}</p>
        </div>

        <div className="mt-5 flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="adm-text font-medium text-cream/80">
            {config.label}
            {config.required && <span className="ml-1 text-orange" aria-hidden="true">*</span>}
          </label>
          <textarea
            id={fieldId}
            ref={fieldRef}
            rows={3}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (error) setError("");
            }}
            aria-required={config.required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={config.placeholder}
            className="w-full resize-none rounded-xl border border-hairline bg-surface-2 px-4 py-3 adm-text text-cream placeholder:text-cream/35 focus:border-orange focus:outline-none"
          />
          {error && (
            <p id={errorId} role="alert" className="adm-small text-red-400">
              {error}
            </p>
          )}
        </div>

        <p className="mt-3 adm-small leading-relaxed text-cream/50">{config.note}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-xl border border-hairline bg-ink adm-text font-medium text-cream transition hover:border-orange/60"
          >
            Cancelar
          </button>
          <button type="submit" className={`min-h-[44px] rounded-xl adm-text font-medium transition ${config.confirmClass}`}>
            {config.confirm}
          </button>
        </div>
      </form>
    </div>
  );
}
