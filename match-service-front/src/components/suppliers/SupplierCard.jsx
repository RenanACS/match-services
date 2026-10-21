import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

/**
 * Card de fornecedor no catálogo. Mostra só o essencial para a etapa de
 * descoberta (nome, categoria, descrição curta, avaliação, localização e
 * ação); dados cadastrais (CNPJ, telefone, e-mail) e preço pertencem à
 * tela de detalhes, não ao catálogo.
 */
export default function SupplierCard({ supplier }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[20px] border border-hairline bg-surface-1 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="app-text truncate font-semibold text-cream">{supplier.name}</h3>
          <p className="app-small mt-0.5 text-cream/50">{supplier.category}</p>
        </div>
        <span className="app-text flex shrink-0 items-center gap-1 font-medium text-cream/80">
          <Icon name="star" size={14} className="fill-current text-orange-light" />
          {supplier.rating.toFixed(1).replace(".", ",")}
        </span>
      </div>

      <p className="app-text text-cream/60">{supplier.description}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-2.5">
        <span className="app-small inline-flex items-center gap-1.5 text-cream/50">
          <Icon name="mapPin" size={14} />
          {supplier.location}
        </span>
        <Link
          to={`/app/fornecedores/${supplier.id}`}
          className="app-text inline-flex shrink-0 items-center gap-1.5 text-cream/60 transition hover:text-orange"
        >
          Ver fornecedor
          <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </div>
  );
}
