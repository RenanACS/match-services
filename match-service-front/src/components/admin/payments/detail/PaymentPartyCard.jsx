import { Link } from "react-router-dom";
import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";

/**
 * Cartão compacto Cliente / Fornecedor: nome, documento (CPF/CNPJ como vem dos
 * dados, já mascarado quando é do cliente) e link para o perfil administrativo.
 * O botão fica na linha do título para o nome da empresa ter a largura toda.
 */
export default function PaymentPartyCard({ id, title, icon, name, documentLabel, documentValue, to }) {
  return (
    <section aria-labelledby={id} className="rounded-[20px] border border-hairline bg-surface-1 p-5 xl:py-4">
      <div className="flex items-center justify-between gap-3">
        <AdminSectionTitle id={id} icon={icon}>{title}</AdminSectionTitle>
        <Link
          to={to}
          className="adm-button flex min-h-[34px] shrink-0 items-center gap-2 rounded-xl border border-hairline px-3.5 text-cream transition hover:border-orange/60 hover:text-orange"
        >
          Ver perfil
          <Icon name="arrowRight" size={16} />
        </Link>
      </div>
      <dl className="mt-3 grid grid-cols-[3fr_2fr] gap-4">
        <div className="min-w-0">
          <dt className="adm-small text-cream/70">Nome</dt>
          <dd title={name} className="adm-text mt-0.5 truncate font-medium text-cream">{name}</dd>
        </div>
        <div className="min-w-0">
          <dt className="adm-small text-cream/70">{documentLabel}</dt>
          <dd className="adm-text mt-0.5 truncate text-cream/80">{documentValue}</dd>
        </div>
      </dl>
    </section>
  );
}
