import Icon from "./AdminIcons";

/** Select com rótulo acima (padrão do protótipo); largura contida, não estica. */
export default function AdminLabeledSelect({ id, label, options, value, onChange, className = "sm:w-44" }) {
  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="adm-small leading-none text-cream/70">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="adm-filter min-h-[40px] w-full cursor-pointer appearance-none rounded-xl border border-hairline bg-surface-1 py-1.5 pl-3 pr-9 text-cream focus:border-orange focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream/70"
        />
      </div>
    </div>
  );
}
