import { useId, useRef } from "react";
import Icon from "../AdminIcons";
import useDialogBehavior from "./useDialogBehavior";
import { formatDateTime } from "../../../utils/dates";

/** Consulta (somente leitura) do motivo da rejeição de um cadastro. */
export default function SupplierReasonDialog({ supplier, onClose }) {
  const titleId = useId();
  const containerRef = useRef(null);
  useDialogBehavior(onClose, containerRef);
  const entry = [...supplier.history].reverse().find((item) => item.action === "rejected");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-md rounded-[20px] border border-hairline bg-surface-1 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-cream/70 transition hover:text-cream"
        >
          <Icon name="close" size={18} />
        </button>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/25 text-red-400">
            <Icon name="info" size={26} />
          </span>
          <h2 id={titleId} className="mt-4 adm-section-title text-cream">
            Motivo da rejeição
          </h2>
          <p className="mt-1.5 adm-text text-cream/70">{supplier.name}</p>
        </div>
        <p className="mt-5 rounded-xl border border-hairline bg-surface-2 px-4 py-3 adm-text leading-relaxed text-cream/90">
          {entry?.reason || "Nenhum motivo foi registrado."}
        </p>
        {entry && (
          <p className="mt-2 adm-small text-cream/70">
            Registrado em {formatDateTime(entry.date)} por {entry.by}.
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 min-h-[44px] w-full rounded-xl border border-hairline bg-ink adm-text font-medium text-cream transition hover:border-orange/60"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
