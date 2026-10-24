import Icon from "./Icon";

export default function Select({ label, id, children, appearance = "default", className = "", ...props }) {
  const app = appearance === "app";
  return (
    <div className={`flex flex-col ${app ? "gap-1" : "gap-1.5"}`}>
      {label && (
        <label
          htmlFor={id}
          className={app ? "app-small font-medium text-cream/70" : "font-mono text-[11px] uppercase tracking-widest text-cream/60"}
        >
          {label}
        </label>
      )}
      <div className="relative">
      <select
        id={id}
        className={`w-full rounded-xl border border-hairline bg-surface-1 text-cream focus:border-orange focus:outline-none ${
          app ? "app-filter min-h-[40px] appearance-none py-1.5 pl-3 pr-9" : "min-h-[44px] px-4 py-3 text-sm"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {app && (
        <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream/60" />
      )}
      </div>
    </div>
  );
}
