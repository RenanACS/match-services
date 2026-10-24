import { useEffect, useRef } from "react";

/**
 * Comportamento comum dos modais administrativos: Esc fecha, a rolagem do
 * fundo fica travada, o foco entra no modal, circula com Tab e volta ao
 * elemento que abriu o modal ao fechar.
 */
export default function useDialogBehavior(onClose, containerRef, initialFocusRef) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !containerRef.current) return;
      const focusable = [...containerRef.current.querySelectorAll("button, textarea, input, select, a[href]")].filter(
        (el) => !el.disabled,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    (initialFocusRef?.current ?? containerRef.current?.querySelector("button"))?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
    };
  }, [containerRef, initialFocusRef]);
}
