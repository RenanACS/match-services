import Icon from "../ui/Icon";

/**
 * Cabeçalho da página de detalhes: identificação da empresa (nome, nota,
 * categoria, localização) e informações institucionais básicas (CNPJ,
 * telefone, tempo na plataforma). A volta ao catálogo é feita pelo
 * breadcrumb e pelo botão "Voltar" do cabeçalho.
 */
export default function SupplierDetailsHeader({ supplier }) {
  const facts = [
    { icon: "building", label: "CNPJ", value: supplier.cnpj },
    { icon: "phone", label: "Telefone", value: supplier.phone },
    { icon: "calendar", label: "No Match Services desde", value: supplier.memberSince },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="app-page-title text-cream">{supplier.name}</h1>
          <span className="app-text flex shrink-0 items-center gap-1.5 font-medium text-cream/80">
            <Icon name="star" size={16} className="fill-current text-orange-light" />
            {supplier.rating.toFixed(1).replace(".", ",")}
          </span>
        </div>
        <p className="app-text mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-cream/60">
          <span>{supplier.category}</span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="mapPin" size={14} />
            {supplier.location}
          </span>
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-3 rounded-[20px] border border-hairline bg-surface-1 p-4 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-start gap-2.5">
            <Icon name={fact.icon} size={16} className="mt-0.5 text-cream/50" />
            <div>
              <dt className="app-small text-cream/50">{fact.label}</dt>
              <dd className="app-text mt-0.5 text-cream/80">{fact.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
