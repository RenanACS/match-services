import { useEffect } from "react";
import Badge from "../ui/Badge";
import { REQUEST_STATUS } from "../../data/dashboard";
import { formatRequestDate } from "./RequestsList";

/**
 * Painel de detalhes da solicitação, em modal. Mostra só os campos já
 * disponíveis nos dados mockados (título, categoria, data, status) — sem
 * sugerir que existe mais informação persistida em algum backend.
 *
 * Trava o scroll da página de fundo enquanto está aberto (padrão comum de
 * modal, não um "overflow:hidden" para mascarar conteúdo cortado) e
 * restaura ao fechar.
 */
export default function RequestDetailsModal({ request, onClose }) {
  useEffect(() => {
    if (!request) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [request, onClose]);

  if (!request) return null;

  const status = REQUEST_STATUS[request.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-details-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[20px] border border-hairline bg-surface-1 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="request-details-title" className="app-section-title text-cream">
            {request.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-hairline text-cream/60 transition hover:border-orange/60 hover:text-orange"
          >
            ✕
          </button>
        </div>

        <dl className="mt-5 flex flex-col gap-4">
          <div>
            <dt className="app-small text-cream/45">Categoria</dt>
            <dd className="mt-1 app-text text-cream/80">{request.category}</dd>
          </div>
          <div>
            <dt className="app-small text-cream/45">Data da solicitação</dt>
            <dd className="mt-1 app-text text-cream/80">{formatRequestDate(request.date)}</dd>
          </div>
          <div>
            <dt className="app-small text-cream/45">Status</dt>
            <dd className="mt-1.5">
              <Badge variant={status.variant} appearance="app">{status.label}</Badge>
            </dd>
          </div>
        </dl>

        <p className="mt-6 app-small text-cream/40">
          Dados de demonstração. O acompanhamento completo da solicitação chega com a integração futura.
        </p>
      </div>
    </div>
  );
}
