import Icon from "./Icon";

/** Título de seção: Space Grotesk 16px (app-section-title) + ícone padrão. */
export default function SectionTitle({ id, icon, children, className = "" }) {
  return (
    <h2 id={id} className={`app-section-title flex items-center gap-2.5 ${className}`}>
      {icon && <Icon name={icon} size={18} className="text-cream/70" />}
      {children}
    </h2>
  );
}
