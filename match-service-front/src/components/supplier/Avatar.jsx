import { getInitials } from "../../utils/supplierFormat";

export default function Avatar({ name, size = "md" }) {
  const sizeClass = size === "lg" ? "h-12 w-12 app-text" : "h-9 w-9 app-small";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface-3 font-medium text-cream/80 ${sizeClass}`}
    >
      {getInitials(name)}
    </span>
  );
}
