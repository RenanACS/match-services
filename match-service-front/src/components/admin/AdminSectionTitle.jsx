import Icon from "./AdminIcons";

/** Título de seção do Admin: Space Grotesk 18px (adm-section-title) + ícone padrão. */
export default function AdminSectionTitle({ id, icon, children, className = "" }) {
  return (
    <h2 id={id} className={`adm-section-title flex items-center gap-2.5 ${className}`}>
      {icon && <Icon name={icon} size={18} className="text-cream/70" />}
      {children}
    </h2>
  );
}
