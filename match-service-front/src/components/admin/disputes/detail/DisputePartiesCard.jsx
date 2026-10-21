import { Link } from "react-router-dom";
import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";
import { money } from "../../requests/RequestParts";

function Party({ label, title, subtitle, to, linkLabel }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:px-5 sm:first:pl-0 sm:last:pr-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-hairline">
      <p className="adm-small text-cream/60">{label}</p>
      <div className="min-w-0">
        <p title={title} className="adm-text truncate font-medium text-cream">{title}</p>
        <p className="adm-small truncate text-cream/60">{subtitle}</p>
      </div>
      <Link to={to} className="adm-button mt-auto inline-flex min-h-[34px] items-center justify-between gap-2 self-start rounded-xl border border-hairline px-3.5 text-cream transition hover:border-orange/60 hover:text-orange">
        {linkLabel}
        <Icon name="arrowRight" size={16} />
      </Link>
    </div>
  );
}

/** Cliente, fornecedor e solicitação vinculada, com links para as rotas existentes. */
export default function DisputePartiesCard({ dispute }) {
  const { client, supplier, request } = dispute;
  return (
    <section aria-labelledby="dispute-parties" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <AdminSectionTitle id="dispute-parties" icon="users">Partes envolvidas</AdminSectionTitle>
      <div className="mt-3 grid gap-4 sm:grid-cols-3 sm:gap-0">
        <Party label="Cliente" title={client.name} subtitle={`${client.type === "PF" ? "CPF" : "CNPJ"} ${client.document}`} to={`/admin/clientes/${client.id}`} linkLabel="Ver perfil" />
        <Party label="Fornecedor" title={supplier.name} subtitle={`CNPJ ${supplier.cnpj}`} to={`/admin/fornecedores/${supplier.id}`} linkLabel="Ver perfil" />
        <Party label="Solicitação" title={`#${request.id} · ${request.service.name}`} subtitle={`${request.service.category} · ${money(request.valueCents)}`} to={`/admin/solicitacoes/${request.id}`} linkLabel="Ver solicitação" />
      </div>
    </section>
  );
}
