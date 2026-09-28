export default function Textarea({ label, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-[11px] uppercase tracking-widest text-cream/60"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-xl border border-hairline bg-surface-1 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-orange focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
