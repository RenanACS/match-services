import { useEffect, useRef, useState } from "react";
import Button from "../../ui/Button";

const MIN_REASON = 10;

/**
 * Confirmação de bloqueio/desbloqueio (DEMONSTRATIVA). Bloqueio exige
 * justificativa. O aviso deixa claro que nada real é alterado: sem bloqueio
 * de autenticação e sem efeito em solicitações, contratos, pagamentos ou
 * repasses.
 */
export default function BlockClientDialog({ client, mode, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const fieldRef = useRef(null);
  const blocking = mode === "block";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    fieldRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    if (blocking) {
      const value = reason.trim();
      if (!value) return setError("Informe a justificativa do bloqueio.");
      if (value.length < MIN_REASON) return setError(`Descreva a justificativa com ao menos ${MIN_REASON} caracteres.`);
      onConfirm(value);
    } else {
      onConfirm("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-dialog-title"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md rounded-[20px] border border-hairline bg-surface-1 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="block-dialog-title" className="adm-section-title text-cream">
          {blocking ? "Bloquear conta" : "Desbloquear conta"}
        </h2>
        <p className="mt-2 adm-text text-cream/70">
          {blocking ? "Confirma o bloqueio da conta de " : "Confirma o desbloqueio da conta de "}
          <span className="font-medium text-cream">{client.name}</span>?
        </p>

        {blocking && (
          <div className="mt-4 flex flex-col gap-1.5">
            <label htmlFor="block-reason" className="adm-text text-cream/70">
              Justificativa (obrigatória)
            </label>
            <textarea
              id="block-reason"
              ref={fieldRef}
              rows={3}
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (error) setError("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "block-reason-error" : undefined}
              className="w-full rounded-xl border border-hairline bg-surface-2 px-4 py-3 adm-text text-cream placeholder:text-cream/35 focus:border-orange focus:outline-none"
              placeholder="Descreva o motivo do bloqueio"
            />
            {error && (
              <p id="block-reason-error" role="alert" className="adm-small text-red-400">
                {error}
              </p>
            )}
          </div>
        )}

        <p className="mt-4 rounded-xl border border-hairline bg-surface-2 px-4 py-3 adm-small leading-relaxed text-cream/60">
          Ação demonstrativa: não bloqueia a autenticação real. Solicitações, contratos, pagamentos e
          repasses existentes não são cancelados nem alterados.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {blocking ? "Confirmar bloqueio" : "Confirmar desbloqueio"}
          </Button>
        </div>
      </form>
    </div>
  );
}
