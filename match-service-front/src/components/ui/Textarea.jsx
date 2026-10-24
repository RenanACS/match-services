export default function Textarea({ label, id, appearance = "default", className = "", ...props }) {
  const app = appearance === "app";
  return (
    <div className={`flex flex-col ${app ? "gap-1" : "gap-1.5"}`}>
      {label && (
        <label
          htmlFor={id}
          className={app ? "app-small font-medium text-cream/70" : "font-mono text-xs uppercase tracking-widest text-cream/70"}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-xl border border-hairline bg-surface-1 text-cream placeholder:text-cream/70 focus:border-orange focus:outline-none ${
          app ? "app-filter px-3.5 py-2" : "px-4 py-3 text-sm"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
