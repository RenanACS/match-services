import { useRef } from "react";
import { TABS } from "./helpers";

/** Abas internas (Visão geral · Serviços · Documentos · Avaliações · Histórico · Financeiro). */
export default function SupplierTabs({ active, onChange }) {
  const refs = useRef({});

  function onKeyDown(event, index) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (index + (event.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    onChange(TABS[next].key);
    refs.current[TABS[next].key]?.focus();
  }

  return (
    <div role="tablist" aria-label="Seções do fornecedor" className="flex gap-1 overflow-x-auto border-b border-hairline">
      {TABS.map((tab, index) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              refs.current[tab.key] = el;
            }}
            id={`tab-${tab.key}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab.key}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 adm-text transition ${
              selected ? "border-orange font-medium text-orange" : "border-transparent text-cream/70 hover:text-cream"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
