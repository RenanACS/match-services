import { useEffect } from "react";

// Fecha um popup (menu, lista) ao clicar fora dele ou apertar Esc.
export default function useDismiss(ref, open, onDismiss) {
  useEffect(() => {
    if (!open) return undefined;
    function handlePointer(event) {
      if (ref.current && !ref.current.contains(event.target)) onDismiss();
    }
    function handleKey(event) {
      if (event.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, open, onDismiss]);
}
