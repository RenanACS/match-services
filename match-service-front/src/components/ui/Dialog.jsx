import { useEffect, useRef } from "react";
import Icon from "./Icon";

/**
 * Modal padrão da área do cliente (mesmo padrão do AdminDialog): Esc e clique
 * fora fecham, a rolagem do fundo fica travada e o foco entra no modal e volta
 * a quem o abriu.
 */
export default function Dialog({ title, titleId, onClose, children, wide = false }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeRef.current();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6"
      onClick={() => closeRef.current()}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className={`relative my-auto w-full ${wide ? "max-w-lg" : "max-w-md"} rounded-[20px] border border-hairline bg-surface-1 p-5 focus:outline-none`}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={() => closeRef.current()}
          className="absolute right-4 top-4 rounded-lg p-1 text-cream/60 transition hover:text-cream"
        >
          <Icon name="close" size={18} />
        </button>
        <h2 id={titleId} className="app-section-title pr-8 text-cream">
          {title}
        </h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
