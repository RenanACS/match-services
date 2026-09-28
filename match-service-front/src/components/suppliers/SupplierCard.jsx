import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../dashboard/icons";
import { StarIcon } from "./icons";

/**
 * Card de fornecedor no catálogo. Mostra só o essencial para a etapa de
 * descoberta (nome, categoria, descrição curta, avaliação, localização e
 * ação); dados cadastrais (CNPJ, telefone, e-mail) e preço pertencem à
 * futura tela de detalhes/propostas, não ao catálogo inicial.
 */
export default function SupplierCard({ supplier }) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-hairline bg-surface-1 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-cream">
            {supplier.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-cream/50">
            {supplier.category}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-cream/80">
          <StarIcon className="text-orange-light" />
          {supplier.rating.toFixed(1).replace(".", ",")}
        </span>
      </div>

      <p className="text-sm text-cream/60">{supplier.description}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-cream/45">
          {supplier.location}
        </span>
        <Link
          to={`/app/fornecedores/${supplier.id}`}
          className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
        >
          Ver fornecedor
          <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
    </div>
  );
}
