import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../AdminIcons";
import { ACTIONS_BY_STATUS } from "../../../services/adminSuppliers";

export const ACTION_META = {
  details: { label: "Ver detalhes", icon: "eye", tone: "" },
  analyze: { label: "Analisar cadastro", icon: "clipboard", tone: "" },
  approve: { label: "Aprovar cadastro", icon: "checkCircle", tone: "text-emerald-400" },
  reject: { label: "Rejeitar cadastro", icon: "xCircle", tone: "text-red-400" },
  block: { label: "Bloquear fornecedor", icon: "lock", tone: "text-red-400" },
  unblock: { label: "Desbloquear fornecedor", icon: "unlock", tone: "text-emerald-400" },
  reason: { label: "Consultar motivo da rejeição", icon: "info", tone: "" },
};

const MENU_WIDTH = 248;
const ITEM_HEIGHT = 40;

/** Link "Detalhes ›" laranja (mesmo padrão da tela de Clientes). */
export function SupplierDetailsLink({ supplier, state, className = "" }) {
  return (
    <Link
      to={`/admin/fornecedores/${supplier.id}`}
      state={state}
      className={`inline-flex items-center gap-1 adm-text font-medium text-orange transition hover:text-orange-light ${className}`}
    >
      Detalhes
      <Icon name="chevronRight" size={14} />
    </Link>
  );
}

/**
 * Botão de três pontinhos + menu com SOMENTE as ações compatíveis com o status
 * (ver ACTIONS_BY_STATUS). O menu usa posição fixa calculada a partir do
 * botão (reposicionado ao rolar/redimensionar): nunca é cortado pela tabela,
 * abre para cima quando falta espaço embaixo e não aumenta a altura da página.
 */
export default function SupplierRowActions({ supplier, onAction }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const actions = ACTIONS_BY_STATUS[supplier.status];

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Posiciona o menu junto ao botão (abre para cima se faltar espaço embaixo).
  const reposition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return close();
    const height = actions.length * ITEM_HEIGHT + 16;
    const fitsBelow = rect.bottom + 6 + height <= window.innerHeight - 8;
    setPosition({
      top: fitsBelow ? rect.bottom + 6 : Math.max(8, rect.top - height - 6),
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
  }, [actions.length, close]);

  useLayoutEffect(() => {
    if (open) reposition();
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (menuRef.current?.contains(event.target) || triggerRef.current?.contains(event.target)) return;
      close();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close(true);
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const items = [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])];
        const index = items.indexOf(document.activeElement);
        const next = event.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
        items[next]?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, close, reposition]);

  useEffect(() => {
    if (open && position) menuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [open, position]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Ações de ${supplier.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setPosition(null);
          setOpen((value) => !value);
        }}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-cream/80 transition hover:border-orange/60 hover:text-cream ${
          open ? "border-orange text-cream" : "border-hairline"
        }`}
      >
        <Icon name="dots" size={18} />
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={`Ações de ${supplier.name}`}
          style={{ position: "fixed", top: position?.top ?? 0, left: position?.left ?? 0, width: MENU_WIDTH, visibility: position ? "visible" : "hidden" }}
          className="z-40 rounded-xl border border-hairline bg-surface-2 p-2 shadow-2xl shadow-black/60"
        >
          {actions.map((action) => {
            const meta = ACTION_META[action];
            return (
              <button
                key={action}
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  onAction(action, supplier);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 text-left adm-text text-cream transition hover:bg-surface-3 focus:bg-surface-3 focus:outline-none ${meta.tone}`}
                style={{ height: ITEM_HEIGHT }}
              >
                <Icon name={meta.icon} size={18} />
                <span className="text-cream">{meta.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
