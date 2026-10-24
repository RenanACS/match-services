import { Link } from "react-router-dom";
import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";
import { PartyAvatar } from "../RequestParts";

/** Card Cliente / Fornecedor: identificação, contato e botão para o perfil administrativo. */
export default function RequestPartyCard({ id, title, icon, name, documentLine, locationLine, phone, email, to, buttonLabel }) {
  return (
    <section aria-labelledby={id} className="flex flex-col rounded-[20px] border border-hairline bg-surface-1 p-5">
      <AdminSectionTitle id={id} icon={icon} className="border-b border-hairline pb-3">
        {title}
      </AdminSectionTitle>
      <div className="mt-4 flex items-center gap-4">
        <PartyAvatar name={name} size="lg" />
        <div className="min-w-0">
          <p className="adm-text break-words font-medium text-cream">{name}</p>
          <p className="adm-small mt-0.5 text-cream/70">{documentLine}</p>
          <p className="adm-small text-cream/70">{locationLine}</p>
        </div>
      </div>
      <ul className="adm-text mt-4 flex flex-col gap-2.5 text-cream/80">
        <li className="flex items-center gap-3"><Icon name="phone" size={16} className="text-cream/70" />{phone}</li>
        <li className="flex min-w-0 items-center gap-3"><Icon name="mail" size={16} className="text-cream/70" /><span className="truncate">{email}</span></li>
      </ul>
      <div className="flex-1" />
      <Link
        to={to}
        className="adm-button mt-5 flex min-h-[40px] items-center justify-between rounded-xl border border-hairline px-4 text-cream transition hover:border-orange/60 hover:text-orange"
      >
        {buttonLabel}
        <Icon name="chevronRight" size={16} />
      </Link>
    </section>
  );
}
