import { getInitials } from "../../utils/supplierFormat";

export default function Avatar({ name, size = "md" }) {
  const sizeClass = size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface-3 font-mono text-cream/80 ${sizeClass}`}
    >
      {getInitials(name)}
    </span>
  );
}
